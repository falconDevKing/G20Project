// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/data";
import { env } from "$amplify/env/sendUserMessages";
// import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
// import type { Schema } from "../../data/resource";
import { sendMailWithoutKeys } from "../../utils/sendMailWithoutKeys";
import SupabaseClient from "../../utils/supabaseConnection";
import type { Schema } from "../../data/resource";
import { formatDateToMMDD, personaliseMessage, getRemissionsMonthsBetween, chunk } from "./helper";
import SendUserMessagesMailTemplateWrapper from "./sendUserMessagesTemplate";
import { sendPersonalisedInBatches, sleep } from "./resendBatch";
import { PartnerRowType } from "../../interfaces/modifiedSupabaseTypes";

const SENDER_MAIL = process.env.GGP_SENDER_MAIL;

// You could index date_of_birth and add a generated column for birth_mm_dd to optimize performance if needed.
type DateType = {
  from?: string;
  to?: string;
};

const PAGE_SIZE = 1000;

type DateRange = {
  from: Date | undefined;
  to?: Date;
};

type StringRange = { from?: string; to?: string };

// TODO: update function to be fire and forget cause of appsync  30sec timeout
const allowResend = process.env.GGP_ALLOW_RESEND === "true";
console.log("process.env.GGP_ALLOW_RESEND", process.env.GGP_ALLOW_RESEND, "allowResend", allowResend, typeof allowResend);

export const handler = async (event: any) => {
  console.log("event", event);
  console.log("process.env.GGP_SENDER_MAIL", process.env.GGP_SENDER_MAIL);
  console.log("envs", env);

  let mailRequest = event?.arguments;
  if (event.processingCase === "send_user_messages") {
    mailRequest = event.processingPayload;
  }

  const { subject, body, filterData, selectedUsersIds } = mailRequest;
  console.log("subject", subject, "filterData", filterData, "selectedUsersIds", selectedUsersIds, "body", body);

  // TODO: TRIGGER FUNCTION and SCALE FOR MULTIPLE RUNS within organisation using step functions
  try {
    const usersData: PartnerRowType[] = [];

    // GET SELECTED USERS IDS OR FILTERS
    const fetchUsers = async (page: number = 0): Promise<void> => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      //TODO: select relavant  properties
      let query: any = SupabaseClient.from("partner").select("*", { count: "exact" }).range(from, to);

      const filteredUsersIds = (selectedUsersIds || []).filter(Boolean);

      if (filteredUsersIds.length > 0) {
        query = query.in("id", filteredUsersIds);
      } else {
        for (const filter of filterData) {
          if (!filter) {
            continue;
          }
          const field = filter.field || "";
          const operator = filter.operator;
          const value = filter.value;
          if (!value) continue;
          if (typeof value === "string" && (!value.trim() || value === "all")) continue;

          switch (operator) {
            case "Equals": {
              // string equality
              const r = value as DateRange;
              if (field === "birth_day_mmdd") {
                r.from && query.eq(field, formatDateToMMDD(r.from));
              } else if (field === "payment_date") {
                r.from && query.gte(field, new Date(r.from).toISOString().split("T")[0] + "T00:00:00.000Z");
                r.from && query.lte(field, new Date(r.from).toISOString().split("T")[0] + "T23:59:59.999Z");
              } else if (field === "remission_period") {
                // array of "YYYY-MM" or similar, using your helper
                if (r.from && r.to) {
                  const months = getRemissionsMonthsBetween(r.from, r.to);
                  if (months?.length) query = query.in(field, months);
                }
              } else if (field === "active_recurring_remission") {
                if (typeof value === "string" && ["True", "False"].includes(value)) {
                  if (value === "True") {
                    query = query.eq(field, true);
                  } else {
                    query = query.or(`${field}.eq.false,${field}.is.null`);
                  }
                }
              } else if (field === "online_payment") {
                if (typeof value === "string" && ["True", "False"].includes(value)) {
                  if (value === "True") {
                    query = query.ilike("approved_by", "%online%");
                  } else {
                    query = query.or(`approved_by.not.ilike.%Online%,approved_by.is.null`);
                  }
                }
              } else if (field === "preferred_remission_day") {
                query = query.eq(field, +value);
              }

              if (typeof value === "string" && !["active_recurring_remission", "online_payment"].includes(field)) {
                query = query.eq(field, value);
              }
              break;
            }
            case "Contains": {
              // case‑insensitive contains for strings
              if (typeof value === "string") {
                query = query.ilike(field, `%${value.toLowerCase()}%`);
              }
              break;
            }

            case "Within": {
              // date/range fields
              const r = value as DateRange;

              if (field === "payment_date") {
                r.from && query.gte(field, new Date(r.from).toISOString().split("T")[0] + "T00:00:00.000Z");
                r.to && query.lte(field, new Date(r.to).toISOString().split("T")[0] + "T23:59:59.999Z");
              } else if (field === "birth_day_mmdd") {
                r.from && query.gte(field, formatDateToMMDD(r.from));
                r.to && query.lte(field, formatDateToMMDD(r.to));
              } else if (field === "remission_period") {
                // array of "YYYY-MM" or similar, using your helper
                if (r.from && r.to) {
                  const months = getRemissionsMonthsBetween(r.from, r.to);
                  if (months?.length) query = query.in(field, months);
                }
              } else if (field === "preferred_remission_day") {
                const ss = value as StringRange;
                ss.from && query.gte(field, +ss.from);
                ss.to && query.lte(field, +ss.to);
              }
              break;
            }
            case "Not Equals": {
              // string equality
              if (typeof value === "string") {
                query = query.neq(field, value);
              }
              break;
            }
          }
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        usersData.push(...data);

        // if full page returned, assume more exist
        if (data.length === PAGE_SIZE) {
          await fetchUsers(page + 1);
        }
      }
    };

    await fetchUsers();

    // GET CHAPTERS AND DIVISION DATA ARRAY
    const { data: chapterData, error: chapterError } = await SupabaseClient.from("chapter").select("*").range(0, 999);
    const { data: divisionData, error: divisionError } = await SupabaseClient.from("division").select("*").range(0, 999);

    if (chapterError || divisionError) {
      throw new Error("Failed to fetch chapters and divisions");
    }

    // CREATE PERSONALISED MAILS PROMISES
    const userMailsData = usersData.map((user) => {
      const { email } = user;

      const mailSubject = personaliseMessage(subject, user, divisionData, chapterData);
      const personalisedBody = personaliseMessage(body, user, divisionData, chapterData);
      const mailBody = SendUserMessagesMailTemplateWrapper(personalisedBody, mailSubject);

      return {
        from: `"GGP Office" <${SENDER_MAIL}>`,
        to: [email],
        subject: mailSubject,
        html: mailBody,
      };
    });

    if (allowResend) {
      const summary = await sendPersonalisedInBatches(userMailsData, 50);
      return {
        success: summary.failedBatches === 0,
        messageId: "Mails sent successfuly",
      };
    } else {
      // Batch userMailsData into groups of 50 and send each batch in parallel, waiting 1 second between batches
      const batchSize = 20;
      const delayMs = 1000;

      const userMailBatches = chunk(userMailsData, batchSize);

      for (let batchNo = 0; batchNo < userMailBatches.length; batchNo += 1) {
        const batch = userMailBatches[batchNo];
        const userMailsPromises = batch.map(async ({ to, subject: mailSubject, html: mailBody }) => {
          await sendMailWithoutKeys({ recipientMails: to, mailSubject, mailBody });
        });

        await Promise.all(userMailsPromises);

        // Wait 1 second between batches, except after the last batch
        if (batchNo < userMailBatches.length - 1) {
          await sleep(delayMs);
        }
        console.log(`Batch ${batchNo + 1} of ${userMailBatches.length} attempted`);
      }

      return {
        success: true,
        messageId: "Mails sent successfuly",
      };
    }
  } catch (error) {
    console.log("sending mail request error", error);
    return {
      success: false,
      messageId: "Mails processing failed",
    };
  }
};
