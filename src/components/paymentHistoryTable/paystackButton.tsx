// PaystackInlineButton.tsx
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorHandler, InfoHandler } from "@/lib/toastHandlers";
import { PostPaymentReceiverHandler } from "@/services/paymentPostProcessor";
import { dummyFunction } from "@/interfaces/tools";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

type Props = {
  unique_code: string;
  remission_period: string;
  description: string;
  email: string;
  amount: number; // in major units
  currency: string;
  user_id: string;
  user_name: string;
  monthly?: boolean;
  remission_day?: string;
  onSuccess: () => void;
  onClose?: () => void;
  phone_number?: string;
  handleBankPopupClosed?: () => void;
  isFormValid: boolean;
};

const stripeApiUrl = import.meta.env.VITE_APP_STRIPE_LAMBDA_URL || "";

export default function PaystackInlineButton({
  unique_code,
  amount,
  remission_period,
  description,

  email,
  currency,
  user_id,
  user_name,
  monthly = false,
  remission_day,
  onSuccess,
  onClose,
  phone_number,
  isFormValid,
  handleBankPopupClosed,
}: Props) {
  const scriptAdded = useRef(false);
  const [loading, setLoading] = useState(false);

  // TODO: After initTransaction return authorization_url, simply window.location.href = authorization_url;

  // TODO: Your success page calls verifyTransaction with the reference from query string.

  const handleClick = async () => {
    if (!isFormValid) {
      return;
    }

    setLoading(true);
    onClose?.();
    // 1) Ask backend to initialize to get a reference
    const initRes = await fetch(stripeApiUrl + "/paystack/initTransaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, email, currency, user_id, user_name, monthly, phone_number }),
    }).then((r) => r.json());

    if (initRes.error) {
      console.log("initRes error", initRes.error);
      setLoading(false);
      ErrorHandler("Something went wrong");
      return;
    }

    const { reference } = initRes.data;

    const popUpCallBack = async (response: any) => {
      // 3) Verify
      InfoHandler("Processing...");
      dummyFunction(response);

      const verify = await fetch(stripeApiUrl + `/paystack/verifyTransaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      }).then((r) => r.json());
      const { verified, transaction } = verify.data;

      if (verified) {
        await PostPaymentReceiverHandler({
          processingCase: "paystack_user_payment",
          processingPayload: {
            currency,
            user_id,
            monthly,
            amount,
            email,
            remission_day,
            unique_code,
            remission_period,
            description,
            user_name,
            provider: "Paystack",
            transaction,
          },
        });
        handleBankPopupClosed?.();
        onSuccess();
      } else {
        ErrorHandler("Unable to complete payment");
      }
      setLoading(false);
    };

    // 2) Open inline popup
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_APP_PAYSTACK_PK, // pk_test_xxx
      email,
      amount: Math.round(amount * 100),
      ref: reference,
      onClose: () => {
        onClose?.();
      },
      callback: (response: any) => {
        popUpCallBack(response);
      },
    });

    handler.openIframe();
  };

  useEffect(() => {
    if (scriptAdded.current) return;
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    document.body.appendChild(s);
    scriptAdded.current = true;
  }, []);

  return (
    <div onClick={handleClick} className="w-full">
      <Button size={"lg"} variant="custom" className="w-full" disabled={loading}>
        Pay with Paystack {monthly ? " via card" : ""}
      </Button>
    </div>
  );
}
