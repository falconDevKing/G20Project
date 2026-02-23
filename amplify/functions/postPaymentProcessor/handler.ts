import { Amplify } from "aws-amplify";
import { env } from "$amplify/env/postPaymentProcessor";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { processPaystackPaymentVerification, savePaystackPaymentRecord } from "./services/paystackPostProcessing";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const paystackSecretKey = process.env.GGP_PAYSTACK_SK || "";

export const handler = async (event: any) => {
  console.log("event", event);

  try {
    const { processingCase, processingPayload } = event;
    console.log("processingCase", processingCase);
    console.log("processingPayload", processingPayload);

    switch (processingCase) {
      case "paystack_user_payment":
        const successfulMonthly = await processPaystackPaymentVerification(processingPayload);
        await savePaystackPaymentRecord({ ...processingPayload, successfulMonthly: successfulMonthly || false });

        break;
      default:
        console.log("No matching processing case");
    }

    return { processingCase, processingPayload };
  } catch (error) {
    console.log("update status error", error);
  }

  return event;
};
