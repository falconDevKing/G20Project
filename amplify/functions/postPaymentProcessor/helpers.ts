import dayjs from "dayjs";
import { PaymentRowType } from "../../interfaces/modifiedSupabaseTypes";
import SupabaseClient from "../../utils/supabaseConnection";
import PaymentReciept from "./paymentReceipt";
import { sendMailWithoutKeys } from "../../utils/sendMailWithoutKeys";
import twilio from "twilio";

const client = twilio(process.env.GGP_TWILIO_ACCOUNT_SID!, process.env.GGP_TWILIO_AUTH_TOKEN!);
const from = process.env.GGP_TWILIO_PHONE_NUMBER;

const restrictWhatsapp = process.env.GGP_RESTRICT_TWILIO === "true";

export const numberWithCurrencyFormatter = (currency = "USD", amount = 0, locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export const findUser = async (id: string) => {
  const { data, error } = await SupabaseClient.from("partner").select().eq("id", id).maybeSingle();

  if (error) {
    console.error("Error findUser:", error);
    return;
  }

  return data;
};

export const findUserByEmail = async (email: string) => {
  const { data, error } = await SupabaseClient.from("partner").select().ilike("email", email).maybeSingle();

  if (error) {
    console.error("Error findUser:", error);
    return;
  }

  return data;
};

export const findChapterDetails = async (chapterId: string) => {
  const { data: chapterDetails } = await SupabaseClient.from("chapter") // <-- replace with your table
    .select() // object of fields to update
    .eq("id", chapterId) // condition
    .maybeSingle();
  if (chapterDetails) {
    const currency = chapterDetails?.base_currency || "";
    const chapterName = chapterDetails?.name || "";
    const chapterReps = chapterDetails?.reps || [];
    return {
      id: chapterDetails.id,
      currency,
      chapterName,
      chapterReps,
    };
  }
  return {
    id: "",
    currency: "",
    chapterName: "",
    chapterReps: [],
  };
};

export const makePayment = async (paymentData: Partial<PaymentRowType>, log = false) => {
  const { approved_by_id, organisation_id, currency, user_id } = paymentData;
  if ((!log && !approved_by_id) || !organisation_id || !currency || !user_id) {
    throw new Error("Something went wrong, incomplete details");
  }
  const { data, error } = await SupabaseClient.from("payment").insert(paymentData).select().maybeSingle();
  if (error) {
    console.log("makePaymentError", error);
    return;
  }
  return data;
};

const monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getPaidMonths = (userPayments: PaymentRowType[]) => {
  const paidMonths = userPayments.reduce((paidMonthArray, payment) => {
    if (payment.status === "Paid" && payment.remission_year === dayjs().format("YYYY")) {
      paidMonthArray = [...paidMonthArray, payment?.remission_month || ""];
    }
    return paidMonthArray;
  }, [] as string[]);

  return paidMonths;
};

const updateUserStatus = async (user_id: string, remission_start_date: string) => {
  if (!user_id) return;
  const pageSize = 100;
  const userPayments: PaymentRowType[] = [];
  const fetchUserPayments = async (from = 0) => {
    const to = from + pageSize - 1;
    const { data, error } = await SupabaseClient.from("payment")
      .select("*")
      .eq("user_id", user_id)
      .order("payment_date", {
        ascending: false,
      })
      .range(from, to);
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
  const paidMonths = getPaidMonths(userPayments).filter(Boolean);
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
  const { data, error: updateError } = await SupabaseClient.from("partner")
    .update({
      status: userStatus,
    })
    .eq("id", user_id)
    .select()
    .single();
  if (updateError) {
    console.log("updateUserStatus error", userStatus, updateError);
    throw updateError;
  }
  console.log("updated user status", userStatus);
  return data;
};

interface SendPaymentReceivedMessageParams {
  to: string;
  name: string;
  amount: string;
  period: string;
  approved_by_name: string;
  remission_period: string;
  remission_amount: string;
  payment_date: string;
  chapter_name: string;
}

const sendPaymentReceivedMessage = async ({
  to,
  name,
  amount,
  period,
  remission_period,
  remission_amount,
  payment_date,
  chapter_name,
  approved_by_name,
}: SendPaymentReceivedMessageParams) => {
  try {
    if (restrictWhatsapp) {
      return;
    }

    if (!to) {
      console.log("Invalid phone number, skipping WhatsApp message");
      return;
    }

    const message = await client.messages.create({
      contentSid: "HXcb271774359c849dac6b3f32d056547e",
      contentVariables: JSON.stringify({
        1: name,
        2: amount,
        3: period,
        4: remission_period,
        5: remission_amount,
        6: payment_date,
        7: chapter_name,
        8: approved_by_name,
      }),
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });

    console.log("sendPaymentReceivedMessage", to, message.body);
  } catch (err) {
    console.log("error sendPaymentReceivedMessage", err);
  }
};

export const handleMailingAndStatusUpdates = async ({
  user_id,
  currency,
  amount,
  remission_period,
  email,
  user_name,
  chapter_id,
  phone_number,
  remission_start_date,
  successfulMonthly,
  remission_day,
}: {
  user_id: string;
  currency: string;
  amount: number;
  email: string;
  remission_period: string;
  user_name: string;
  chapter_id: string;
  phone_number: string;
  remission_start_date: string;
  successfulMonthly: boolean;
  remission_day: string;
}) => {
  const { chapterName } = await findChapterDetails(chapter_id);
  const recipientMails = [email];
  const mailSubject = `Your GGP Remission Has Been Received! Thank You for Partnering with God’s Prophet`;
  const mailBody = PaymentReciept({
    first_name: user_name,
    currency: currency.toUpperCase(),
    amount: amount,
    remission_period,
    remissionDate: dayjs().format("MMMM DD, YYYY"),
    baseUrl: "https://www.globalgospelpartnership.org",
    chapterName,
    approved_by: "Online Paystack",
  });

  await sendMailWithoutKeys({ recipientMails, mailSubject, mailBody });
  console.log("sent payment receipt mail to ", email);

  phone_number &&
    (await sendPaymentReceivedMessage({
      to: phone_number,
      name: user_name,
      amount: numberWithCurrencyFormatter(currency, amount),
      period: remission_period,
      remission_period: remission_period,
      remission_amount: numberWithCurrencyFormatter(currency, amount),
      payment_date: dayjs().format("MMMM DD, YYYY"),
      chapter_name: chapterName,
      approved_by_name: "Online Paystack",
    }));

  await updateUserStatus(user_id, remission_start_date);

  if (successfulMonthly) {
    const { data, error: updateError } = await SupabaseClient.from("partner")
      .update({
        active_recurring_remission: true,
        preferred_remission_day: +remission_day,
      })
      .eq("id", user_id)
      .select()
      .single();
  }
};
