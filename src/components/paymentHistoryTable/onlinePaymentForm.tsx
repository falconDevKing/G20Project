import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardElement, AddressElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { onlinePaymentFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialiseOptions, RemissionPeriodsOptions } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { findChapterDetails, getUserWithUniqueCode, initialPayerData, type PayerDataType } from "@/services/payment";
import { SelectOptions } from "@/interfaces/register";
import { refreshLoggedInUser } from "@/services/auth";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel } from "../ui/alert-dialog";
import axios, { isAxiosError } from "axios";
import PaystackInlineButton from "./paystackButton";
import { getCurrencySymbol } from "@/lib/numberUtils";

const stripeApiUrl = import.meta.env.VITE_APP_STRIPE_LAMBDA_URL || "";

interface MakeOnlinePaymentFormProps {
  filterData: () => void;
  forUser?: boolean;
  handleBankPopupClosed?: () => void;
  openOneTime: boolean;
  setOpenOneTime: (open: boolean) => void;
  setOpenDialog: (open: boolean) => void;
}

type OnlinePaymentFormValues = z.infer<typeof onlinePaymentFormSchema>;

export const MakeOnlinePaymentForm = ({ filterData, handleBankPopupClosed, openOneTime, setOpenOneTime, setOpenDialog }: MakeOnlinePaymentFormProps) => {
  const appState = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.auth.userDetails);

  const { email } = user;
  const unique_code = user.unique_code;

  const { DivisionOptions, ChapterOptions } = initialiseOptions(appState);

  const [loading, setLoading] = useState(false);
  const [chapterCurrency, setChapterCurrency] = useState("");
  const [FeedbackMessage, setFeedbackMessage] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);
  const [payerCode, setPayerCode] = useState(unique_code);
  const [payerData, setPayerData] = useState<PayerDataType>(initialPayerData);

  const form = useForm<OnlinePaymentFormValues>({
    resolver: zodResolver(onlinePaymentFormSchema),
    defaultValues: {
      unique_code: unique_code,
      amount: 0,
      description: "",
      remission_period: "",
      chapter_id: "",
      division_id: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const isFormValid = form.formState.isValid;
  const selectedChapterId = form.watch("chapter_id");
  const selectedChapterCurrecny = useMemo(() => findChapterDetails(selectedChapterId)?.currency, [selectedChapterId]);

  const stripe = useStripe();
  const elements = useElements();

  const goToForm = () => {
    setIsCheckout(false);
  };

  const savePaymentRecordPaystack = async () => {
    try {
      setLoading(true);

      if (user.id === payerData.user_id) {
        await refreshLoggedInUser(user.id || "");
        filterData();
      }

      form.reset();
      setLoading(false);
      setIsCheckout(false);
      setOpenOneTime(false);
      setFeedbackMessage("");
      SuccessHandler("Payment Successful. Remission processing...");
    } catch (error) {
      console.log("register error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const savePaymentRecord = async () => {
    try {
      setLoading(true);

      setFeedbackMessage(`Payment Succeeded ... 3 of 3`);

      if (user.id === payerData.user_id) {
        await refreshLoggedInUser(user.id || "");
      }
      filterData();

      form.reset();
      setLoading(false);
      setIsCheckout(false);
      setOpenOneTime(false);
      setOpenDialog(false);
      setFeedbackMessage("");
      SuccessHandler("Remission Recorded");
    } catch (error) {
      console.log("register error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const makeStripePayment = async (values: OnlinePaymentFormValues) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    const { amount, remission_period } = values;

    setLoading(true);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setFeedbackMessage("Stripe has not yet loaded.");
      ErrorHandler("Online Payment Processor");
      return;
    }

    const addressElement = elements.getElement(AddressElement);
    const addressDetails = addressElement ? await addressElement.getValue() : null;

    const paymentDetails = {
      amount: +amount,
      currency: chapterCurrency.toLowerCase(),
      description: `Remission payment for ${remission_period}`,
      receipt_email: email,
      payment_method_types: ["card"],
      payment_method_options: { card: { request_three_d_secure: "any" } },
      metadata: {
        customer_phone: addressDetails?.value.phone || payerData.phone_number || "",
        customer_name: payerData.user_name,
        remission_period,
        customer_email: email,
      },
    };

    let clientSecret = "";
    try {
      const paymentResponse = await axios.post(stripeApiUrl + "/createPaymentIntent", paymentDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      clientSecret = paymentResponse.data.data?.clientSecret;
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error?.response?.data?.message as string;
        ErrorHandler(message);
        setFeedbackMessage(message);
      } else {
        ErrorHandler("Something went wrong");
      }

      return;
    }

    setFeedbackMessage("Processing... 1 of 3");

    if (!clientSecret) {
      return;
    }

    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!, // as StripeCardElement | StripeCardNumberElement | { token: string }
        billing_details: {
          name: addressDetails?.value.name || "",
          email: email || "",
          phone: addressDetails?.value.phone || "",
          address: {
            line1: addressDetails?.value.address.line1 || "",
            line2: addressDetails?.value.address.line2 || "",
            city: addressDetails?.value.address.city || "",
            state: addressDetails?.value.address.state || "",
            postal_code: addressDetails?.value.address.postal_code || "",
            country: addressDetails?.value.address.country || "",
          },
        },
      },
    });

    if (stripeError) {
      // Show error to your customer (e.g., insufficient funds)
      ErrorHandler(stripeError.message || "Error with Payment");
      setFeedbackMessage(stripeError.message || "Error with Payment");
      setLoading(false);
      return;
    }

    setFeedbackMessage("Processing... 2 of 3");

    await savePaymentRecord();
  };

  const onSubmit = async (values: OnlinePaymentFormValues) => {
    try {
      if (chapterCurrency === "NGN") {
        // if (chapterCurrency) {
        return;
      }

      setLoading(true);

      if (!isCheckout) {
        setIsCheckout(true);
        return;
      }

      if (!payerData.user_name) {
        ErrorHandler("Can't find User");
        return;
      }

      const fetchPayerCurrency = async (unique_code: string) => {
        const payerData = await getUserWithUniqueCode(unique_code);

        const { chapter_id } = payerData;
        const { currency } = findChapterDetails(chapter_id);
        setChapterCurrency(currency);
      };
      unique_code && (await fetchPayerCurrency(unique_code));

      await makeStripePayment(values);
    } catch (error) {
      console.log("Payment Error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const values = form.watch();

  useEffect(() => {
    const fetchPayerData = async (unique_code: string) => {
      const payerData = await getUserWithUniqueCode(unique_code);

      const { chapter_id, division_id } = payerData;
      const { currency } = findChapterDetails(chapter_id);
      form.setValue("division_id", division_id);
      form.setValue("chapter_id", chapter_id);
      setChapterCurrency(currency);
      setPayerData(payerData);
    };

    if (payerCode) {
      fetchPayerData(payerCode);
    }
  }, [form, payerCode, openOneTime]);

  useEffect(() => {
    if (unique_code) {
      setPayerCode(unique_code);
    }
  }, [unique_code]);

  return (
    <div>
      <AlertDialog open={openOneTime} onOpenChange={setOpenOneTime}>
        <AlertDialogContent className="max-w-xl bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="">Make One Time Payment</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                {!isCheckout && (
                  <div>
                    <div className=" md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0 mb-2 md:mt-0">
                      <FormField
                        control={form.control}
                        name="unique_code"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-[#111c30] font-normal text-base">Personal Code</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <Input
                                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                                onChange={(e) => {
                                  setPayerCode(e.target.value);
                                  field.onChange(e);
                                }}
                                placeholder="XY-12345"
                                allowDark={false}
                              />
                            </FormControl>
                            <FormMessage />
                            <div className={`text-[0.8rem] italic font-medium ${payerData?.user_name ? "text-dark" : "text-destructive"}`}>
                              {payerCode && (payerData?.user_name || "Unknown user")}
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-[#111c30] font-normal text-base">Amount</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <div className="flex gap-1">
                                {selectedChapterCurrecny && (
                                  <Button type="button" variant="outline" className="max-w-max h-[44px] border-input bg-transparent">
                                    {getCurrencySymbol(selectedChapterCurrecny)}
                                  </Button>
                                )}
                                <Input
                                  type="number"
                                  min={0}
                                  className="focus-visible:ring-0  focus-visible:ring-offset-0 text-"
                                  {...field}
                                  placeholder="e.g 100000"
                                  allowDark={false}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                      <FormField
                        control={form.control}
                        name="division_id"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-[#111c30] font-normal  text-base">Division</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <Select disabled onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <SelectTrigger className="shad-select-trigger" enforceWhite>
                                  <SelectValue placeholder="Select your Division" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {DivisionOptions.map((division: SelectOptions) => (
                                    <SelectItem key={division.value} value={division.value as string}>
                                      <div className="flex items-center cursor-pointer gap-3">
                                        <p>{division.name}</p>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="chapter_id"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-[#111c30]  font-normal text-base">Chapter</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <Select disabled onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <SelectTrigger className="shad-select-trigger" enforceWhite>
                                  <SelectValue placeholder="Select your Chapter" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {ChapterOptions.map((chapter: SelectOptions) => (
                                    <SelectItem key={chapter.value} value={chapter.value as string}>
                                      <div className="flex items-center cursor-pointer gap-3">
                                        <p>{chapter.name}</p>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className=" md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0 my-8 ">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-[#111c30]  font-normal text-base">Description</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                                placeholder="Any useful details about the payment..."
                                maxLength={96}
                                allowDark={false}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="remission_period"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-[#111c30]  font-normal text-base">Remission Month</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <SelectTrigger className="shad-select-trigger" allowDark={false} enforceWhite>
                                  <SelectValue placeholder="Select Payment Period" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {RemissionPeriodsOptions.map((RemissionPeriod: SelectOptions) => (
                                    <SelectItem key={RemissionPeriod.value} value={RemissionPeriod.value as string}>
                                      <div className="flex items-center cursor-pointer gap-3">
                                        <p>{RemissionPeriod.name}</p>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                {isCheckout ? (
                  chapterCurrency === "NGN" ? (
                    // chapterCurrency ? (
                    <div className="text-sm italic">N.B.: Paystack handles card details securely</div>
                  ) : (
                    <div className="">
                      <div className="font-semibold py-2">Card Details</div>
                      <CardElement id="card" />

                      <div className="font-semibold pt-4">Address Details</div>
                      <AddressElement options={{ mode: "billing" }} />
                    </div>
                  )
                ) : (
                  " "
                )}

                <div className="text-center">{FeedbackMessage}</div>
              </div>
              <AlertDialogFooter>
                {isCheckout ? (
                  <Button disabled={loading} size={"lg"} className="w-full dark:bg-white hover:text-black" variant="outline2" type="button" onClick={goToForm}>
                    Back
                  </Button>
                ) : (
                  <AlertDialogCancel className="h-11 rounded-md px-8 w-full dark:bg-white hover:text-black" type="button">
                    Cancel
                  </AlertDialogCancel>
                )}
                {chapterCurrency === "NGN" ? (
                  <PaystackInlineButton
                    onSuccess={savePaymentRecordPaystack}
                    unique_code={unique_code}
                    amount={values.amount}
                    remission_period={values.remission_period}
                    description={values.description || ""}
                    email={email}
                    currency={chapterCurrency}
                    user_id={payerData.user_id}
                    user_name={payerData.user_name}
                    onClose={() => {
                      setOpenOneTime(false);
                      setOpenDialog(false);
                    }}
                    handleBankPopupClosed={handleBankPopupClosed}
                    isFormValid={isFormValid}
                  />
                ) : (
                  <Button disabled={loading || chapterCurrency === "NGN"} size={"lg"} type="submit" className="w-full" variant="custom">
                    {isCheckout ? "Submit" : "Go to Payment"}
                  </Button>
                )}
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
