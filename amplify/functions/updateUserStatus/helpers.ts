// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/data";
// import { env } from "$amplify/env/updateUserStatus";
// import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";

import dayjs from "dayjs";
import { PaymentRowType } from "../../interfaces/modifiedSupabaseTypes";
import SupabaseClient from "../../utils/supabaseConnection";

const PAGE_SIZE = 1000;

const organisationId = process.env.GGP_ORG_ID as string;

export const monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getPaidMonths = (userPayments: PaymentRowType[]) => {
  const paidMonths = userPayments.reduce((paidMonthArray, payment) => {
    if (payment.status === "Paid" && payment.remission_year === dayjs().format("YYYY")) {
      paidMonthArray = [...paidMonthArray, payment.remission_month as string];
    }
    return paidMonthArray;
  }, [] as string[]);

  return paidMonths;
};

// export const getChapters = async (queueUrl: string) => {
//   const chaptersData: any[] = [];

//   const pageSize = 100;
//   let from = 0;

//   const fetchChaptersData = async (): Promise<void> => {
//     const { data: chapters, error } = await SupabaseClient.from("chapter")
//       .select("id, name")
//       .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
//       .range(from, from + pageSize - 1);

//     if (error) {
//       console.log("Error fetching chapters", error);
//       throw error;
//     }

//     if (chapters && chapters.length > 0) {
//       chaptersData.push(...chapters);

//       if (chapters.length === pageSize) {
//         from += pageSize;
//         await fetchChaptersData(); //  Recursive call
//       }
//     }
//   };

//   await fetchChaptersData();

//   console.log("chaptersData", chaptersData);

//   const chaptersPromises = chaptersData.map(async (chapter) => {
//     const { id, name } = chapter;
//     const chapterData = { chapterId: id, fetchKey: "", chapterName: name };

//     if (queueUrl) {
//       const addedToQueue = await addMessageToQueue(queueUrl, chapterData);
//       console.log(`Added ${name} to queue:`, addedToQueue);
//     }
//   });

//   await Promise.all(chaptersPromises);
// };

/// TODO: Look into using nexttoken across
export const fetchChapterUsers = async (from: number = 0) => {
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await SupabaseClient.from("partner")
    .select("id, remission_start_date, status")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  console.log("organisationUsersBatch from ", from, data.length);
  return {
    users: data,
    next: data.length === PAGE_SIZE ? from + PAGE_SIZE : null,
  };
};

export const getUserPaymentsForCurrentYear = async (userId: string) => {
  const currentYear = dayjs().format("YYYY");
  const allPayments: PaymentRowType[][] = [];
  const pageSize = 1000;

  const fetchPayments = async (from: number = 0): Promise<void> => {
    const { data, error } = await SupabaseClient.from("payment")
      .select("*")
      .eq("user_id", userId)
      .eq("remission_year", currentYear)
      .order("created_at", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Error fetching payments:", error);
      return;
    }

    if (data && data.length > 0) {
      allPayments.push(data);

      if (data.length === pageSize) {
        await fetchPayments(from + pageSize);
      }
    }
  };

  await fetchPayments();

  return allPayments.flat();
};

export const updateUserStatus = async (userId: string, remissionStartDate?: string | null, oldStatus?: string | null) => {
  if (!userId) return;

  // Step 1: Fetch all payments for user
  const userPayments = await getUserPaymentsForCurrentYear(userId);
  const paidMonths = getPaidMonths(userPayments || []);
  const currentMonthIndex = +dayjs().format("M");

  const remissionStartMonth =
    remissionStartDate && dayjs(remissionStartDate).format("YYYY") === dayjs().format("YYYY") ? +dayjs(remissionStartDate).format("M") : 1;

  const requiredMonths = monthsOfTheYear.filter((_, index) => index + 1 <= currentMonthIndex && index + 1 >= remissionStartMonth);

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

  // Step 2: Only update if status has changed
  if (oldStatus !== userStatus) {
    const { data: updatedUser, error: updateUserStatusError } = await SupabaseClient.from("partner")
      .update({ status: userStatus })
      .eq("id", userId)
      .select("id")
      .maybeSingle(); // optional: just return the updated id

    if (updateUserStatusError) {
      console.error("updateUserStatus error", updateUserStatusError);
      throw updateUserStatusError;
    }

    console.log("updated for", updatedUser?.id);
  }
};
