import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import store from "../redux/store";
import { fetchDivisionsData, fetchChaptersData, fetchShepherdEntitiesData, fetchGovernorEntitiesData, fetchPresidentEntitiesData } from "./appData";
import SupabaseClient from "@/supabase/supabaseConnection";
import { PartnerUpdateType } from "@/supabase/modifiedSupabaseTypes";

import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

// TODO: update supabase calls to use  PostgrestSingleResponse

export const createEntity = async (label: string, data: Record<string, string>) => {
  try {
    const { name, division_id, country, base_currency, shepherd_id, governor_id, rep_partner_id } = data;

    switch (label) {
      case "Division": {
        const createdDivision = await createDivision(name);
        return createdDivision;
      }

      case "Chapter": {
        const createdChapter = await createChapter(name, division_id, country, base_currency);
        return createdChapter;
      }
      case "Shepherd": {
        return await createShepherd(name, rep_partner_id);
      }
      case "Governor": {
        return await createGovernor(name, shepherd_id, rep_partner_id);
      }
      case "President": {
        return await createPresident(name, shepherd_id, governor_id, rep_partner_id);
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
    const { id, name, division_id, country, base_currency, shepherd_id, governor_id, rep_partner_id } = data;

    switch (label) {
      case "Division": {
        const updatedDivision = await updateDivision(id, name);
        return updatedDivision;
      }

      case "Chapter": {
        const updatedChapter = await updateChapter(id, name, division_id, country, base_currency);
        return updatedChapter;
      }
      case "Shepherd": {
        return await updateShepherd(id, name, rep_partner_id);
      }
      case "Governor": {
        return await updateGovernor(id, name, shepherd_id, rep_partner_id);
      }
      case "President": {
        return await updatePresident(id, name, shepherd_id, governor_id, rep_partner_id);
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
      .single();

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
          division_id,
          country,
          base_currency,
          organisation_id,
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
        division_id,
        country,
        base_currency,
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

const resolveRepObject = async (repPartnerId: string) => {
  const { data: rep, error } = await SupabaseClient.from("partner").select("id,first_name,last_name,email,phone_number").eq("id", repPartnerId).maybeSingle();
  if (error || !rep) {
    throw error || new Error("Rep not found");
  }
  return {
    id: rep.id,
    name: `${rep.first_name || ""} ${rep.last_name || ""}`.trim(),
    email: rep.email || "",
    phone_number: rep.phone_number || "",
  };
};

const setRepOpsPermission = async (repPartnerId: string, payload: PartnerUpdateType) => {
  const { error } = await SupabaseClient.from("partner").update(payload).eq("id", repPartnerId);
  if (error) {
    throw error;
  }
};

export const createShepherd = async (name: string, rep_partner_id: string) => {
  const organisation_id = store.getState().app.organisation.id;
  const rep = await resolveRepObject(rep_partner_id);
  const { data, error } = await SupabaseClient.from("shepherd")
    .insert({ name, organisation_id, rep_partner_id, reps: [rep] } as any)
    .select()
    .single();
  if (error) throw error;
  await setRepOpsPermission(rep_partner_id, { ops_permission_type: "shepherd", shepherd_id: data.id, governor_id: null, president_id: null });
  await fetchShepherdEntitiesData();
  return data;
};

export const updateShepherd = async (id: string, name: string, rep_partner_id: string) => {
  const rep = await resolveRepObject(rep_partner_id);
  const { data, error } = await SupabaseClient.from("shepherd")
    .update({ name, rep_partner_id, reps: [rep] } as any)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await setRepOpsPermission(rep_partner_id, { ops_permission_type: "shepherd", shepherd_id: id, governor_id: null, president_id: null });
  await fetchShepherdEntitiesData();
  return data;
};

export const createGovernor = async (name: string, shepherd_id: string, rep_partner_id: string) => {
  const organisation_id = store.getState().app.organisation.id;
  const rep = await resolveRepObject(rep_partner_id);
  const { data, error } = await SupabaseClient.from("governor")
    .insert({ name, organisation_id, shepherd_id, rep_partner_id, reps: [rep] } as any)
    .select()
    .single();
  if (error) throw error;
  await setRepOpsPermission(rep_partner_id, { ops_permission_type: "governor", shepherd_id, governor_id: data.id, president_id: null });
  await fetchGovernorEntitiesData();
  return data;
};

export const updateGovernor = async (id: string, name: string, shepherd_id: string, rep_partner_id: string) => {
  const rep = await resolveRepObject(rep_partner_id);
  const { data, error } = await SupabaseClient.from("governor")
    .update({ name, shepherd_id, rep_partner_id, reps: [rep] } as any)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await SupabaseClient.from("president").update({ shepherd_id }).eq("governor_id", id);
  await SupabaseClient.from("partner").update({ shepherd_id }).eq("governor_id", id);
  await setRepOpsPermission(rep_partner_id, { ops_permission_type: "governor", shepherd_id, governor_id: id, president_id: null });
  await fetchGovernorEntitiesData();
  return data;
};

export const createPresident = async (name: string, shepherd_id: string, governor_id: string, rep_partner_id: string) => {
  const organisation_id = store.getState().app.organisation.id;
  const rep = await resolveRepObject(rep_partner_id);
  const { data, error } = await SupabaseClient.from("president")
    .insert({ name, organisation_id, shepherd_id, governor_id, rep_partner_id, reps: [rep] } as any)
    .select()
    .single();
  if (error) throw error;
  await setRepOpsPermission(rep_partner_id, { ops_permission_type: "president", shepherd_id, governor_id, president_id: data.id });
  await fetchPresidentEntitiesData();
  return data;
};

export const updatePresident = async (id: string, name: string, shepherd_id: string, governor_id: string, rep_partner_id: string) => {
  const rep = await resolveRepObject(rep_partner_id);
  const { data, error } = await SupabaseClient.from("president")
    .update({ name, shepherd_id, governor_id, rep_partner_id, reps: [rep] } as any)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await SupabaseClient.from("partner").update({ shepherd_id, governor_id }).eq("president_id", id);
  await setRepOpsPermission(rep_partner_id, { ops_permission_type: "president", shepherd_id, governor_id, president_id: id });
  await fetchPresidentEntitiesData();
  return data;
};

export const assignPartnersToOperationalHierarchy = async ({
  partnerIds,
  shepherd_id,
  governor_id,
  president_id,
}: {
  partnerIds: string[];
  shepherd_id: string;
  governor_id?: string;
  president_id?: string;
}) => {
  if (!partnerIds.length) {
    return [];
  }

  const payload: PartnerUpdateType = {
    shepherd_id,
    governor_id: governor_id || null,
    president_id: president_id || null,
  };

  const { data, error } = await SupabaseClient.from("partner").update(payload).in("id", partnerIds).select("id");
  if (error) {
    throw error;
  }
  return data || [];
};

type AssignmentFilter = {
  field: string;
  operator: string;
  value: any;
};

export const fetchFilteredPartnerIds = async (filters: AssignmentFilter[]) => {
  let query = SupabaseClient.from("partner").select("id");

  for (const filter of filters || []) {
    const field = filter.field;
    const operator = filter.operator;
    const value = filter.value;

    if (!value || value === "all") continue;

    if (operator === "Contains" && typeof value === "string") {
      query = query.ilike(field, `%${value}%`);
    } else if (operator === "Equals" && typeof value === "string") {
      query = query.eq(field === "status" ? "g20_status" : field, value);
    } else if (operator === "Not Equals" && typeof value === "string") {
      query = query.neq(field === "status" ? "g20_status" : field, value);
    } else if (operator === "Within" && value?.from && value?.to && typeof value.from === "string" && typeof value.to === "string") {
      query = query.gte(field, value.from).lte(field, value.to);
    }
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return (data || []).map((item: any) => item.id).filter(Boolean);
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
  void division_id;
  let resolvedChapterId = chapter_id;

  const existingChapter = ChapterOptions.find((c) => c.value === chapter_id || c.name.toLowerCase() === chapter_id.toLowerCase());

  if (existingChapter) {
    resolvedChapterId = existingChapter.value as string;
  } else {
    ErrorHandler("Please select an existing chapter.");
    throw new Error("Please select an existing chapter.");
  }

  return resolvedChapterId;
};
