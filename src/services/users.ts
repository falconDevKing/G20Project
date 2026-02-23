import { fetchChaptersData, fetchDivisionsData, fetchOrganisationData, fetchUsersByEntity } from "./appData";

import SupabaseClient from "@/supabase/supabaseConnection";
import type { OrganisationRowType, PartnerRowType, PartnerUpdateType } from "@/supabase/modifiedSupabaseTypes";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export const updateMember = async (userData: PartnerUpdateType): Promise<PostgrestSingleResponse<PartnerRowType> | boolean> => {
  try {
    if (!userData.id) {
      return false;
    }
    const response = await SupabaseClient.from("partner").update(userData).eq("id", userData.id).select().single();

    if (response.error) {
      console.log("updateMember error", response.error);
      throw response.error;
    }

    await fetchUsersByEntity();
    return response;
  } catch (error) {
    console.log("verify user code error", error);
    throw error;
  }
};

export const updateG20Member = async (userData: PartnerUpdateType): Promise<PostgrestSingleResponse<PartnerRowType> | boolean> => {
  try {
    if (!userData.id) {
      return false;
    }
    const response = await SupabaseClient.from("g20_partner").update(userData).eq("id", userData.id).select().single();

    if (response.error) {
      console.log("updateMember error", response.error);
      throw response.error;
    }

    return response;
  } catch (error) {
    console.log("verify user code error", error);
    throw error;
  }
};

export const addRep = async (userData: any, newPermission: string) => {
  try {
    if (newPermission === "individual") {
      return;
    }

    const user_id = userData.id;
    const newEntitykey = newPermission + "_id";
    const repData = {
      id: user_id,
      name: (userData?.first_name || "") + " " + (userData?.last_name || ""),
      email: userData.email,
      phone_number: userData.phone_number,
    };
    const entity_id = userData[newEntitykey];

    switch (newPermission) {
      case "organisation": {
        const updatedOrganisation = await addRepToOrganisation(entity_id, repData);
        return updatedOrganisation;
      }

      case "division": {
        const updatedDivision = await addRepToDivision(entity_id, repData);
        return updatedDivision;
      }

      case "chapter": {
        const updatedChapter = await addRepToChapter(entity_id, repData);
        return updatedChapter;
      }

      default:
        throw new Error("No matched entity case");
    }
  } catch (error) {
    console.log("addRep error", error);
    throw error;
  }
};

export const removeRep = async (userData: any, oldPermission: string) => {
  try {
    if (oldPermission === "individual") {
      return;
    }

    const user_id = userData.id;
    const oldEntitykey = oldPermission + "_id";
    const entity_id = userData[oldEntitykey];

    switch (oldPermission) {
      case "organisation": {
        const updatedOrganisation = await removeRepFromOrganisation(entity_id, user_id);

        return updatedOrganisation;
      }

      case "division": {
        const updatedDivision = await removeRepFromDivision(entity_id, user_id);

        return updatedDivision;
      }

      case "chapter": {
        const updatedChapter = await removeRepFromChapter(entity_id, user_id);
        return updatedChapter;
      }

      default:
        throw new Error("No matched entity case");
    }
  } catch (error) {
    console.log("verify user code error", error);
    throw error;
  }
};

export const addRepToOrganisation = async (organisation_id: string, repData: { id: string; name: string }) => {
  try {
    // Fetch current organisation
    const { data: organisation, error: getOrgError }: PostgrestSingleResponse<OrganisationRowType> = await SupabaseClient.from("organisation")
      .select("reps")
      .eq("id", organisation_id)
      .single();

    if (getOrgError) {
      console.log("addRepToOrganisation fetch error", getOrgError);
      throw getOrgError;
    }

    const existingReps = (organisation?.reps || []) as { id: string; name: string }[];

    const filteredReps = existingReps.filter((rep) => rep.id !== repData.id);
    const updatedReps = [...filteredReps, repData];

    // Update organisation with new reps
    const updateResponse: PostgrestSingleResponse<OrganisationRowType> = await SupabaseClient.from("organisation")
      .update({ reps: updatedReps })
      .eq("id", organisation_id)
      .select()
      .single();

    if (updateResponse.error) {
      console.log("addRepToOrganisation update error", updateResponse.error);
      throw updateResponse.error;
    }

    await fetchOrganisationData();
    return updateResponse;
  } catch (error) {
    console.log("addRepToOrganisation error", error);
    throw error;
  }
};

export const removeRepFromOrganisation = async (organisation_id: string, repId: string) => {
  try {
    // Fetch current organisation reps
    const { data: organisation, error: getOrgError }: PostgrestSingleResponse<OrganisationRowType> = await SupabaseClient.from("organisation")
      .select("reps")
      .eq("id", organisation_id)
      .single();

    if (getOrgError) {
      console.log("removeRepFromOrganisation fetch error", getOrgError);
      throw getOrgError;
    }

    const existingReps = (organisation?.reps || []) as { id: string; name: string }[];

    if (!existingReps.length) {
      return { data: organisation, error: null, status: 200, statusText: "OK" };
    }

    const updatedReps = existingReps.filter((rep) => rep.id !== repId);

    // Update organisation with filtered reps
    const { error: updateOrganisationError, data: updatedOrganisation }: PostgrestSingleResponse<OrganisationRowType> = await SupabaseClient.from(
      "organisation",
    )
      .update({ reps: updatedReps })
      .eq("id", organisation_id)
      .select()
      .single();

    if (updateOrganisationError) {
      console.log("removeRepFromOrganisation update error", updateOrganisationError);
      throw updateOrganisationError;
    }

    await fetchOrganisationData();
    return updatedOrganisation;
  } catch (error) {
    console.log("removeRepFromOrganisation error", error);
    throw error;
  }
};

const addRepToDivision = async (division_id: string, repData: { id: string; name: string }) => {
  try {
    const { data: division, error: getDivisionError } = await SupabaseClient.from("division").select("reps").eq("id", division_id).single();

    if (getDivisionError) {
      console.log("addRepToDivision graphql error", getDivisionError);
      throw getDivisionError;
    }

    const divisionReps = division?.reps || [];

    const filteredDivisionReps = divisionReps.filter((rep: any) => rep?.id !== repData.id);
    const updatedDivisionRep = [...filteredDivisionReps, repData];

    const { data: updatedDivision, error: updateDivisionError } = await SupabaseClient.from("division")
      .update({ reps: updatedDivisionRep })
      .eq("id", division_id)
      .select()
      .single();

    if (updateDivisionError) {
      console.log("addRepToDivision update error", updateDivisionError);
      throw updateDivisionError;
    }
    await fetchDivisionsData();

    return updatedDivision;
  } catch (error) {
    console.log("addRepToDivision error", error);
    throw error;
  }
};

const removeRepFromDivision = async (division_id: string, repId: string) => {
  try {
    const { data: division, error: getDivisionError } = await SupabaseClient.from("division").select("reps").eq("id", division_id).single();

    if (getDivisionError) {
      console.log("removeRepFromDivision fetch error", getDivisionError);
      throw getDivisionError;
    }

    const divisionReps = division?.reps || [];

    if (!divisionReps?.length) {
      return;
    }
    const filteredDivisionReps = divisionReps.filter((rep: any) => rep?.id !== repId);

    // Update division reps
    const { data: updatedDivision, error: updateDivisionError } = await SupabaseClient.from("division")
      .update({ reps: filteredDivisionReps })
      .eq("id", division_id)
      .select()
      .single();

    if (updateDivisionError) {
      console.log("removeRepFromDivision update error", updateDivisionError);
      throw updateDivisionError;
    }
    await fetchDivisionsData();

    return updatedDivision;
  } catch (error) {
    console.log("removeRepFromDivision error", error);
    throw error;
  }
};

const addRepToChapter = async (chapter_id: string, repData: { id: string; name: string }) => {
  try {
    const { data: chapter, error: getChapterError } = await SupabaseClient.from("chapter").select("reps").eq("id", chapter_id).single();

    if (getChapterError) {
      console.log("addRepToChapter graphql error", getChapterError);
      throw getChapterError;
    }

    const chapterReps = chapter?.reps || [];

    const filteredChapterReps = chapterReps.filter((rep: any) => rep?.id !== repData.id);
    const updatedChapterRep = [...filteredChapterReps, repData];

    const { data: updatedChapter, error: updateChapterError } = await SupabaseClient.from("chapter")
      .update({ reps: updatedChapterRep })
      .eq("id", chapter_id)
      .select()
      .single();

    if (updateChapterError) {
      console.log("addRepToChapter update error", updateChapterError);
      throw updateChapterError;
    }
    await fetchChaptersData();

    return updatedChapter;
  } catch (error) {
    console.log("addRepToChapter error", error);
    throw error;
  }
};

const removeRepFromChapter = async (chapter_id: string, repId: string) => {
  try {
    const { data: chapter, error: getChapterError } = await SupabaseClient.from("chapter").select("reps").eq("id", chapter_id).single();

    if (getChapterError) {
      console.log("removeRepFromChapter fetch error", getChapterError);
      throw getChapterError;
    }

    const chapterReps = chapter?.reps || [];

    if (!chapterReps?.length) {
      return;
    }
    const filteredChapterReps = chapterReps.filter((rep: any) => rep?.id !== repId);

    // Update Chapter reps
    const { data: updatedChapter, error: updateChapterError } = await SupabaseClient.from("chapter")
      .update({ reps: filteredChapterReps })
      .eq("id", chapter_id)
      .select()
      .single();

    if (updateChapterError) {
      console.log("removeRepFromChapter update error", updateChapterError);
      throw updateChapterError;
    }
    await fetchChaptersData();

    return updatedChapter;
  } catch (error) {
    console.log("removeRepFromChapter error", error);
    throw error;
  }
};
