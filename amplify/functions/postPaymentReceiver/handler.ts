import { Amplify } from "aws-amplify";
import { env } from "$amplify/env/postPaymentReceiver";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import type { Schema } from "../../data/resource";

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
const lambda = new LambdaClient({});

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

export const handler: Schema["postPaymentReceiver"]["functionHandler"] = async (event: any) => {
  console.log("event", event);

  // const eventRecords = event?.Records;

  try {
    const { processingCase, processingPayload } = event.arguments;
    const payload = { processingCase, processingPayload };

    if (processingCase === "send_user_messages") {
      const command = new InvokeCommand({
        FunctionName: process.env.SEND_MESSAGE_LAMBDA,
        InvocationType: "Event",
        Payload: Buffer.from(JSON.stringify(payload)),
      });

      const response = await lambda.send(command);

      console.log("Send Message Processor response:", response);

      return response;
    }

    const command = new InvokeCommand({
      FunctionName: process.env.POST_PAYMENT_PROCESSOR_LAMBDA,
      InvocationType: "Event",
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const response = await lambda.send(command);

    console.log("Processor response:", response);

    return response;
  } catch (error) {
    console.log("update status error", error);
  }

  return event;
};
