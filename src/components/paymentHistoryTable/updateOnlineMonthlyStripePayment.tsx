import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardElement, AddressElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { StripeCardElement, StripeCardNumberElement } from "@stripe/stripe-js/types/stripe-js/elements";
import { Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RemissionDayOptions } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { findChapterDetails, getUserWithUniqueCode, initialPayerData, pauseMemberSubscriptionNotification, type PayerDataType } from "@/services/payment";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { getCurrencySymbol } from "@/lib/numberUtils";

const stripeApiUrl = import.meta.env.VITE_APP_STRIPE_LAMBDA_URL || "";

interface UpdateOnlineMonthlyStripePaymentProps {
  filterData?: () => void;
  subscriptionId: string;
}

export const UpdateOnlineMonthlyStripePayment = ({ subscriptionId, filterData }: UpdateOnlineMonthlyStripePaymentProps) => {
  const user = useAppSelector((state) => state.auth.userDetails);

  const { chapter_id, email, stripe_customer_id } = user;
  const unique_code = user.unique_code;

  const [subscription, setSubscription] = useState<Record<string, any>>();
  const [updateState, setUpdateState] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [remissionDay, setRemissionDay] = useState("");
  const [reason, setReason] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chapterCurrency, setChapterCurrency] = useState("");
  const [FeedbackMessage, setFeedbackMessage] = useState("");
  const [payerCode, setPayerCode] = useState(unique_code);
  const [payerData, setPayerData] = useState<PayerDataType>(initialPayerData);

  const { user_id, user_name } = payerData;

  const isSubscriptionPaused = !!subscription?.pause_collection;

  const stripe = useStripe();
  const elements = useElements();

  const selectedChapterCurrecny = useMemo(() => findChapterDetails(chapter_id)?.currency, [chapter_id]);

  const handleSubmit = async () => {
    const { currency } = findChapterDetails(chapter_id);
    switch (updateState) {
      case "Pause Automation": {
        try {
          setLoading(true);
          if (reason.trim().length < 1) {
            ErrorHandler("Please provide a reason for pausing the subscription");
            setLoading(false);
            return;
          }
          await pauseMemberSubscriptionNotification(user_id, reason);
          setLoading(false);
          setOpenDialog(false);
        } catch (error) {
          if (isAxiosError(error)) {
            const message = error?.response?.data?.message as string;
            ErrorHandler(message);
            // setFeedbackMessage(message);
          } else {
            ErrorHandler("Something went wrong");
          }
          setLoading(false);
          return;
        }

        break;
      }
      case "Resume Automation": {
        try {
          setLoading(true);
          const resumeSubscriptionResponse = await axios.post(
            stripeApiUrl + "/resumeSubscription",
            { subscriptionId, userId: user_id },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const message = resumeSubscriptionResponse.data.message;
          const subscription = resumeSubscriptionResponse.data.data.subscription;
          setSubscription(subscription);
          SuccessHandler(message);
          setLoading(false);
          setOpenDialog(false);
        } catch (error) {
          if (isAxiosError(error)) {
            const message = error?.response?.data?.message as string;
            ErrorHandler(message);
            // setFeedbackMessage(message);
          } else {
            ErrorHandler("Something went wrong");
          }
          setLoading(false);
          return;
        }

        break;
      }
      case "Update Remission": {
        try {
          setLoading(true);

          const updateSubscriptionResponse = await axios.post(
            stripeApiUrl + "/updateSubscriptionAmountAndDay",
            { subscriptionId, amount: newAmount, currency: (chapterCurrency || currency).toLowerCase(), remission_day: remissionDay, user_name, user_id },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const message = updateSubscriptionResponse.data.message;
          const subscription = updateSubscriptionResponse.data.data.subscription;
          setSubscription(subscription);
          SuccessHandler(message);
          setLoading(false);
          setOpenDialog(false);
        } catch (error) {
          if (isAxiosError(error)) {
            const message = error?.response?.data?.message as string;
            ErrorHandler(message);
            // setFeedbackMessage(message);
          } else {
            ErrorHandler("Something went wrong");
          }
          setLoading(false);
          return;
        }

        break;
      }
      case "Update Payment Card": {
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

        const setupIntentDetails = {
          customer_id: stripe_customer_id,
          user_name: user_name,

          unique_code,
          user_id: user_id,
          user_email: email,
          currency: (chapterCurrency || currency).toLowerCase(),
          description: `Monthly Remission payment for ${user_name}`,
          user_address,
          phone: addressDetails?.value.phone || "",

          // payment_method_types: ["card"],
          // payment_method_options: { card: { request_three_d_secure: "any" } },
        };

        let clientSecret = "";
        try {
          const setupIntentResponse = await axios.post(stripeApiUrl + "/updateRecurringPaymentIntent", setupIntentDetails, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          clientSecret = setupIntentResponse.data.data?.clientSecret;
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

        setFeedbackMessage("Processing... 1 of 3");

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

        setFeedbackMessage("Processing... 2 of 3");

        const payment_method_id = setupIntent.payment_method;
        const updatedPaymentDetails = { ...setupIntentDetails, customer_id: stripe_customer_id, payment_method_id, subscriptionId };

        let subscription: Record<string, any>;

        try {
          const subscriptionResponse = await axios.post(stripeApiUrl + "/updateRecurringPayment", updatedPaymentDetails, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          const message = subscriptionResponse.data.message;
          subscription = subscriptionResponse.data.data?.subscription;
          setSubscription(subscription);
          setFeedbackMessage("Processing... 1 of 3");
          SuccessHandler(message);
          filterData?.();
          setLoading(false);
          setOpenDialog(false);
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

        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    const fetchPayerData = async (unique_code: string) => {
      const payerData = await getUserWithUniqueCode(unique_code);

      const { chapter_id } = payerData;
      const { currency } = findChapterDetails(chapter_id);
      setChapterCurrency(currency);
      setPayerData(payerData);
    };

    if (payerCode) {
      fetchPayerData(payerCode);
    }
  }, [payerCode]);

  useEffect(() => {
    if (unique_code) {
      setPayerCode(unique_code);
    }
  }, [unique_code]);

  useEffect(() => {
    const fetchSubscription = async (subscriptionId: string) => {
      try {
        const fetchSubscriptionResponse = await axios.post(
          stripeApiUrl + "/fetchSubscription",
          { subscriptionId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const subscription = fetchSubscriptionResponse.data.data.subscription;
        setSubscription(subscription);
      } catch (error) {
        if (isAxiosError(error)) {
          const message = error?.response?.data?.message as string;
          ErrorHandler(message);
        } else {
          ErrorHandler("Unable to fetch subscription");
        }
        setLoading(false);
        return;
      }
    };

    if (subscriptionId) {
      fetchSubscription(subscriptionId);
    }
  }, [subscriptionId]);

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      {/* <div className="flex justify-end mb-6"> */}
      <AlertDialogTrigger asChild>
        <div
          className="border border-[#CCA33D80] dark:bg-[#252525] dark:border-[#EDEDED24] w-full h-[135px] rounded-lg p-3 flex flex-col justify-between"
          style={{ cursor: "pointer" }}
        >
          <div className="flex items-center gap-x-3">
            <div className={"flex justify-center items-center w-10 h-10 rounded-full bg-GGP-darkGold"}>
              {/* <CreditCard size={20} className="text-[#039855]" strokeWidth={2} /> */}
              <Wallet size={20} className="text-GGP-lightGold" strokeWidth={2} />
              {/* <BanknoteArrowUp size={20} className="text-[#039855]" strokeWidth={2} /> */}
            </div>
            {/* <span className="text-base font-medium text-GGP-darkGold">Recurring Remissions</span> */}
          </div>

          <div className="text-xl font-bold self-start md:self-auto">Manage Automated Remissions</div>
        </div>
      </AlertDialogTrigger>
      {/* </div> */}

      <AlertDialogContent className="max-w-xl bg-white  p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="text-xl font-bold self-start md:self-auto">Manage Automated Remissions</div>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div>
          <RadioGroup onValueChange={setUpdateState} className="flex flex-wrap sm:flex-nowrap justify-between py-2 pb-4">
            {["Update Remission", "Update Payment Card", `${isSubscriptionPaused ? "Resume" : "Pause"} Automation`].map((action) => (
              <div className={`flex items-center space-x-2  p-3 w-max rounded-lg ${updateState === action ? "bg-GGP-darkGold" : "border"}`} key={action}>
                <RadioGroupItem value={action} id={action} />
                <Label htmlFor={action} className={`text-lg ${updateState === action ? "text-white" : "text-black"}`}>
                  {action}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {updateState === "Pause Automation" && (
            <div className="my-2 flex gap-4 w-full">
              <div className="w-full">
                <div className="flex gap-1">
                  <Input
                    type="text"
                    min={0}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 "
                    placeholder="Reason for pausing remission"
                    allowDark={false}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {updateState === "Update Remission" && (
            <div className="my-2 flex gap-4 w-full">
              <div className="w-full">
                <div className="py-2">New Remission Amount</div>
                <div className="flex gap-1">
                  {selectedChapterCurrecny && (
                    <Button type="button" variant="outline" className="max-w-max h-[44px] border-input bg-transparent">
                      {getCurrencySymbol(selectedChapterCurrecny)}
                    </Button>
                  )}
                  <Input
                    type="number"
                    min={0}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 "
                    placeholder="New Amount e.g 10000"
                    allowDark={false}
                    value={newAmount}
                    onChange={(e) => setNewAmount(+e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full">
                <div className="font-normal text-base py-2">Day for Subsequent Remissions</div>
                <Select onValueChange={setRemissionDay} value={remissionDay}>
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
              </div>
            </div>
          )}

          {updateState === "Update Payment Card" && (
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
          <AlertDialogCancel className="h-11 rounded-md px-8 w-full dark:bg-white hover:text-black" type="button" disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <Button disabled={loading} size={"lg"} type="button" onClick={handleSubmit} className="w-full" variant="custom">
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
