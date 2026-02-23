import { Amplify } from "aws-amplify";
import { env } from "$amplify/env/createPendingPayments";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import dayjs from "dayjs";

import { createPendingPaymentsBatch, getActiveRecurringPayments, getChapters, getUserData, pauseRecurringPayments } from "./helpers";
import { PartnerRowType } from "../../interfaces/modifiedSupabaseTypes";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const guestUserId = process.env.GGP_GUEST_USER_ID || "";

export const handler = async (event: any) => {
  console.log("event", event);

  try {
    const { nextToken, loop } = event;
    const from = loop ? nextToken || 0 : 0;
    const { activeRecurringPayments, next } = await getActiveRecurringPayments(from);
    const chaptersData = await getChapters();

    const prepPendingPaymentsPromises = activeRecurringPayments.map(async (recurringPayment) => {
      const {
        amount,
        email,
        authorization_code,
        user_id,
        customer_code,
        currency,
        charge_day,
        chapter_id: recurringChapterId,
        id: recurringPaymentId,
      } = recurringPayment;

      // TODO: find if currency is changing with chapter and return mail to update remission, disable recurring

      // TODO: handle case of user created a subscription, and it being overwritten by same user creating guest subscription for user id
      const userData = await getUserData(user_id || guestUserId);
      if (!userData) {
        return false;
      }

      const { chapter_id, organisation_id, division_id, region_id, unique_code, id: userId, first_name, last_name } = userData as PartnerRowType;

      const isChapterSame = chapter_id === recurringChapterId;
      const isCurrencySame = chaptersData.find((chapter) => chapter.id === chapter_id)?.base_currency?.toLowerCase() === currency?.toLowerCase();

      console.log({ isChapterSame, isCurrencySame });
      if (user_id && user_id !== "Guest" && !isCurrencySame) {
        await pauseRecurringPayments(recurringPaymentId);
        // TODO: send mail to update payment automation
        return false;
      }

      const paymentDate = dayjs().date(+(charge_day || 1));
      const remission_period = dayjs().format("MMMM YYYY");
      // find associated user if present rand hold details or prep default
      const pendingPayment = {
        amount,
        currency,
        description: "Monthly Paystack Recurring Payment for " + remission_period,

        approved_by: "Online Monthly Paystack",
        approved_by_id: "Online Monthly Paystack",
        approved_by_image: "Online Monthly Paystack",

        organisation_id,
        division_id,
        chapter_id,
        region_id,

        user_id: userId,
        user_name: first_name + " " + last_name,
        unique_code,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),

        payment_date: paymentDate.format("YYYY-MM-DD"),

        remission_period,
        remission_month: remission_period.split(" ")[0],
        remission_year: remission_period.split(" ")[1],

        recurring_id: recurringPaymentId,
        status: "Pending Paystack",
        authorization_code,
        customer_code,
        processing_count: 0,
        email,
      };

      // create pending payment
      // const pendingPaymentRecord = await createPendingPayments(pendingPayment);
      return pendingPayment;
    });

    const pendingPaymentRecordsResult = await Promise.all(prepPendingPaymentsPromises);
    const pendingPaymentRecords = pendingPaymentRecordsResult.filter((payment) => !!payment);

    await createPendingPaymentsBatch(pendingPaymentRecords);

    console.log({ from, nextToken: next, loop: !!next });
    return { nextToken: next, loop: !!next };
  } catch (error) {
    console.log("create pending payments error", error);
    return { nextToken: null, loop: false };
  }
};
