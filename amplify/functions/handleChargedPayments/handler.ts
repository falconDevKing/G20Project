import { Amplify } from "aws-amplify";
import { env } from "$amplify/env/handleChargedPayments";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";

import {
  getPendingPayments,
  makePayment,
  updateUserData,
  updateRecurringPaymentData,
  deletePendingPayments,
  handleMailingAndStatusUpdates,
  findUser,
} from "./helpers";
import FetchGBPExchangeRatesValue from "../../utils/fetchGBPExchangeRatesValue";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const guestUserId = process.env.GGP_GUEST_USER_ID || "";

export const handler = async (event: any) => {
  console.log("event", event);
  console.log("event body", event.body);

  const eventData = JSON.parse(event?.body);

  try {
    // check cahrge success3
    if (eventData.event !== "charge.success") {
      console.log("not successful event");
      return new Response("ok", {
        status: 200,
        statusText: "Not success charge",
      });
    }

    const chargeData = eventData.data;

    const { authorization = {}, reference } = chargeData;

    // fetch  pending payment
    const pendingPayment = await getPendingPayments(reference);
    console.log("pendingPayment", pendingPayment);

    if (!pendingPayment) {
      return new Response("ok", {
        status: 200,
        statusText: "No Pending Payment found",
      });
    }

    // create actual payment
    const {
      payment_date,
      status,
      gbp_equivalent,
      authorization_code,
      customer_code,
      processing_count,
      email,

      currency,
      amount,
      user_id,
      remission_period,
      recurring_id,
      user_name,
      chapter_id,

      ...restPayment
    } = pendingPayment;

    const rate = await FetchGBPExchangeRatesValue(currency);
    console.log("FetchGBPExchangeRatesValue", rate);

    const fallbackUserId = user_id === "Guest" ? guestUserId : user_id || guestUserId;

    const actualPayament = {
      ...restPayment,
      currency,
      amount,
      user_id: fallbackUserId,
      user_name,
      chapter_id,
      payment_date: new Date().toISOString(),
      status: "Paid",
      remission_period,
      recurring_id,
      gbp_equivalent: +amount / +(rate || 1),
    };

    const createdPayment = await makePayment(actualPayament);
    console.log("createdPayment", createdPayment);
    // updated user  and recurringpayment  authorisation data

    const { phone_number, remission_start_date } = await findUser(fallbackUserId);

    await handleMailingAndStatusUpdates({
      user_id,
      currency,
      amount,
      remission_period,
      user_name,
      email,
      chapter_id,
      remission_start_date,
      phone_number,
    });

    if (authorization.reusable) {
      const userUpdates = {
        paystack_authorization_code: authorization.authorization_code,
        paystack_authorization_details: authorization,
      };

      const recurringPaymentUpdates = {
        authorization_code: authorization.authorization_code,
      };

      await updateUserData(user_id, userUpdates);
      await updateRecurringPaymentData(recurring_id, recurringPaymentUpdates);
      console.log("updated user and recurring payment auth details");
    }

    await deletePendingPayments(reference);
    return new Response("ok", {
      status: 200,
      statusText: "charge processed successfully",
    });
    // return event;
  } catch (error: any) {
    console.log("handleChargedPayments error", error);
    return new Response("not ok", {
      status: 500,
      statusText: "processing failed" + error?.message,
    });
  }
};
