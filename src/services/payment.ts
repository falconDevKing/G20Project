import store from "../redux/store";
import { getPaidMonths, monthsOfTheYear } from "@/lib/utils";
import dayjs from "dayjs";
import SupabaseClient from "@/supabase/supabaseConnection";
import type { PaymentInsertType, PaymentRowType, PaymentUpdateType } from "@/supabase/modifiedSupabaseTypes";
import axios, { isAxiosError } from "axios";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import { sendEmail } from "./sendMail";
import PauseSubscriptionTemplate from "@/mailTemplates/pauseSubscriptionTemplate";
// import type { PostgrestSingleResponse } from "@supabase/supabase-js";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "";
const stripeApiUrl = import.meta.env.VITE_APP_STRIPE_LAMBDA_URL || "";

// TODO: update supabase calls to use  PostgrestSingleResponse
export const findDivisionDetails = (division_id: string) => {
  if (!division_id) {
    return { id: "", divisionName: "", divisionReps: [] };
  }

  const divisions = store.getState().app.divisions;

  const divisionDetails = divisions.find((division) => division.id === division_id);

  const divisionName = divisionDetails?.name || "";
  const divisionReps = divisionDetails?.reps || ([] as Array<{ id: string; name: string; email: string; phone_number: string }>);

  return { id: division_id, divisionName, divisionReps };
};

export const findChapterDetails = (chapter_id: string) => {
  if (!chapter_id) {
    return { id: "", currency: "", chapterName: "", chapterReps: [] };
  }

  const chapters = store.getState().app.chapters;

  const chapterDetails = chapters.find((chapter) => chapter.id === chapter_id);
  const currency = chapterDetails?.base_currency || "";
  const chapterName = chapterDetails?.name || "";
  const chapterReps = chapterDetails?.reps || ([] as Array<{ id: string; name: string; email: string; phone_number: string }>);
  return { id: chapter_id, currency, chapterName, chapterReps };
};

export const initialPayerData = { user_id: "", user_name: "", division_id: "", chapter_id: "", email: "", remission_start_date: "", phone_number: "" };
export type PayerDataType = typeof initialPayerData;

export const getUser = async (user_Id: string) => {
  const { data: user, error } = await SupabaseClient.from("partner").select().eq("id", user_Id).maybeSingle();

  if (error) {
    console.log("getUser error", error);
    return initialPayerData;
  }

  if (!user) {
    return initialPayerData;
  }

  return user;
};

export const getUserByEmail = async (email: string) => {
  const { data: user, error } = await SupabaseClient.from("partner").select().ilike("email", email).maybeSingle();

  if (error) {
    console.log("getUserByEmail error", error);
    return initialPayerData;
  }

  if (!user) {
    return initialPayerData;
  }

  return user;
};

export const getUserWithUniqueCode = async (unique_code: string) => {
  const { data: user, error } = await SupabaseClient.from("partner")
    .select("id, first_name, last_name, division_id, chapter_id, email, remission_start_date, phone_number")
    .eq("unique_code", unique_code)
    .maybeSingle();

  if (error) {
    console.log("getUserWithUniqueCode error", error);
    return initialPayerData;
  }

  if (!user) {
    return initialPayerData;
  }

  const user_name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return {
    user_name,
    email: user.email,
    user_id: user.id || "",
    division_id: user.division_id || "",
    chapter_id: user.chapter_id || "",
    phone_number: user.phone_number || "",
    remission_start_date: user.remission_start_date || "",
  };
};

export const makePayment = async (paymentData: PaymentInsertType, log: boolean = false) => {
  const { approved_by_id, organisation_id, currency, user_id } = paymentData;

  if ((!log && !approved_by_id) || !organisation_id || !currency || !user_id) {
    console.log({ log, approved_by_id, organisation_id, currency, user_id });
    throw new Error("Something went wrong, incomplete details");
  }

  const { data, error } = await SupabaseClient.from("payment").insert(paymentData).select().maybeSingle();

  if (error) {
    console.log("makePaymentError", error);
    throw error;
  }

  return data;
};

export const approvePayment = async (paymentData: PaymentUpdateType) => {
  const { approved_by_id, organisation_id, currency, user_id, id } = paymentData;

  if (!approved_by_id || !organisation_id || !currency || !user_id || !id) {
    console.log("Missing required fields:", { approved_by_id, organisation_id, currency, user_id, id });
    throw new Error("Something went wrong, incomplete details");
  }

  const { data, error } = await SupabaseClient.from("payment").update(paymentData).eq("id", id).select().maybeSingle();

  if (error) {
    console.log("approvePaymentError", error);
    throw error;
  }

  return data;
};

export const cancelPayment = async (paymentId: string) => {
  const { data, error } = await SupabaseClient.from("payment").update({ status: "Cancelled" }).eq("id", paymentId).select().maybeSingle();

  if (error) {
    console.log("cancelPaymentError", error);
    throw error;
  }

  return data;
};

export const fetchUserPayment = async (user_id: string): Promise<PaymentRowType[]> => {
  const userPayments: PaymentRowType[] = [];
  const pageSize = 500;

  if (!user_id) {
    return userPayments;
  }

  const fetchUserPaymentsCall = async (startIndex: number = 0) => {
    const endIndex = startIndex + pageSize - 1;

    const { data, error } = await SupabaseClient.from("payment")
      .select("*")
      .eq("user_id", user_id)
      .order("payment_date", { ascending: false })
      .range(startIndex, endIndex);

    if (error) {
      console.log("userPaymentsError", error);
      throw error;
    }

    if (data && data.length > 0) {
      userPayments.push(...data);

      if (data.length === pageSize) {
        // More records might exist, fetch next page
        await fetchUserPaymentsCall(endIndex + 1);
      }
    }
  };

  await fetchUserPaymentsCall();

  return userPayments;
};

export const fetchEntityPayment = async (entityType: string, entityId: string): Promise<PaymentRowType[]> => {
  if (!entityType || !entityId) {
    return [];
  }

  const pageSize = 500;
  const entityPayments: PaymentRowType[] = [];

  const columnMap: Record<string, string> = {
    organisation: "organisation_id",
    division: "division_id",
    chapter: "chapter_id",
    // no individual case since you return []
  };

  const column = columnMap[entityType];

  if (!column) {
    if (entityType === "individual") return [];
    throw new Error("No matched entity case");
  }

  const fetchPaymentsCall = async (startIndex = 0) => {
    const endIndex = startIndex + pageSize - 1;

    const { data, error } = await SupabaseClient.from("payment")
      .select("*")
      .eq(column, entityId)
      .order("payment_date", { ascending: false })
      .range(startIndex, endIndex);

    if (error) {
      console.log(`${entityType}PaymentsError`, error);
      throw error;
    }

    if (data && data.length > 0) {
      entityPayments.push(...data);

      if (data.length === pageSize) {
        await fetchPaymentsCall(endIndex + 1);
      }
    }
  };

  await fetchPaymentsCall();

  return entityPayments;
};

export const updateUserStatus = async (user_id: string, remission_start_date: string) => {
  if (!user_id) return;
  const pageSize = 500;
  const userPayments: any[] = [];

  const fetchUserPayments = async (from: number = 0) => {
    const to = from + pageSize - 1;
    const { data, error } = await SupabaseClient.from("payment").select("*").eq("user_id", user_id).order("payment_date", { ascending: false }).range(from, to);

    if (error) {
      console.log("userPaymentsError", error);
      throw error;
    }

    if (data && data.length > 0) {
      userPayments.push(...data);

      if (data.length === pageSize) {
        await fetchUserPayments(to + 1);
      }
    }
  };

  await fetchUserPayments();

  const paidMonths = getPaidMonths(userPayments);
  const currentMonthIndex = +dayjs().format("M");

  const remissionStartMonth =
    remission_start_date && dayjs(remission_start_date).format("YYYY") === dayjs().format("YYYY") ? +dayjs(remission_start_date).format("M") : 1;

  const requiredMonths = monthsOfTheYear.filter((_, index) => index + 1 >= remissionStartMonth && index + 1 <= currentMonthIndex);

  let noOfMonthsPaid = 0;

  for (const month of requiredMonths) {
    if (paidMonths.includes(month)) {
      noOfMonthsPaid++;
    }
  }

  let userStatus = "passive";

  if (noOfMonthsPaid === requiredMonths.length) {
    userStatus = "consistent";
  } else {
    const last3Months = [currentMonthIndex, currentMonthIndex - 1, currentMonthIndex - 2].filter((m) => m >= remissionStartMonth && m > 0);

    if (last3Months.some((m) => paidMonths.includes(monthsOfTheYear[m - 1]))) {
      userStatus = "active";
    }
  }

  const { data, error: updateError } = await SupabaseClient.from("partner").update({ status: userStatus }).eq("id", user_id).select().single();

  if (updateError) {
    console.log("updateUserStatus error", updateError);
    throw updateError;
  }

  return data;
};

export const fetchRecurringPayment = async (recurringPaymentId: string) => {
  const { data, error } = await SupabaseClient.from("paystack_recurring_payments").select().eq("id", recurringPaymentId).maybeSingle();

  if (error) {
    console.log("cancelPaymentError", error);
    throw error;
  }

  return data;
};

export const updateRecurringPayment = async (recurringPaymentId: string, userId: string, recurringPaymentUpdate: Record<string, any>) => {
  const { data, error } = await SupabaseClient.from("paystack_recurring_payments")
    .update(recurringPaymentUpdate)
    .eq("id", recurringPaymentId)
    .select()
    .maybeSingle();

  const userDataToUpdate: {
    active_recurring_remission?: boolean;
    preferred_remission_day?: number;
  } = {};

  if (recurringPaymentUpdate.hasOwnProperty("active")) {
    userDataToUpdate.active_recurring_remission = recurringPaymentUpdate.active;
  }
  if (recurringPaymentUpdate.hasOwnProperty("charge_day")) {
    userDataToUpdate.preferred_remission_day = +recurringPaymentUpdate.charge_day;
  }

  const { error: updateUserError } = await SupabaseClient.from("partner").update(userDataToUpdate).eq("id", userId).select();

  if (error || updateUserError) {
    console.log("updateRecurringPayment", { recurringPaymentId, recurringPaymentUpdate }, error);
    throw error;
  }

  return data;
};

export const pauseMemberSubscription = async (user_code: string) => {
  try {
    const { data: user, error } = await SupabaseClient.from("partner").select().eq("unique_code", user_code).maybeSingle();

    if (error || !user) {
      throw new Error("User not found");
    }

    const userId = user.id;
    const userSubscriptionIds = user.subscription_ids;
    const userPaystackMonthlyId = user.paystack_monthly_payment_id;

    console.log("pauseMemberSubscription userData", { userId, userSubscriptionIds, userPaystackMonthlyId });
    if ((!userSubscriptionIds || userSubscriptionIds.length < 1) && !userPaystackMonthlyId) {
      throw new Error("No active subscriptions found for the user");
    }

    if (userPaystackMonthlyId) {
      await pauseMemberPaystackSubscription(userId, userPaystackMonthlyId);
      return;
    }

    if (userSubscriptionIds || userSubscriptionIds.length >= 1) {
      await pauseMemberStripeSubscription(userId, userSubscriptionIds);
    }
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message = error?.response?.data?.message as string;
      ErrorHandler(message);
      // setFeedbackMessage(message);
    } else {
      ErrorHandler(error?.message || "Something went wrong");
    }

    return;
  }
};

export const pauseMemberStripeSubscription = async (userId: string, userSubscriptionIds: string[]) => {
  try {
    const pauseSubscriptionsPromises = userSubscriptionIds.map(async (subscriptionId: string) => {
      try {
        const pauseSubscriptionResponse = await axios.post(
          stripeApiUrl + "/pauseSubscription",
          { subscriptionId, userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const subscription = pauseSubscriptionResponse.data.data.subscription;
        return subscription;
      } catch (error) {
        return null;
      }
    });

    const pauseSubscriptionsResponse = await Promise.all(pauseSubscriptionsPromises);
    if (pauseSubscriptionsResponse.every((res) => res !== null)) {
      const message = "All subscriptions have been paused successfully.";
      SuccessHandler(message);
    } else {
      const message = "Some subscriptions could not be paused.";
      ErrorHandler(message);
    }
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message = error?.response?.data?.message as string;
      ErrorHandler(message);
      // setFeedbackMessage(message);
    } else {
      ErrorHandler(error?.message || "Something went wrong");
    }

    return;
  }
};

export const pauseMemberPaystackSubscription = async (userId: string, recurringPaymentId: string) => {
  try {
    const updatedRecurringPayment = await updateRecurringPayment(recurringPaymentId, userId, { active: false });
    const message = "Subscription have been paused successfully.";
    SuccessHandler(message);
    return updatedRecurringPayment;
  } catch (error) {
    const message = "Subscription could not be paused.";
    ErrorHandler(message);
    return null;
  }
};

export const pauseMemberSubscriptionNotification = async (user_id: string, reason: string) => {
  try {
    const { data: user, error } = await SupabaseClient.from("partner").select().eq("id", user_id).maybeSingle();

    if (error || !user) {
      throw new Error("User not found");
    }

    const { chapter_id, division_id, name } = user;

    const chapter = findChapterDetails(chapter_id);
    const division = findDivisionDetails(division_id);

    const chapterName = chapter.chapterName || "N/A";
    const divisionName = division.divisionName || "N/A";

    const reps = [...(chapter?.chapterReps || []), ...(division?.divisionReps || [])];
    const repsEmails = reps.map((rep) => rep.email).filter((email) => email);

    await sendEmail({
      to: repsEmails,
      mailSubject: `Subscription Pause Request for ${name}`,
      mailBody: PauseSubscriptionTemplate({
        userName: name,
        chapterName: chapterName,
        divisionName: divisionName,
        toolsUrl: (baseUrl || "https://globalgospelpartnership.org") + "/tools",
        reason,
      }),
    });

    SuccessHandler("Request sent successfully");
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message = error?.response?.data?.message as string;
      ErrorHandler(message);
      // setFeedbackMessage(message);
    } else {
      ErrorHandler(error?.message || "Something went wrong");
    }

    return;
  }
};
