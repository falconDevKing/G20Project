import { Amplify } from "aws-amplify";
import { env } from "$amplify/env/processPendingPayments";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";

import { getTodayPendingPayments, chunkArray, bulkChargeType } from "./helpers";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const paystackSecretKey = process.env.GGP_PAYSTACK_SK || "";

export const handler = async (event: any) => {
  console.log("event", event);

  // const eventRecords = event?.Records;

  try {
    const { nextToken, loop } = event;
    const from = loop ? nextToken || 0 : 0;
    const { pendingPayments, next } = await getTodayPendingPayments(from);

    console.log("no of payments", from, pendingPayments.length);
    const prepPendingPayments = pendingPayments
      .map((pendingPayment) => {
        const { amount, email, authorization_code, id: reference } = pendingPayment;

        if (!amount || !authorization_code || !email) {
          return false;
        }

        const bulkChargeParam = {
          amount: +amount * 100,
          authorization: authorization_code,
          reference: reference,
        };

        return bulkChargeParam;
      })
      .filter(Boolean);
    console.log("no of cahrges", prepPendingPayments.length);

    const chunkCharges = chunkArray(prepPendingPayments as bulkChargeType[], 200);
    console.log("no of batches", chunkCharges.length);

    const bulkChargesPromises = chunkCharges.map(async (chunk, index) => {
      console.log("chunk", index, chunk);
      const response = await fetch("https://api.paystack.co/bulkcharge", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });

      const data = await response.json();
      console.log("data", index, data);
      console.log("response", index, response);
      if (!response.ok || !data.status) {
        return;
      }
      return data;
    });

    const bulkChargeResponse = await Promise.all(bulkChargesPromises);
    console.log("processed charges", bulkChargeResponse);

    const allQueued = bulkChargeResponse.map((chunkCharge) => chunkCharge?.status).every((chunkCharge) => chunkCharge === true);
    console.log("allQueued", allQueued);

    console.log({ from, nextToken: next, loop: !!next });
    return { nextToken: next, loop: !!next };
  } catch (error) {
    console.log("update status error", error);
  }

  return event;
};
