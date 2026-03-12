import { fetchOrganisationData, fetchUsersByEntity, fetchShepherdEntitiesData, fetchGovernorEntitiesData, fetchPresidentEntitiesData } from "./appData";

import SupabaseClient from "@/supabase/supabaseConnection";
import type { OrganisationRowType, PartnerRowType, PartnerUpdateType } from "@/supabase/modifiedSupabaseTypes";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

type OperationalEntityTable = "shepherd" | "governor" | "president";

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

const refreshOperationalEntityData = async (tableName: OperationalEntityTable) => {
  if (tableName === "shepherd") {
    await fetchShepherdEntitiesData();
    return;
  }

  if (tableName === "governor") {
    await fetchGovernorEntitiesData();
    return;
  }

  await fetchPresidentEntitiesData();
};

export const addRep = async (userData: any, newPermission: string) => {
  try {
    if (!newPermission || newPermission === "individual") {
      return;
    }

    const repData = {
      id: userData.id,
      name: `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim(),
      email: userData.email,
      phone_number: userData.phone_number,
    };
    const entityId = userData[`${newPermission}_id`];

    switch (newPermission) {
      case "shepherd":
      case "governor":
      case "president":
        return await addRepToOperationalEntity(newPermission, entityId, repData);
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
    if (!oldPermission || oldPermission === "individual") {
      return;
    }

    const repId = userData.id;
    const entityId = userData[`${oldPermission}_id`];

    switch (oldPermission) {
      case "shepherd":
      case "governor":
      case "president":
        return await removeRepFromOperationalEntity(oldPermission, entityId, repId);
      default:
        return;
    }
  } catch (error) {
    console.log("removeRep error", error);
    throw error;
  }
};

export const addRepToOrganisation = async (organisation_id: string, repData: { id: string; name: string }) => {
  try {
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

const addRepToOperationalEntity = async (tableName: OperationalEntityTable, entityId: string, repData: { id: string; name: string }) => {
  try {
    const { data: entity, error: getEntityError } = await SupabaseClient.from(tableName).select("reps").eq("id", entityId).single();

    if (getEntityError) {
      console.log("addRepToOperationalEntity fetch error", getEntityError);
      throw getEntityError;
    }

    const existingReps = entity?.reps || [];
    const filteredReps = existingReps.filter((rep: any) => rep?.id !== repData.id);
    const updatedReps = [...filteredReps, repData];

    const { data: updatedEntity, error: updateEntityError } = await SupabaseClient.from(tableName)
      .update({ reps: updatedReps, rep_partner_id: repData.id })
      .eq("id", entityId)
      .select()
      .single();

    if (updateEntityError) {
      console.log("addRepToOperationalEntity update error", updateEntityError);
      throw updateEntityError;
    }

    await refreshOperationalEntityData(tableName);
    return updatedEntity;
  } catch (error) {
    console.log("addRepToOperationalEntity error", error);
    throw error;
  }
};

const removeRepFromOperationalEntity = async (tableName: OperationalEntityTable, entityId: string, repId: string) => {
  try {
    const { data: entity, error: getEntityError } = await SupabaseClient.from(tableName).select("reps, rep_partner_id").eq("id", entityId).single();

    if (getEntityError) {
      console.log("removeRepFromOperationalEntity fetch error", getEntityError);
      throw getEntityError;
    }

    const existingReps = entity?.reps || [];
    if (!existingReps.length) {
      return;
    }

    const updatedReps = existingReps.filter((rep: any) => rep?.id !== repId);
    const nextRepPartnerId = entity?.rep_partner_id === repId ? null : entity?.rep_partner_id || null;

    const { data: updatedEntity, error: updateEntityError } = await SupabaseClient.from(tableName)
      .update({ reps: updatedReps, rep_partner_id: nextRepPartnerId })
      .eq("id", entityId)
      .select()
      .single();

    if (updateEntityError) {
      console.log("removeRepFromOperationalEntity update error", updateEntityError);
      throw updateEntityError;
    }

    await refreshOperationalEntityData(tableName);
    return updatedEntity;
  } catch (error) {
    console.log("removeRepFromOperationalEntity error", error);
    throw error;
  }
};
