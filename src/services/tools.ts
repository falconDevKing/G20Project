import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import store from "../redux/store";
import { fetchDivisionsData, fetchChaptersData } from "./appData";
import SupabaseClient from "@/supabase/supabaseConnection";

import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

// TODO: update supabase calls to use  PostgrestSingleResponse

export const createEntity = async (label: string, data: Record<string, string>) => {
  try {
    const { name, division_id, country, base_currency } = data;

    switch (label) {
      case "Division": {
        const createdDivision = await createDivision(name);
        return createdDivision;
      }

      case "Chapter": {
        const createdChapter = await createChapter(name, division_id, country, base_currency);
        return createdChapter;
      }

      default:
        throw new Error("No matched entity case");
    }
  } catch (error) {
    console.log("createEntity error", error);
    throw error;
  }
};

export const updateEntity = async (label: string, data: Record<string, string>) => {
  try {
    const { id, name, division_id, country, base_currency } = data;

    switch (label) {
      case "Division": {
        const updatedDivision = await updateDivision(id, name);
        return updatedDivision;
      }

      case "Chapter": {
        const updatedChapter = await updateChapter(id, name, division_id, country, base_currency);
        return updatedChapter;
      }

      default:
        throw new Error("No matched entity case");
    }
  } catch (error) {
    console.log("createEntity error", error);
    throw error;
  }
};

export const createDivision = async (name: string) => {
  try {
    const organisation_id = store.getState().app.organisation.id;

    const { data: createdDivision, error } = await SupabaseClient.from("division")
      .insert({
        name,
        organisation_id: organisation_id,
        reps: [],
      })
      .select()
      .single(); // Ensures you get a single row object instead of array

    if (error) {
      console.log("createDivision error", error);
      throw error;
    }

    await fetchDivisionsData();
    return createdDivision;
  } catch (error) {
    console.log("createDivision error", error);
    throw error;
  }
};
export const updateDivision = async (id: string, name: string) => {
  try {
    const { data: updatedDivision, error } = await SupabaseClient.from("division").update({ name }).eq("id", id).select().single();

    if (error) {
      console.log("updateDivision error", error);
      throw error;
    }

    await fetchDivisionsData();
    return updatedDivision;
  } catch (error) {
    console.log("updateDivision error", error);
    throw error;
  }
};

export const createChapter = async (name: string, division_id: string, country: string, base_currency: string) => {
  try {
    const organisation_id = store.getState().app.organisation.id;

    const { data: createdChapter, error } = await SupabaseClient.from("chapter")
      .insert([
        {
          name,
          division_id: division_id,
          country,
          base_currency: base_currency,
          organisation_id: organisation_id,
          reps: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("createChapter error", error);
      throw error;
    }

    await fetchChaptersData();
    return createdChapter;
  } catch (error) {
    console.log("createChapter error", error);
    throw error;
  }
};

export const updateChapter = async (id: string, name: string, division_id: string, country: string, base_currency: string) => {
  try {
    const { data: updatedChapter, error } = await SupabaseClient.from("chapter")
      .update({
        name,
        division_id: division_id,
        country,
        base_currency: base_currency,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log("updateChapter error", error);
      throw error;
    }

    await fetchChaptersData();
    return updatedChapter;
  } catch (error) {
    console.log("updateChapter error", error);
    throw error;
  }
};

export const sendMessageRequesthandler = async (messageRequest: {
  subject: string;
  body: string;
  filterData: Record<string, any>[];
  selectedUsersIds: string[];
}) => {
  try {
    const { errors: sendMessageRequestError } = await client.queries.sendUserEmailRequests(messageRequest);
    if (sendMessageRequestError) {
      throw sendMessageRequestError;
    }

    SuccessHandler(`Sent message request`);
  } catch (error: any) {
    console.log("error sending message request", error.message, error);
    ErrorHandler("Message Request failed");
  }
};

type ChapterOptionsType = {
  value: string;
  name: string;
  filt: string;
  currency: string;
}[];

export const resolvedTypedChapter = async (ChapterOptions: ChapterOptionsType, division_id: string, chapter_id: string) => {
  // Resolve / create chapter
  let resolvedChapterId = chapter_id;

  // 1. Do we already know this as an existing chapter?
  const existingChapter = ChapterOptions.find((c) => c.value === chapter_id || c.name.toLowerCase() === chapter_id.toLowerCase());

  if (existingChapter) {
    resolvedChapterId = existingChapter.value as string;
  } else {
    if (!division_id) {
      ErrorHandler("Please select a division before submitting");
      throw new Error("Please select a division before submitting");
    }

    // 2. It is a new chapter name → create on the fly
    const newChapterName = chapter_id.trim();

    if (!newChapterName) {
      ErrorHandler("Chapter name is required");
      throw new Error("Chapter name is required");
    }

    const newChapter = await createChapter(newChapterName, division_id, "Nigeria", "NGN");

    resolvedChapterId = newChapter.id;
  }

  return resolvedChapterId;
};
