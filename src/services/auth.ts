import SupabaseClient from "@/supabase/supabaseConnection";
import type {
  ChapterRowType,
  DivisionRowType,
  PartnerInsertType,
  PartnerRowType,
  PartnerUpdateType,
  ShepherdRowType,
  GovernorRowType,
  PresidentRowType,
} from "@/supabase/modifiedSupabaseTypes";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { generateUniqueCode } from "@/lib/utils";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { setAuthData, setLogOut, setAuthenticated, setUserDetails } from "@/redux/authSlice";
import store from "@/redux/store";
import { setAdminEntities } from "@/redux/appSlice";
import { DummyObject } from "@/interfaces/tools";
import { isEmail, isPartnerCode } from "@/lib/schemas";

// TODO: update supabase calls to use  PostgrestSingleResponse

export const createUser = async (userData: PartnerInsertType): Promise<PartnerRowType> => {
  try {
    const payload: PartnerInsertType = {
      g20_status: "passive",
      ...userData,
    };

    const { data, error }: PostgrestSingleResponse<PartnerRowType[]> = await SupabaseClient.from("partner").insert([payload]).select(); // Return the inserted row(s)

    if (error) {
      console.log("Supabase insert error", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("User creation failed: No data returned.");
    }

    return data[0];
  } catch (error) {
    console.log("Runtime error", error);
    throw error;
  }
};

export const createUniqueCode = async ({ first_name, last_name }: { first_name: string; last_name: string }): Promise<string> => {
  try {
    let count = 0;

    if (first_name && last_name) {
      const unique_codeCreator = async (): Promise<string> => {
        count++;
        const unique_code = generateUniqueCode({ first_name, last_name });

        const { data, error } = await SupabaseClient.from("partner")
          .select("id") // just check if it exists
          .eq("unique_code", unique_code)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          console.log("Error checking unique code:", error);
          throw error;
        }

        if (count < 20) {
          if (data) {
            // Duplicate found, try again
            return unique_codeCreator();
          } else {
            return unique_code;
          }
        } else {
          throw new Error("Failed to generate a unique code after multiple attempts.");
        }
      };

      const unique_code = await unique_codeCreator();
      return unique_code;
    }

    throw new Error("First name and last name are required.");
  } catch (error) {
    console.log("createUniqueCode failed", error);
    throw error;
  }
};

export const verifyUser = async (email: string): Promise<PartnerRowType | null> => {
  try {
    // 1. Find user by email
    const { data: usersWithEmail, error: listUserError } = await SupabaseClient.from("partner") // adjust to actual table name if it's not 'users'
      .select("*")
      .ilike("email", email)
      .limit(1)
      .maybeSingle();

    if (listUserError || !usersWithEmail) {
      console.log("User lookup error", listUserError);
      throw listUserError || new Error("No user found");
    }

    const user_id = usersWithEmail.id;

    // 2. Update user to set verified: true
    const { data: updatedUser, error: verifyUserError } = await SupabaseClient.from("partner").update({ verified: true }).eq("id", user_id).select().single();

    if (verifyUserError) {
      console.log("Verify user error", verifyUserError);
      throw verifyUserError;
    }

    return updatedUser;
  } catch (error) {
    console.log("verifyUser Supabase error:", error);
    throw error;
  }
};

export const vetUser = async (email: string): Promise<boolean> => {
  try {
    const { data: user, error } = await SupabaseClient.from("partner") // replace with your actual table name if different
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (error) {
      console.log("Supabase query error", error);
      return false;
    }

    return !!user;
  } catch (error) {
    console.log("vetUser error", error);
    return false;
  }
};

export const updateUser = async (userData: PartnerUpdateType) => {
  try {
    if (!userData.id) return false;

    const { data: updatedUser, error }: PostgrestSingleResponse<PartnerRowType> = await SupabaseClient.from("partner") // change to your actual table name if needed
      .update(userData)
      .eq("id", userData.id)
      .select()
      .single();

    if (error) {
      console.log("update user error", error);
      throw error;
    }

    console.log("updatedUser", updatedUser);

    if (updatedUser) {
      store.dispatch(setUserDetails({ userDetails: updatedUser }));
      fetchAdminData(updatedUser);
    }

    return updatedUser;
  } catch (error) {
    console.log("updateUser supabase error", error);
    throw error;
  }
};

export const logInuser = async (email: string, password: string): Promise<PartnerRowType | null> => {
  try {
    const { nextStep } = await signIn({
      username: email,
      password: password,
    });

    if (nextStep.signInStep === "DONE") {
      const loggedIn = await getLoggedInUser(email);

      return loggedIn;
    }
    return null;
  } catch (error) {
    console.log("auth login error", error);
    throw error;
  }
};

const fetchPartnerByIdentity = async ({ cognito_user_id, email }: { cognito_user_id?: string; email?: string }): Promise<PartnerRowType | null> => {
  if (cognito_user_id) {
    const { data, error } = await SupabaseClient.from("partner").select("*").eq("cognito_user_id", cognito_user_id).maybeSingle();
    if (!error && data) {
      return data;
    }
  }

  if (email) {
    const { data, error } = await SupabaseClient.from("partner").select("*").ilike("email", email).maybeSingle();
    if (!error && data) {
      return data;
    }
  }

  return null;
};

export const getLoggedInUser = async (email?: string) => {
  try {
    const { username: user_name, userId: cognito_user_id, signInDetails } = await getCurrentUser();

    store.dispatch(setAuthData({ user_name, cognito_user_id, signInDetails, authenticated: true }));

    const userDetails = await fetchPartnerByIdentity({ cognito_user_id, email: email || user_name });

    if (userDetails) {
      store.dispatch(setUserDetails({ userDetails }));
      fetchAdminData(userDetails);
      return userDetails;
    }

    return null;
  } catch (error) {
    console.log("auth check error", error);
    store.dispatch(setAuthenticated({ authenticated: false }));
    return null;
  }
};

export const refreshLoggedInUser = async (id: string) => {
  try {
    if (!id) return;

    const { data: user, error } = await SupabaseClient.from("partner").select("*").eq("id", id).maybeSingle();

    if (error) {
      console.log("refreshLoggedInUser error", error);
      return;
    }

    console.log("refreshLoggedInUser", user);

    if (user) {
      store.dispatch(setUserDetails({ userDetails: user }));
      fetchAdminData(user);
    }
  } catch (error) {
    console.log("refreshLoggedInUser unexpected error", error);
  }
};

export const logOutUser = async () => {
  try {
    await signOut({ global: true });
    await signOut();
    store.dispatch(setLogOut());

    return true;
  } catch (error) {
    console.log("auth check error", error);
    store.dispatch(setLogOut());
    return false;
  }
};

export const fetchAdminData = (user: PartnerRowType | DummyObject) => {
  const appState = store.getState().app;
  const { divisions, chapters } = appState;

  const accessibleData = filterDataBasedOnPermission(user, divisions, chapters);

  store.dispatch(setAdminEntities({ data: accessibleData }));
};

const filterDataBasedOnPermission = (user: PartnerRowType | DummyObject, divisions: DivisionRowType[], chapters: ChapterRowType[]) => {
  let filteredDivisions = divisions;

  let filteredChapters = chapters;
  const shepherdEntities = store.getState().app.shepherdEntities || ([] as ShepherdRowType[]);
  const governorEntities = store.getState().app.governorEntities || ([] as GovernorRowType[]);
  const presidentEntities = store.getState().app.presidentEntities || ([] as PresidentRowType[]);
  let filteredShepherds = shepherdEntities;
  let filteredGovernors = governorEntities;
  let filteredPresidents = presidentEntities;

  const opsPermission = (user.ops_permission_type || "").toLowerCase();

  switch (user.permission_type) {
    case "organisation":
      // Access to everything
      break;
    case "division":
      filteredDivisions = divisions.filter((d) => d.id === user.division_id);

      filteredChapters = chapters.filter((c) => c.division_id === user.division_id);
      break;
    default:
      filteredDivisions = divisions.filter((d) => d.id === user.division_id);

      filteredChapters = chapters.filter((c) => c.id === user.chapter_id);
      break;
  }

  if (opsPermission === "shepherd") {
    filteredShepherds = shepherdEntities.filter((h) => h.id === user.shepherd_id);
    filteredGovernors = governorEntities.filter((g) => g.shepherd_id === user.shepherd_id);
    filteredPresidents = presidentEntities.filter((p) => p.shepherd_id === user.shepherd_id);
  } else if (opsPermission === "governor") {
    filteredGovernors = governorEntities.filter((g) => g.id === user.governor_id);
    const governor = filteredGovernors[0];
    filteredShepherds = governor ? shepherdEntities.filter((h) => h.id === governor.shepherd_id) : [];
    filteredPresidents = presidentEntities.filter((p) => p.governor_id === user.governor_id);
  } else if (opsPermission === "president") {
    filteredPresidents = presidentEntities.filter((p) => p.id === user.president_id);
    const president = filteredPresidents[0];
    filteredGovernors = president ? governorEntities.filter((g) => g.id === president.governor_id) : [];
    filteredShepherds = president ? shepherdEntities.filter((h) => h.id === president.shepherd_id) : [];
  }

  return {
    adminDivisions: filteredDivisions,
    adminChapters: filteredChapters,
    adminShepherdEntities: filteredShepherds,
    adminGovernorEntities: filteredGovernors,
    adminPresidentEntities: filteredPresidents,
  };
};

export const resolveEmailFromIdentifier = async (identifier: string): Promise<string> => {
  const trimmed = identifier.trim();

  // If it is already an email, return as-is
  if (isEmail(trimmed)) {
    return trimmed;
  }

  const normaliseCode = (c: string) => c.toUpperCase();
  const code = normaliseCode(trimmed);
  // If it is a partner code, look up the email
  if (isPartnerCode(code)) {
    const { data, error } = await SupabaseClient.from("partner").select("email").eq("unique_code", code).maybeSingle();

    if (error) {
      throw new Error(`Unable to find user. Please try again.`);
    }
    if (!data?.email) {
      throw new Error(`No account found for partner code ${code}.`);
    }

    return String(data.email);
  }

  // Should not happen if you validate with loginSchema first
  throw new Error("Invalid identifier. Enter a valid email or partner code.");
};

export const resolvePostAuthRoute = (user: PartnerRowType | DummyObject | null): string => {
  if (!user || !user.id) {
    return "/login";
  }

  if (!user.g20_active) {
    return "/update";
  }

  if (!user.proposed_payment_scheduled) {
    return "/proposed-schedule";
  }

  return "/dashboard";
};
