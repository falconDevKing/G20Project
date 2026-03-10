import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardElement, AddressElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { onlineMonthlyPaymentFormSchema, onlineMonthlyPaymentFormStripeSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialiseOptions, RemissionDayOptions } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import dayjs from "dayjs";
import { findChapterDetails, getUserWithUniqueCode, initialPayerData, type PayerDataType } from "@/services/payment";
import { refreshLoggedInUser } from "@/services/auth";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel } from "../ui/alert-dialog";
import axios, { isAxiosError } from "axios";
import { SelectOptions } from "@/interfaces/register";
import PaystackInlineButton from "./paystackButton";
import { getCurrencySymbol, getFirstPaymentDateSequence } from "@/lib/numberUtils";

const stripeApiUrl = import.meta.env.VITE_APP_STRIPE_LAMBDA_URL || "";

interface MakeOnlineMonthlyPaymentFormProps {
  filterData?: () => void;
  handleBankPopupClosed?: () => void;
  forUser?: boolean;
  openMonthly: boolean;
  setOpenMonthly: (open: boolean) => void;
  setOpenDialog: (open: boolean) => void;
}

type OnlineMonthlyPaymentFormValues = z.infer<typeof onlineMonthlyPaymentFormSchema>;

export const MakeOnlineMonthlyPaymentForm = ({
  filterData,
  handleBankPopupClosed,
  openMonthly,
  setOpenMonthly,
  setOpenDialog,
}: MakeOnlineMonthlyPaymentFormProps) => {
  const appState = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.auth.userDetails);

  const { division_id, chapter_id, email } = user;
  const unique_code = user.unique_code;

  const { DivisionOptions, ChapterOptions } = initialiseOptions(appState);

  const [loading, setLoading] = useState(false);
  const [chapterCurrency, setChapterCurrency] = useState("");
  const [FeedbackMessage, setFeedbackMessage] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);
  const [payerCode, setPayerCode] = useState(unique_code);
  const [payerData, setPayerData] = useState<PayerDataType>(initialPayerData);

  const { user_id, user_name } = payerData;

  const form = useForm<OnlineMonthlyPaymentFormValues>({
    resolver: zodResolver(chapterCurrency === "NGN" ? onlineMonthlyPaymentFormSchema : onlineMonthlyPaymentFormStripeSchema),
    defaultValues: {
      unique_code: unique_code,
      amount: 0,
      description: "",
      remission_day: "1",
      first_payment_day: "",
      division_id: division_id || "",
      chapter_id: chapter_id || "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const isFormValid = form.formState.isValid;
  const selectedChapterCurrecny = useMemo(() => findChapterDetails(chapter_id)?.currency, [chapter_id]);

  const stripe = useStripe();
  const elements = useElements();

  const goToForm = () => {
    setIsCheckout(false);
  };
  const remission_period = dayjs().format("MMMM YYYY");

  const savePaymentRecord = async () => {
    try {
      setLoading(true);
      setFeedbackMessage(`Payment Succeeded ... 4 of 4`);

      if (user.id === payerData.user_id) {
        await refreshLoggedInUser(user.id || "");
      }
      filterData?.();

      form.reset();
      setLoading(false);
      setIsCheckout(false);
      setOpenMonthly(false);
      setOpenDialog(false);
      setFeedbackMessage("");
      SuccessHandler("Remission Recorded");
    } catch (error) {
      console.log("Error in processing payment", error);
      ErrorHandler("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const makeStripePayment = async (values: OnlineMonthlyPaymentFormValues) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    const { amount, remission_day, unique_code, description, first_payment_day } = values;
    const { currency } = findChapterDetails(chapter_id);

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
    const user_address = {
      line1: addressDetails?.value.address.line1 || "",
      line2: addressDetails?.value.address.line2 || "",
      city: addressDetails?.value.address.city || "",
      state: addressDetails?.value.address.state || "",
      postal_code: addressDetails?.value.address.postal_code || "",
      country: addressDetails?.value.address.country || "",
    };
    const billing_details = {
      name: addressDetails?.value.name || "",
      email: email || "",
      phone: addressDetails?.value.phone || "",
      address: user_address,
    };

    const paymentDetails = {
      unique_code,
      remission_day,
      first_payment_day,
      user_description: description,
      user_id: user_id,
      user_name: user_name,
      amount: +amount,
      user_email: email,
      currency: (chapterCurrency || currency).toLowerCase(),
      description: `Monthly Remission payment for ${user_name}`,
      user_address,
      phone: addressDetails?.value.phone || "",

      // payment_method_types: ["card"],
      // payment_method_options: { card: { request_three_d_secure: "any" } },
    };

    let clientSecret = "";
    let customer_id = "";

    try {
      const paymentResponse = await axios.post(stripeApiUrl + "/createRecurringPaymentIntent", paymentDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      clientSecret = paymentResponse.data.data?.clientSecret;
      customer_id = paymentResponse.data.data?.customerId;
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error?.response?.data?.message as string;
        ErrorHandler(message);
        setFeedbackMessage("Payment Processing Failed");
      } else {
        ErrorHandler("Something went wrong");
      }

      return;
    }

    setFeedbackMessage("Processing... 1 of 4");

    if (!clientSecret) {
      ErrorHandler("Error with Payment");
      setFeedbackMessage("Error with Payment");
      setLoading(false);
      return;
    }

    const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!, // as StripeCardElement | StripeCardNumberElement | { token: string }
        billing_details: billing_details,
      },
    });

    if (stripeError) {
      // Show error to your customer (e.g., insufficient funds)
      ErrorHandler(stripeError.message || "Error with Payment");
      // setFeedbackMessage(stripeError.message || "Error with Payment");
      setLoading(false);
      return;
    }

    setFeedbackMessage("Processing... 2 of 4");

    const payment_method_id = setupIntent.payment_method;
    const updatedPaymentDetails = { ...paymentDetails, customer_id, payment_method_id };

    let subscriptionAndInvoice: Record<string, any>;

    try {
      const subscriptionResponse = await axios.post(stripeApiUrl + "/createRecurringPayment", updatedPaymentDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      subscriptionAndInvoice = subscriptionResponse.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error?.response?.data?.message as string;
        ErrorHandler(message);
        setFeedbackMessage("Payment Processing Failed");
      } else {
        ErrorHandler("Something went wrong");
      }

      return;
    }

    console.log("subcription created and invoice paid", subscriptionAndInvoice);
    // if (subscription?.latest_invoice?.payment_intent?.status === "requires_action") {
    //   const result = await stripe.confirmCardPayment(subscription.latest_invoice.payment_intent.client_secret);

    //   if (result.error) {
    //     console.error("Payment failed:", result.error.message);
    //     setFeedbackMessage("Payment Processing Failed");
    //   }
    // } else if (subscription?.latest_invoice?.payment_intent?.status === "requires_confirmation") {
    //   const result = await stripe.confirmCardPayment(subscription.latest_invoice.payment_intent.client_secret);

    //   if (result.error) {
    //     console.error("Payment failed:", result.error.message);
    //     setFeedbackMessage("Payment Processing Failed");
    //   }
    // }
    setFeedbackMessage("Processing... 3 of 4");

    await savePaymentRecord();
  };

  const onSubmit = async (values: OnlineMonthlyPaymentFormValues) => {
    try {
      if (chapterCurrency === "NGN") {
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

  useEffect(() => {
    const fetchPayerData = async (unique_code: string) => {
      const payerData = await getUserWithUniqueCode(unique_code);

      const { chapter_id, division_id } = payerData;
      const { currency } = findChapterDetails(chapter_id);
      setChapterCurrency(currency);
      setPayerData(payerData);
      form.setValue("division_id", division_id || "");
      form.setValue("chapter_id", chapter_id || "");
    };

    if (payerCode) {
      fetchPayerData(payerCode);
    }
  }, [form, payerCode, openMonthly]);

  const values = form.watch();

  useEffect(() => {
    if (unique_code) {
      setPayerCode(unique_code);
    }
  }, [unique_code]);

  return (
    <AlertDialog open={openMonthly} onOpenChange={setOpenMonthly}>
      {/* <div className="flex justify-end mb-6"> */}
      {/* <AlertDialogTrigger asChild>
        <AlertDialogTrigger asChild className="my-2 xl:my-0">
          <Button size={"lg"} variant="custom" className="w-full md:w-auto min-w-70"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setOpenMonthly(true);
            }}>
            <Calendars className="w-4 h-4 mr-2" />
            Automate Monthly Remissions
          </Button>
        </AlertDialogTrigger>
      </AlertDialogTrigger> */}
      {/* </div> */}

      <AlertDialogContent className="max-w-xl bg-white p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="">
            <div className="text-xl font-bold self-start md:self-auto">Automate your Monthly Remissions</div>
            {chapterCurrency === "NGN" ? <div className="text-xs font-bold self-start md:self-auto">N.B.: First remission happens immediately.</div> : ""}
          </AlertDialogTitle>
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
                          <div className={`text-[0.8rem] italic font-medium ${payerData?.user_name ? "text-black" : "text-destructive"}`}>
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
                                className="focus-visible:ring-0 focus-visible:ring-offset-0"
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
                            <Select disabled onValueChange={field.onChange} defaultValue={division_id} value={field.value}>
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
                            <Select disabled onValueChange={field.onChange} defaultValue={chapter_id} value={field.value}>
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

                  {chapterCurrency === "NGN" ? (
                    <div className=" md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0 my-4 ">
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
                        name="remission_day"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-[#111c30]  font-normal text-base">Day for subsequent remissions</FormLabel>

                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <SelectTrigger className="shad-select-trigger" allowDark={false} enforceWhite>
                                  <SelectValue placeholder="Select Preferred Payment Day" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {RemissionDayOptions.map((RemissionDay: string) => (
                                    <SelectItem key={RemissionDay} value={RemissionDay}>
                                      <div className="flex items-center cursor-pointer gap-3">
                                        <p>{RemissionDay}</p>
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
                  ) : (
                    <>
                      <div className=" md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0 my-4 ">
                        <FormField
                          control={form.control}
                          name="remission_day"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1">
                                <FormLabel className="text-[#111c30]  font-normal text-base">Day for subsequent remissions</FormLabel>

                                <span className="text-red-500 text-base">*</span>
                              </div>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    form.setValue("first_payment_day", "");
                                  }}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <SelectTrigger className="shad-select-trigger" allowDark={false} enforceWhite>
                                    <SelectValue placeholder="Select Preferred Payment Day" />
                                  </SelectTrigger>
                                  <SelectContent className="shad-select-content">
                                    {RemissionDayOptions.map((RemissionDay: string) => (
                                      <SelectItem key={RemissionDay} value={RemissionDay}>
                                        <div className="flex items-center cursor-pointer gap-3">
                                          <p>{RemissionDay}</p>
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
                          name="first_payment_day"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1">
                                <FormLabel className="text-[#111c30]  font-normal text-base">Select Date for First Payment</FormLabel>

                                <span className="text-red-500 text-base">*</span>
                              </div>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                  <SelectTrigger className="shad-select-trigger" allowDark={false} enforceWhite>
                                    <SelectValue placeholder="Select Preferred Payment Day" />
                                  </SelectTrigger>
                                  <SelectContent className="shad-select-content">
                                    {getFirstPaymentDateSequence(+form.watch("remission_day")).map((firstPaymentDay: { value: string; name: string }) => (
                                      <SelectItem key={firstPaymentDay.value} value={firstPaymentDay.value}>
                                        <div className="flex items-center cursor-pointer gap-3">
                                          <p>{firstPaymentDay.name}</p>
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

                      <div className=" md:grid grid-cols-1 gap-3 space-y-3 md:space-y-0 my-4 ">
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
                      </div>
                    </>
                  )}
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
                <AlertDialogCancel className="h-11 rounded-md px-8 w-full  dark:bg-white hover:text-black" type="button">
                  Cancel
                </AlertDialogCancel>
              )}
              {chapterCurrency === "NGN" ? (
                <PaystackInlineButton
                  onSuccess={savePaymentRecord}
                  unique_code={unique_code}
                  amount={values.amount}
                  remission_period={remission_period}
                  description={values.description || ""}
                  email={email}
                  currency={chapterCurrency}
                  user_id={payerData.user_id}
                  user_name={payerData.user_name}
                  onClose={() => {
                    setOpenMonthly(false);
                    setOpenDialog(false);
                  }}
                  handleBankPopupClosed={handleBankPopupClosed}
                  isFormValid={isFormValid}
                  remission_day={values.remission_day}
                  monthly={true}
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
  );
};
