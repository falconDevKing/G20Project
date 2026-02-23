import { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardElement, AddressElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { visitorOnlinePaymentFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RemissionDayOptions } from "@/lib/utils";
import dayjs from "dayjs";
// import { findChapterDetails, getUser, getUserByEmail, makePayment } from "@/services/payment";
// import { sendEmail } from "@/services/sendMail";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
// import FetchGBPExchangeRatesValue from "@/lib/fetchGBPExchangeRatesValue";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import axios, { isAxiosError } from "axios";
// import PaymentReciept from "@/mailTemplates/paymentRecieptNew";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { WorldCurrenciesPaymentOptions } from "@/constants/currencies";
// import { useAppSelector } from "@/redux/hooks";
import MoneyBagIcon from "@/assets/moneyBag.svg?react";
import WhiteMoneyBagIcon from "@/assets/whiteMoneyBag.svg?react";
import PaystackInlineButton from "./paystackButton";
// import { sendPaymentReceivedMessage } from "@/services/twilioMessaging";
import { getFirstPaymentDateSequence } from "@/lib/numberUtils";
// import { getFirstPaymentDateSequence, numberWithCurrencyFormatter } from "@/lib/numberUtils";

const stripeApiUrl = import.meta.env.VITE_APP_STRIPE_LAMBDA_URL || "";
// const guestUserId = import.meta.env.VITE_APP_GUEST_USER_ID || "";

type VisitorOnlinePaymentFormValues = z.infer<typeof visitorOnlinePaymentFormSchema>;

export const VisitorOnlinePayment = ({
  position = "justify-end",
  mode = "normal",
  openPayment = false,
}: {
  position?: string;
  mode?: string;
  openPayment?: boolean;
}) => {
  // const { guestUser } = useAppSelector((state) => state?.app);
  const [openDialog, setOpenDialog] = useState(openPayment || false);

  const [loading, setLoading] = useState(false);
  const [FeedbackMessage, setFeedbackMessage] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);

  const form = useForm<VisitorOnlinePaymentFormValues>({
    resolver: zodResolver(visitorOnlinePaymentFormSchema),
    defaultValues: {
      updateState: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      currency: "",
      amount: 0,
      description: "",
      remission_day: "",
      first_payment_day: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const isFormValid = form.formState.isValid;
  const remission_period = dayjs().format("MMMM YYYY");
  const { updateState, currency: selectedCurrency, first_name, last_name, amount, email, remission_day, description, phone_number } = form.watch();
  const stripe = useStripe();
  const elements = useElements();

  const goToForm = () => {
    setIsCheckout(false);
  };

  const saveMonthlyPaymentRecord = async () => {
    try {
      setLoading(true);

      // const { amount, currency, description, email, phone_number } = values;
      // const existingUser = await getUserByEmail(email);
      // const fallBackUser = existingUser || guestUser || (await getUser(guestUserId));

      // const { division_id, chapter_id, region_id, organisation_id, id: user_id, unique_code } = fallBackUser;

      // const { chapterName } = findChapterDetails(chapter_id);
      // const rate = await FetchGBPExchangeRatesValue(currency);
      // const payment_date = new Date().toISOString();
      // const newEntry = {
      //   amount,
      //   user_name,
      //   status: "Paid",

      //   approved_by: "Online Monthly " + provider,
      //   approved_by_id: "Online Monthly " + provider,
      //   approved_by_image: "Online Monthly " + provider,

      //   currency,
      //   description,

      //   chapter_id,
      //   division_id,
      //   organisation_id,
      //   region_id,

      //   gbp_equivalent: +amount / +(rate || 1),
      //   payment_date: new Date().toISOString(),

      //   remission_period,
      //   remission_month: dayjs().format("MMMM"),
      //   remission_year: dayjs().format("YYYY"),

      //   created_at: new Date().toISOString(),
      //   updated_at: new Date().toISOString(),

      //   unique_code,
      //   user_id,
      // };

      // await makePayment(newEntry);
      // setFeedbackMessage(`Payment Succeeded ... 4 of 4`);

      // // send Mail to client
      // const mailSubject = `Your GGP Remission Has Been Received! Thank You for Partnering with God’s Prophet`;
      // const mailBody = PaymentReciept({
      //   first_name: user_name,
      //   currency,
      //   amount: +amount,
      //   remission_period: "",
      //   remissionDate: dayjs(payment_date).format("MMMM DD, YYYY"),
      //   baseUrl: import.meta.env.VITE_APP_BASE_URL || "",
      //   chapterName,
      //   approved_by: "Online Monthly " + provider,
      // });

      // await sendEmail({ to: [email], mailSubject, mailBody });

      // await sendPaymentReceivedMessage({
      //   to: phone_number,
      //   name: user_name,
      //   amount: numberWithCurrencyFormatter(currency, amount),
      //   period: remission_period,
      //   remission_period: remission_period,
      //   remission_amount: numberWithCurrencyFormatter(currency, amount),
      //   payment_date: dayjs(payment_date).format("MMMM DD, YYYY"),
      //   chapter_name: chapterName,
      //   approved_by_name: "Online Monthly " + provider,
      // });

      form.reset();
      setLoading(false);
      setIsCheckout(false);
      setOpenDialog(false);
      setFeedbackMessage("");
      SuccessHandler("Payment Successful. Remission processing...");
    } catch (error) {
      console.log("Error in processing payment", error);
      ErrorHandler("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const saveOneTimePaymentRecord = async () => {
    try {
      setLoading(true);

      form.reset();
      setLoading(false);
      setIsCheckout(false);
      setOpenDialog(false);
      setFeedbackMessage("");
      SuccessHandler("Payment Successful. Remission processing...");
    } catch (error) {
      console.log("register error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const savePaystackPaymentRecord = async () => {
    try {
      setLoading(true);

      form.reset();
      setLoading(false);
      setIsCheckout(false);
      setOpenDialog(false);
      setFeedbackMessage("");
      SuccessHandler("Payment Successful. Remission processing...");
    } catch (error) {
      console.log("Error in processing payment", error);
      ErrorHandler("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const makeStripePayment = async (values: VisitorOnlinePaymentFormValues) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    const { first_name, last_name, email, phone_number, currency, amount, description, remission_day, first_payment_day } = values;

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
      phone: addressDetails?.value.phone || phone_number || "",
      address: user_address,
    };

    const user_name = first_name + " " + last_name;
    const systemDescription = updateState === "Monthly Seed" ? `Monthly Remission payment for ${user_name}` : `One-time Seed from  ${user_name}`;
    const paymentDetails = {
      amount: +amount,
      currency: currency.toLowerCase(),
      description: systemDescription,
      receipt_email: email,
      payment_method_types: ["card"],
      payment_method_options: { card: { request_three_d_secure: "any" } },
      remission_day,
      first_payment_day,
      user_description: description,
      user_name,
      user_address,
      phone: addressDetails?.value.phone || phone_number || "",
      metadata: { customer_phone: addressDetails?.value.phone || phone_number || "", customer_name: user_name, remission_period, customer_email: email },
    };

    switch (updateState) {
      case "One-time Seed": {
        let clientSecret = "";

        // TODO: Get stripe card details beofre creatinf paymentintent
        try {
          const paymentResponse = await axios.post(stripeApiUrl + "/createGuestPaymentIntent", paymentDetails, {
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
            billing_details,
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
        await saveOneTimePaymentRecord();
        break;
      }
      case "Monthly Seed": {
        let clientSecret = "";
        let customer_id = "";

        try {
          const paymentResponse = await axios.post(stripeApiUrl + "/createGuestRecurringPaymentIntent", paymentDetails, {
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
          const subscriptionResponse = await axios.post(stripeApiUrl + "/createGuestRecurringPayment", updatedPaymentDetails, {
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
        //     // setFeedbackMessage("Payment failed: " + result.error.message);
        //   }
        // } else if (subscription?.latest_invoice?.payment_intent?.status === "requires_confirmation") {
        //   const result = await stripe.confirmCardPayment(subscription.latest_invoice.payment_intent.client_secret);

        //   if (result.error) {
        //     console.error("Payment failed:", result.error.message);
        //     setFeedbackMessage("Payment Processing Failed");
        //     // setFeedbackMessage("Payment failed: " + result.error.message);
        //   }
        // }
        setFeedbackMessage("Processing... 3 of 4");

        await saveMonthlyPaymentRecord();

        break;
      }

      default:
        break;
    }
  };

  const onSubmit = async (values: VisitorOnlinePaymentFormValues) => {
    try {
      setLoading(true);

      if (!isCheckout) {
        setIsCheckout(true);
        return;
      }

      await makeStripePayment(values);
    } catch (error) {
      console.log("Payment Error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <div className={`flex ${position}`}>
          <AlertDialogTrigger asChild className="my-2 xl:my-0">
            <Button
              size={"lg"}
              variant="custom"
              // className="w-full md:w-auto bg-white  text-GGP-darkGold text-lg hover:text-white hover:bg-GGP-darkGold hover:border-white border-2"
              className={
                mode === "red"
                  ? "w-full md:w-auto  bg-[#E7000B] text-white text-lg  hover:bg-white hover:text-red-600 hover:border-red-700 hover:border-2"
                  : "w-full md:w-auto   bg-white   text-GGP-darkGold text-lg hover:text-white hover:bg-GGP-darkGold hover:border-white border-2"
              }
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                setOpenDialog(true);
              }}
            >
              {/* <MoneyBagIcon className="text-white w-4  mr-2 " /> */}
              {mode === "red" ? <WhiteMoneyBagIcon className="text-white w-4 mr-2" /> : <MoneyBagIcon className="text-white w-4 mr-2" />}
              Give Now
            </Button>
          </AlertDialogTrigger>
        </div>

        <AlertDialogContent className="max-w-xl bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="">
              <div className="text-xl font-bold self-start md:self-auto">Users Online Payment</div>
            </AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                {!isCheckout && (
                  <FormField
                    control={form.control}
                    name="updateState"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup className="flex py-2" value={field.value} onValueChange={field.onChange}>
                            {["One-time Seed", "Monthly Seed"].map((action) => (
                              <div
                                className={`flex items-center space-x-2  p-3 w-max rounded-lg ${updateState === action ? "bg-GGP-darkGold" : "border"}`}
                                key={action}
                              >
                                <RadioGroupItem value={action} id={action} />
                                <Label htmlFor={action} className={`text-lg ${updateState === action ? "text-white" : "text-black"}`}>
                                  {action}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div>
                {!isCheckout && (
                  <div>
                    <div className=" lg:grid grid-cols-2 gap-2 space-y-2 md:space-y-0 py-2">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-gray-600/90 font-normal text-base">First Name</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <Input placeholder="Smith" className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0" {...field} allowDark={false} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-gray-600/90 font-normal text-base">Last Name</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <Input placeholder="Doe" className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0" {...field} allowDark={false} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className=" lg:grid grid-cols-2 gap-2 space-y-2 md:space-y-0 py-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-gray-600/90 font-normal text-base">Email</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>

                            <FormControl>
                              <Input
                                type="email"
                                placeholder="smith@gmail.com"
                                className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0"
                                {...field}
                                allowDark={false}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-gray-600/90 font-normal text-base">Phone Number</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <PhoneInput
                                className="flex dark:text-input h-12 w-full rounded-md border border-input dark:border-input/50 dark:bg-transparent bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>input]:border-none [&>input]:outline-none"
                                international
                                onChange={field.onChange}
                                value={field.value}
                                defaultCountry="GB"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className=" lg:grid grid-cols-2 gap-2 space-y-2 md:space-y-0 py-2">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-gray-600/90 font-normal text-base">Currency</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>

                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="shad-select-trigger bg-white" allowDark={false}>
                                  <SelectValue placeholder="Select the Currency" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {WorldCurrenciesPaymentOptions.map((currency) => (
                                    <SelectItem key={currency.value} value={currency.value}>
                                      <div className="flex items-center cursor-pointer gap-3">
                                        <p>{currency.label}</p>
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
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1">
                              <FormLabel className="text-gray-600/90 font-normal text-base">Amount</FormLabel>
                              <span className="text-red-500 text-base">*</span>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1000"
                                className=" focus-visible:ring-0  h-12 focus-visible:ring-offset-0"
                                {...field}
                                allowDark={false}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {updateState === "Monthly Seed" && (
                      <div className={`md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0`}>
                        <FormField
                          control={form.control}
                          name="remission_day"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1">
                                <FormLabel className="text-gray-600/90  font-normal text-base">Day for subsequent remissions</FormLabel>

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
                                  <SelectTrigger className="shad-select-trigger" allowDark={false}>
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

                        {selectedCurrency === "NGN" ? (
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-1">
                                  <FormLabel className="text-gray-600/90 font-normal text-base">Description</FormLabel>
                                </div>
                                <FormControl>
                                  <Input
                                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                    {...field}
                                    placeholder="Any useful details about the payment..."
                                    allowDark={false}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name="first_payment_day"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-1">
                                  <FormLabel className="text-gray-600/90  font-normal text-base">Select Date for First Payment</FormLabel>

                                  <span className="text-red-500 text-base">*</span>
                                </div>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <SelectTrigger className="shad-select-trigger" allowDark={false} enforceWhite>
                                      <SelectValue placeholder="Select Preferred Payment Day" />
                                    </SelectTrigger>
                                    <SelectContent className="shad-select-content">
                                      {getFirstPaymentDateSequence(+(form.watch("remission_day") || 0)).map(
                                        (firstPaymentDay: { value: string; name: string }) => (
                                          <SelectItem key={firstPaymentDay.value} value={firstPaymentDay.value}>
                                            <div className="flex items-center cursor-pointer gap-3">
                                              <p>{firstPaymentDay.name}</p>
                                            </div>
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}

                    {selectedCurrency === "NGN" ? (
                      ""
                    ) : (
                      <div className={`md:grid grid-cols-1 gap-3 space-y-3 md:space-y-0`}>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1">
                                <FormLabel className="text-gray-600/90 font-normal text-base">Description</FormLabel>
                              </div>
                              <FormControl>
                                <Input
                                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                  {...field}
                                  placeholder="Any useful details about the payment..."
                                  allowDark={false}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                )}
                {isCheckout && (
                  <div className="">
                    <div className="font-semibold py-2">Card Details</div>
                    <CardElement id="card" />

                    <div className="font-semibold pt-4">Address Details</div>
                    <AddressElement options={{ mode: "billing" }} />
                  </div>
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
                {selectedCurrency === "NGN" ? (
                  <PaystackInlineButton
                    onSuccess={savePaystackPaymentRecord}
                    unique_code={"Guest"}
                    amount={amount}
                    remission_period={remission_period}
                    description={description || ""}
                    email={email}
                    currency={selectedCurrency}
                    user_id={"Guest"}
                    user_name={first_name + " " + last_name}
                    onClose={() => setOpenDialog(false)}
                    remission_day={remission_day}
                    monthly={updateState === "Monthly Seed"}
                    phone_number={phone_number}
                    isFormValid={isFormValid}
                  />
                ) : (
                  <Button disabled={loading} size={"lg"} type="submit" className="w-full" variant="custom">
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
