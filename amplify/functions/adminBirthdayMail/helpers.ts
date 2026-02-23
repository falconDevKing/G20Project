import dayjs from "dayjs";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { env } from "$amplify/env/adminBirthdayMail";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import twilio from "twilio";

import type { Schema } from "../../data/resource";
import SupabaseClient from "../../utils/supabaseConnection";
import { ChapterRowType, DivisionRowType } from "../../interfaces/modifiedSupabaseTypes";

const client = twilio(process.env.GGP_TWILIO_ACCOUNT_SID!, process.env.GGP_TWILIO_AUTH_TOKEN!);
const from = process.env.GGP_TWILIO_PHONE_NUMBER;

const restrictWhatsapp = process.env.GGP_RESTRICT_TWILIO === "true";

const PAGE_SIZE = 1000;

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

export const getChapters = async () => {
  const chaptersData: { id: string; name: string }[] = [];

  const pageSize = 100;
  let from = 0;

  const fetchChaptersData = async () => {
    const { data: chapters, error } = await SupabaseClient.from("chapter")
      .select("id, name")
      .order("name", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + pageSize - 1);

    if (error) {
      console.log("Error fetching chapters", error);
      throw error;
    }

    if (chapters && chapters.length > 0) {
      chaptersData.push(...chapters);

      if (chapters.length === pageSize) {
        from += pageSize;
        await fetchChaptersData(); //  Recursive call
      }
    }
  };

  await fetchChaptersData();

  console.log("chaptersData", chaptersData.length);

  const sortedChapterData = chaptersData.sort((a, b) => ((a?.name || "") < (b?.name || "") ? -1 : 1));

  return sortedChapterData;
};

export const getAdminRepsData = async (chapterId: string, from: number = 0) => {
  if (!chapterId) {
    console.error("No chapter id:", chapterId);
    throw new Error("No chapter id: " + chapterId);
  }

  // Get chapter
  const { data: chapterData, error: chapterError } = await SupabaseClient.from("chapter").select("division_id, reps").eq("id", chapterId).single();

  if (chapterError || !chapterData) {
    console.error("Failed to fetch chapter:", chapterError);
    throw chapterError || new Error("Failed to fetch chapter: " + chapterId);
  }

  const division_id = chapterData.division_id;

  // Get division
  const { data: divisionData } = await SupabaseClient.from("division").select("reps").eq("id", division_id).single();

  const chapterReps = chapterData.reps as ChapterRowType["reps"];
  const divisionReps = divisionData?.reps as DivisionRowType["reps"];

  const chapterRepsMails: string[] = (chapterReps || [])?.map((rep: any) => rep?.email || "");
  const divisionRepsMails: string[] = (divisionReps || [])?.map((rep: any) => rep?.email || "");

  const repsId = [...(chapterReps || []), ...(divisionReps || [])].map((rep) => rep.id);

  const { data: repsData, error } = await SupabaseClient.from("partner").select("id, name, phone_number, email").in("id", repsId);

  if (error) {
    console.error("Error fetching reps  with ids: ", repsId, " - ", error);
    return { chapterReps, divisionReps, chapterRepsMails, divisionRepsMails, repsData: [] };
  }

  return { chapterReps, divisionReps, chapterRepsMails, divisionRepsMails, repsData };
};

export const fetchChapterUsersWithBirthday = async (chapterId: string, from: number = 0) => {
  const to = from + PAGE_SIZE - 1;

  // Calculate date range for this week's birthdays
  const startDay = dayjs().startOf("week");
  const weekMMDDs = Array.from({ length: 7 }, (_, i) => startDay.add(i, "day").format("MM-DD"));

  const { data, error } = await SupabaseClient.from("partner")
    .select("name, phone_number, date_of_birth")
    .eq("chapter_id", chapterId)
    .in("birth_day_mmdd", weekMMDDs)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching users with birthday:", error);
    throw error;
  }

  console.log("chapterUsersWithBDay from ", from, data.length);

  return {
    chapterUsersWithBDay: data,
    next: data.length === PAGE_SIZE ? from + PAGE_SIZE : null,
  };
};

interface SendAdminBirthdayReminderMessageParams {
  to: string;
}

export const sendAdminBirthdayReminderMessage = async ({ to }: SendAdminBirthdayReminderMessageParams) => {
  try {
    if (restrictWhatsapp) {
      return;
    }
    const message = await client.messages.create({
      contentSid: "HXd9d0dbc00190d35b372fc434bd91900c",
      contentVariables: JSON.stringify({}),
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
    });

    console.log("sendPaymentReceivedMessage", to, message.body);
  } catch (err) {
    console.log("error sendAdminBirthdayReminderMessage", err);
  }
};
