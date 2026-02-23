import store from "../redux/store";
import { setDivisions, setChapters, setUsers, setOrganisation, setUsersLoading, setLocationCurrency } from "@/redux/appSlice";
import SupabaseClient from "../supabase/supabaseConnection";
import { ChapterRowType, DivisionRowType, OrganisationRowType, PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const fetchBasicData = async () => {
  try {
    const Organisation = await fetchOrganisationData();
    const Divisions = await fetchDivisionsData();
    const Chapters = await fetchChaptersData();

    const { locationCurrency, fallbackCurrency } = await getCurrencyCode();
    store.dispatch(setLocationCurrency({ data: { locationCurrency, fallbackCurrency } }));

    return {
      Organisation,
      Divisions,
      Chapters,
    };
  } catch (error) {
    console.log("fetching error", error);
    throw error;
  }
};

export const fetchOrganisationData = async () => {
  try {
    const Organisations: OrganisationRowType[] = [];
    const pageSize = 1000;

    const fetchPage = async (from: number, to: number): Promise<void> => {
      const { data, error }: PostgrestSingleResponse<OrganisationRowType[]> = await SupabaseClient.from("organisation").select("*").range(from, to);

      if (error) {
        console.log("organisationError", error);
        throw error;
      }

      if (!data || data.length === 0) return;

      Organisations.push(...data);

      if (data.length === pageSize) {
        // More records likely exist — fetch next page recursively
        await fetchPage(to + 1, to + pageSize);
      }
    };

    await fetchPage(0, pageSize - 1);

    if (Organisations.length) {
      store.dispatch(setOrganisation({ data: Organisations[0] }));
    }

    return Organisations[0] || null;
  } catch (error) {
    console.log("fetching Organisations error", error);
    throw error;
  }
};

export const fetchDivisionsData = async () => {
  try {
    const Divisions: DivisionRowType[] = [];
    const pageSize = 1000;

    const fetchPage = async (from: number, to: number): Promise<void> => {
      const { data, error }: PostgrestSingleResponse<DivisionRowType[]> = await SupabaseClient.from("division").select("*").range(from, to);

      if (error) {
        console.log("divisionsError", error);
        throw error;
      }

      if (!data || data.length === 0) return;

      Divisions.push(...data);

      if (data.length === pageSize) {
        await fetchPage(to + 1, to + pageSize);
      }
    };

    await fetchPage(0, pageSize - 1);

    store.dispatch(setDivisions({ data: Divisions }));

    return Divisions;
  } catch (error) {
    console.log("fetching divisions error", error);
    throw error;
  }
};

export const fetchChaptersData = async () => {
  try {
    const Chapters: ChapterRowType[] = [];
    const pageSize = 1000;

    const fetchPage = async (from: number, to: number): Promise<void> => {
      const { data, error }: PostgrestSingleResponse<ChapterRowType[]> = await SupabaseClient.from("chapter").select("*").range(from, to);

      if (error) {
        console.log("chaptersError", error);
        throw error;
      }

      if (!data || data.length === 0) return;

      Chapters.push(...data);

      if (data.length === pageSize) {
        await fetchPage(to + 1, to + pageSize);
      }
    };

    await fetchPage(0, pageSize - 1);

    store.dispatch(setChapters({ data: Chapters }));

    return Chapters;
  } catch (error) {
    console.log("fetching Chapters error", error);
    throw error;
  }
};

export const fetchUsersByOrganisation = async (organisation_id: string) => {
  try {
    const OrganisationUsers: PartnerRowType[] = [];
    const pageSize = 1000;

    const fetchPage = async (from: number, to: number): Promise<void> => {
      let query = SupabaseClient.from("partner").select("*").range(from, to).order("created_at", { ascending: false }); // or choose another sorting field

      if (organisation_id) {
        query = query.eq("organisation_id", organisation_id);
      }

      const { data, error }: PostgrestSingleResponse<PartnerRowType[]> = await query;

      if (error) {
        console.log("organisationUsersError", error);
        throw error;
      }

      if (!data || data.length === 0) return;

      OrganisationUsers.push(...data);

      if (data.length === pageSize) {
        await fetchPage(to + 1, to + pageSize);
      }
    };

    await fetchPage(0, pageSize - 1);
    store.dispatch(setUsers({ data: OrganisationUsers }));

    return OrganisationUsers;
  } catch (error) {
    console.log("fetching Organisation Users error", error);
    throw error;
  }
};

export const fetchUsersByDivision = async (division_id: string) => {
  try {
    const DivisionUsers: PartnerRowType[] = [];
    const pageSize = 1000;

    if (!division_id) {
      return DivisionUsers; // empty array if no division_id
    }

    const fetchPage = async (from: number, to: number): Promise<void> => {
      const { data, error }: PostgrestSingleResponse<PartnerRowType[]> = await SupabaseClient.from("partner")
        .select("*")
        .eq("division_id", division_id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.log("divisionUsersError", error);
        throw error;
      }

      if (!data || data.length === 0) return;

      DivisionUsers.push(...data);

      if (data.length === pageSize) {
        await fetchPage(to + 1, to + pageSize);
      }
    };

    await fetchPage(0, pageSize - 1);

    store.dispatch(setUsers({ data: DivisionUsers }));

    return DivisionUsers;
  } catch (error) {
    console.log("fetching Division Users error", error);
    throw error;
  }
};

export const fetchUsersByChapter = async (chapter_id: string) => {
  try {
    const ChapterUsers: PartnerRowType[] = [];
    const pageSize = 1000;

    if (!chapter_id) {
      return ChapterUsers; // return empty array if no chapter_id
    }

    const fetchPage = async (from: number, to: number): Promise<void> => {
      const { data, error }: PostgrestSingleResponse<PartnerRowType[]> = await SupabaseClient.from("partner")
        .select("*")
        .eq("chapter_id", chapter_id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.log("chapterUsersError", error);
        throw error;
      }

      if (!data || data.length === 0) return;

      ChapterUsers.push(...data);

      if (data.length === pageSize) {
        await fetchPage(to + 1, to + pageSize);
      }
    };

    await fetchPage(0, pageSize - 1);
    store.dispatch(setUsers({ data: ChapterUsers }));

    return ChapterUsers;
  } catch (error) {
    console.log("fetching Chapter Users error", error);
    throw error;
  }
};

export const fetchUsersByEntity = async () => {
  try {
    store.dispatch(setUsersLoading({ data: true }));
    const userDetails = store.getState().auth.userDetails;

    const adminLevel = userDetails.permission_type || "";
    const entityKey = (adminLevel.toLowerCase() + "Id") as keyof Partial<PartnerRowType>;
    const entityId = userDetails[entityKey] as string;

    switch (adminLevel) {
      case "organisation": {
        const organisationUsers = await fetchUsersByOrganisation(entityId);
        return organisationUsers;
      }

      case "division": {
        const divisionUsers = await fetchUsersByDivision(entityId);
        return divisionUsers;
      }

      case "chapter": {
        const chapterUsers = await fetchUsersByChapter(entityId);
        return chapterUsers;
      }

      case "individual": {
        store.dispatch(setUsers({ data: [] }));
        return [];
      }

      default:
        throw new Error("No matched entity case");
    }
  } catch (error) {
    console.log("fetching entity users error", error);
    throw error;
  }
};

export const getStoreAppState = async () => {
  const appState = store.getState().app;

  return appState;
};

// src/lib/getCurrency.ts
export const getCurrencyCode = async (): Promise<{ locationCurrency: string; isEurope: boolean; isAfrica: boolean; fallbackCurrency: string }> => {
  try {
    // Free IP geolocation API (ipapi.co has a generous free tier)
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("IP lookup failed");
    const data = await res.json();

    // ipapi already returns "currency": "GBP", "USD", etc.
    if (data.currency && data.currency.length === 3) {
      const locationCurrency = data.currency.toUpperCase();
      const isEurope = !!data.in_eu;
      const isAfrica = data.continent_code === "AF";
      return {
        locationCurrency: locationCurrency === "GHA" ? "GHS" : locationCurrency,
        isEurope,
        isAfrica,
        fallbackCurrency: isEurope ? "EUR" : isAfrica ? "USDAF" : "USD",
      };
    }
  } catch (err) {
    console.warn("IP lookup failed, falling back:", err);
  }
  return { locationCurrency: "USD", isEurope: false, isAfrica: false, fallbackCurrency: "USD" }; // default
};
