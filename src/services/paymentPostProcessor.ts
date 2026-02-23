import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource"; // Path to your schema

const client = generateClient<Schema>();

interface PostPaymentReceiverParams {
  processingCase: string;
  processingPayload: Record<string, any>;
}

export const PostPaymentReceiverHandler = async ({ processingCase, processingPayload }: PostPaymentReceiverParams) => {
  try {
    const { errors } = await client.queries.postPaymentReceiver({
      processingCase,
      processingPayload: JSON.stringify(processingPayload),
    });

    if (errors) throw new Error(errors[0].message);
    return { success: true };
  } catch (error) {
    console.error("PostPaymentReceiver failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
