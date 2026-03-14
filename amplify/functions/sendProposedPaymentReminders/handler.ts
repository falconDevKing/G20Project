import SupabaseClient from "../../utils/supabaseConnection";
import { sendMailWithoutKeys } from "../../utils/sendMailWithoutKeys";
import ProposedPaymentReminderTemplate from "./proposedPaymentReminderTemplate";

const PAGE_SIZE = 1000;
const REMINDER_OFFSETS = [14, 7, 3, 2, 1] as const;

type ProposedReminderRow = {
  id: string;
  created_at: string;
  proposed_amount: number;
  proposed_date: string;
  currency: string | null;
  email: string;
  first_name: string;
  last_name: string;
  status: "pending" | "missed" | "cleared" | null;
};

const toUtcDateString = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addUtcDays = (date: Date, days: number) => {
  const nextDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
};

const getDaysRemaining = (today: Date, proposedDate: string) => {
  const [year, month, day] = proposedDate.split("-").map(Number);
  const proposedUtc = Date.UTC(year, month - 1, day);
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((proposedUtc - todayUtc) / 86400000);
};

const getDashboardUrl = () => {
  const baseUrl = process.env.GGP_BASE_URL || process.env.BASE_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/dashboard`;
};

const getReminderDates = (today: Date) => REMINDER_OFFSETS.map((offset) => toUtcDateString(addUtcDays(today, offset)));

const fetchReminderRows = async (from: number, today: Date) => {
  const reminderDates = getReminderDates(today);
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await SupabaseClient.from("proposed_payment_schedule")
    .select("id, created_at, proposed_amount, proposed_date, currency, email, first_name, last_name, status")
    .in("proposed_date", reminderDates)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    rows: (data || []) as ProposedReminderRow[],
    next: (data || []).length === PAGE_SIZE ? from + PAGE_SIZE : null,
  };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const handler = async (event: { nextToken?: number | null; loop?: boolean }) => {
  console.log("event", event);

  try {
    const today = new Date();
    const from = event?.loop ? event?.nextToken || 0 : 0;
    const { rows, next } = await fetchReminderRows(from, today);
    const dashboardUrl = getDashboardUrl();

    await Promise.all(
      rows
        .filter((row) => !!row.email)
        .map(async (row) => {
          const daysRemaining = getDaysRemaining(today, row.proposed_date);

          if (!REMINDER_OFFSETS.includes(daysRemaining as (typeof REMINDER_OFFSETS)[number])) {
            return;
          }

          const mailSubject = `Proposal Payment Reminder: ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} to go`;
          const mailBody = ProposedPaymentReminderTemplate({
            firstName: row.first_name || row.last_name || "Partner",
            proposedDate: row.proposed_date,
            proposedAmount: row.proposed_amount,
            currency: row.currency,
            daysRemaining,
            dashboardUrl,
          });

          await sendMailWithoutKeys({
            recipientMails: [row.email],
            mailSubject,
            mailBody,
          });
        }),
    );

    const batchSize = 20;
    const delayMs = 1000;

    const userMailBatches = chunk(rows, batchSize);

    for (let batchNo = 0; batchNo < userMailBatches.length; batchNo += 1) {
      const batch = userMailBatches[batchNo];
      const userMailsPromises = batch
        .filter((row) => !!row.email)
        .map(async (row) => {
          const daysRemaining = getDaysRemaining(today, row.proposed_date);

          if (!REMINDER_OFFSETS.includes(daysRemaining as (typeof REMINDER_OFFSETS)[number])) {
            return;
          }

          const mailSubject = `Proposal Payment Reminder: ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} to go`;
          const mailBody = ProposedPaymentReminderTemplate({
            firstName: row.first_name || row.last_name || "Partner",
            proposedDate: row.proposed_date,
            proposedAmount: row.proposed_amount,
            currency: row.currency,
            daysRemaining,
            dashboardUrl,
          });

          await sendMailWithoutKeys({
            recipientMails: [row.email],
            mailSubject,
            mailBody,
          });
        });

      await Promise.all(userMailsPromises);

      // Wait 1 second between batches, except after the last batch
      if (batchNo < userMailBatches.length - 1) {
        await sleep(delayMs);
      }
      console.log(`Batch ${batchNo + 1} of ${userMailBatches.length} attempted`);
    }

    console.log({ from, processed: rows.length, nextToken: next, loop: !!next });
    return { nextToken: next, loop: !!next };
  } catch (error) {
    console.log("send proposed payment reminders error", error);
    return { nextToken: null, loop: false };
  }
};
