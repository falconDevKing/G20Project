import stripe from "stripe";

import { makePayment, handleMailingAndStatusUpdates, findUser } from "./helpers";
import FetchGBPExchangeRatesValue from "../../utils/fetchGBPExchangeRatesValue";
import SupabaseClient from "../../utils/supabaseConnection";
import dayjs from "dayjs";

const guestUserId = process.env.GGP_GUEST_USER_ID || "";
const webhookSecret = process.env.GGP_STRIPE_WEBHOOK_SECRET || ""; // todo: add env var

export const handler = async (event: any) => {
  console.log("webhook event", event);
  console.log("event body", event.body);
  const rawWebhookEvent = event;

  try {
    const sig = rawWebhookEvent.headers?.["stripe-signature"];

    let verifiedEvent;

    try {
      const body = rawWebhookEvent?.body;
      console.log({
        sig,
        webhookSecret,
        body,
      });

      verifiedEvent = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
      console.log("✅ Webhook verified:", verifiedEvent.type);
    } catch (err: any) {
      console.error("❌ Signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, {
        status: 400,
      });
    }

    console.log("verifiedEvent", verifiedEvent);
    console.log("entering switch");

    switch (verifiedEvent.type) {
      case "invoice.payment_succeeded": {
        const verifiedEventData = verifiedEvent.data.object;
        console.log("verifiedEventData", verifiedEventData);

        console.log("💰 Payment succeeded:", verifiedEventData.id);
        const { customer, status, currency, amount_paid, status_transitions } = verifiedEventData;

        if (status === "paid") {
          const guestPhoneNumber = verifiedEventData?.customer_phone;
          const guestName = verifiedEventData?.customer_name;
          const guestEmail = verifiedEventData?.customer_email;

          const { data: registeredCustomerData, error: findCustomerError } = await SupabaseClient.from("partner") // <-- replace with your table
            .select() // object of fields to update
            .eq("stripe_customer_id", customer) // condition
            .maybeSingle();

          const { data: registeredCustomerDataByEmail, error: findCustomerErrorByEmail } = await SupabaseClient.from("partner")
            .select()
            .ilike("email", guestEmail || "") // case-insensitive match
            .maybeSingle();

          const fallbackUser = registeredCustomerData
            ? registeredCustomerData
            : registeredCustomerDataByEmail
              ? registeredCustomerDataByEmail
              : await findUser(guestUserId);

          const fallbackRegisteredUserData = registeredCustomerData || registeredCustomerDataByEmail;

          const {
            id: user_id,
            email,
            unique_code,
            first_name,
            last_name,
            organisation_id,
            division_id,
            chapter_id,
            remission_start_date,
            phone_number,
          } = fallbackUser;

          const paymentDate = dayjs.unix(+(status_transitions.paid_at || Date.now()));
          const remission_period = paymentDate.format("MMMM YYYY");
          const amount = +amount_paid / 100;
          const rate = await FetchGBPExchangeRatesValue(currency);
          console.log("gotten rates", rate);

          const user_name = fallbackRegisteredUserData
            ? `${first_name || ""} ${last_name || ""}`.trim()
            : guestName || `${first_name || ""} ${last_name || ""}`.trim();

          const newEntry = {
            unique_code: unique_code,
            currency: currency.toUpperCase(),
            amount,
            payment_date: paymentDate.toISOString(),
            remission_month: remission_period.split(" ")[0],
            remission_year: remission_period.split(" ")[1],
            remission_period,
            status: amount_paid ? "Paid" : "Setup",
            description: amount_paid ? "GGP remission for " + remission_period : "Recurring Payments Setup",
            user_name,
            approved_by: amount_paid ? "Online Monthly Stripe" : "Recurring Payments Configured",
            approved_by_id: amount_paid ? "Online Monthly Stripe" : "Recurring Payments Configured",
            approved_by_image: amount_paid ? "Online Monthly Stripe" : "Recurring Payments Configured",
            gbp_equivalent: amount / +(rate || 1),
            organisation_id,
            division_id,
            chapter_id,
            user_id: user_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          const newPaymentRecord = await makePayment(newEntry);
          console.log("made payment entry", newEntry);

          amount_paid &&
            (await handleMailingAndStatusUpdates({
              user_id: user_id,
              currency,
              amount,
              remission_period,
              user_name,
              email: fallbackRegisteredUserData ? email : guestEmail || email,
              phone_number: fallbackRegisteredUserData ? phone_number : guestPhoneNumber || phone_number,
              chapter_id,
              remission_start_date,
            }));
        }
        break;
      }

      case "invoice.payment_failed": {
        const verifiedEventData = verifiedEvent.data.object;
        console.log("verifiedEventData", verifiedEventData);
        console.log("⚠️ Payment failed:", verifiedEventData.id);

        break;
      }

      case "payment_intent.succeeded": {
        const verifiedEventData = verifiedEvent.data.object;
        console.log("verifiedEventData", verifiedEventData);

        console.log("💰 Payment Intent succeeded:", verifiedEventData.id);
        const { customer, status, currency, amount_received, created, metadata, description, payment_details } = verifiedEventData;

        if (description === "Payment for Invoice" && !!payment_details?.order_reference) {
          break; // skip processing if this is a payment for an invoice (to avoid double processing payments that are part of subscriptions)
        }

        if (status === "succeeded" && description !== "Payment for Invoice") {
          const guestPhoneNumber = metadata?.customer_phone;
          const guestName = metadata?.customer_name;
          const guestEmail = metadata?.customer_email;

          const { data: registeredCustomerData, error: findCustomerError } = await SupabaseClient.from("partner")
            .select()
            .eq("stripe_customer_id", customer)
            .maybeSingle();

          const { data: registeredCustomerDataByEmail, error: findCustomerErrorByEmail } = await SupabaseClient.from("partner")
            .select()
            .ilike("email", guestEmail) // case-insensitive match
            .maybeSingle();

          const fallbackUser = registeredCustomerData
            ? registeredCustomerData
            : registeredCustomerDataByEmail
              ? registeredCustomerDataByEmail
              : await findUser(guestUserId);

          const fallbackRegisteredUserData = registeredCustomerData || registeredCustomerDataByEmail;

          const {
            id: user_id,
            email,
            unique_code,
            first_name,
            last_name,
            organisation_id,
            division_id,
            chapter_id,
            remission_start_date,
            phone_number,
          } = fallbackUser;

          const paymentDate = dayjs.unix(+(created || Date.now()));
          const remission_period = metadata?.remission_period || paymentDate.format("MMMM YYYY");
          const amount = +amount_received / 100;
          const rate = await FetchGBPExchangeRatesValue(currency);
          console.log("gotten rates", rate);

          const user_name = fallbackRegisteredUserData
            ? `${first_name || ""} ${last_name || ""}`.trim()
            : guestName || `${first_name || ""} ${last_name || ""}`.trim();

          const newEntry = {
            unique_code: unique_code,
            currency: currency.toUpperCase(),
            amount,
            payment_date: paymentDate.toISOString(),
            remission_month: remission_period.split(" ")[0],
            remission_year: remission_period.split(" ")[1],
            remission_period,
            status: "Paid",
            description: "GGP remission for " + remission_period,
            user_name,
            approved_by: "Online Stripe",
            approved_by_id: "Online Stripe",
            approved_by_image: "Online Stripe",
            gbp_equivalent: amount / +(rate || 1),
            organisation_id,
            division_id,
            chapter_id,
            user_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          const newPaymentRecord = await makePayment(newEntry);
          console.log("made payment entry", newEntry);

          await handleMailingAndStatusUpdates({
            user_id,
            currency,
            amount,
            remission_period,
            user_name: user_name,
            email: fallbackRegisteredUserData ? email : guestEmail || email,
            phone_number: fallbackRegisteredUserData ? phone_number : guestPhoneNumber || phone_number,
            chapter_id,
            remission_start_date,
          });
        }
        break;
      }

      default:
        console.log("Unhandled event:", verifiedEvent.type);
        break;
    }

    return new Response("ok", {
      status: 200,
    });
  } catch (err: any) {
    console.log(err);
    return new Response("not ok", {
      status: 500,
      statusText: "processing failed" + err.message,
    });
  }
};
