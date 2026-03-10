import { ActionReducerMapBuilder, createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { fetchBasicData } from "@/services/appData";
import store from "./store";
import { fetchAdminData } from "@/services/auth";
import { DivisionRowType, ChapterRowType, PartnerRowType, OrganisationRowType, HoSRowType, GovernorRowType, PresidentRowType } from "@/supabase/modifiedSupabaseTypes";
import { DummyObject } from "@/interfaces/tools";
import { getUser } from "@/services/payment";

const guestUserId = import.meta.env.VITE_APP_GUEST_USER_ID || "";

interface AppState {
  organisation: OrganisationRowType | DummyObject;
  divisions: DivisionRowType[];
  chapters: ChapterRowType[];
  adminDivisions: DivisionRowType[];
  adminChapters: ChapterRowType[];
  hosEntities: HoSRowType[];
  governorEntities: GovernorRowType[];
  presidentEntities: PresidentRowType[];
  adminHosEntities: HoSRowType[];
  adminGovernorEntities: GovernorRowType[];
  adminPresidentEntities: PresidentRowType[];
  users: PartnerRowType[];
  locationCurrency: string;
  fallbackCurrency: string;
  loading: boolean;
  usersLoading: boolean;
  guestUser: PartnerRowType | DummyObject;
  showPayment: boolean;
}

const initialState: AppState = {
  organisation: {},
  divisions: [],
  chapters: [],
  users: [],
  adminDivisions: [],
  adminChapters: [],
  hosEntities: [],
  governorEntities: [],
  presidentEntities: [],
  adminHosEntities: [],
  adminGovernorEntities: [],
  adminPresidentEntities: [],
  locationCurrency: "GBP",
  fallbackCurrency: "USD",
  loading: false,
  usersLoading: false,
  guestUser: {},
  showPayment: false,
};

export const fetchAppBasicData = createAsyncThunk("app/fetchBasicData", async () => {
  try {
    const basicData = await fetchBasicData();
    const guestUser = await getUser(guestUserId); // TODO :  ENV VAR
    const { user_id, userDetails } = store.getState().auth;

    if (user_id) {
      fetchAdminData(userDetails);
    }
    return { basicData, guestUser };
  } catch (err) {
    console.log("error", err);
    throw err;
  }
});

// Then, handle actions in your reducers:
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAuthLoading: (
      state: AppState,
      action: PayloadAction<{
        data: boolean;
      }>,
    ) => {
      state.loading = action.payload.data;
    },
    setUsersLoading: (
      state: AppState,
      action: PayloadAction<{
        data: boolean;
      }>,
    ) => {
      state.usersLoading = action.payload.data;
    },
    setOrganisation: (
      state: AppState,
      action: PayloadAction<{
        data: OrganisationRowType;
      }>,
    ) => {
      state.organisation = action.payload.data;
    },
    setDivisions: (
      state: AppState,
      action: PayloadAction<{
        data: DivisionRowType[];
      }>,
    ) => {
      state.divisions = action.payload.data;
    },
    setChapters: (
      state: AppState,
      action: PayloadAction<{
        data: ChapterRowType[];
      }>,
    ) => {
      state.chapters = action.payload.data;
    },
    setAdminEntities: (
      state: AppState,
      action: PayloadAction<{
        data: {
          adminDivisions: DivisionRowType[];
          adminChapters: ChapterRowType[];
          adminHosEntities: HoSRowType[];
          adminGovernorEntities: GovernorRowType[];
          adminPresidentEntities: PresidentRowType[];
        };
      }>,
    ) => {
      state.adminDivisions = action.payload.data.adminDivisions;
      state.adminChapters = action.payload.data.adminChapters;
      state.adminHosEntities = action.payload.data.adminHosEntities;
      state.adminGovernorEntities = action.payload.data.adminGovernorEntities;
      state.adminPresidentEntities = action.payload.data.adminPresidentEntities;
    },
    setOperationalEntities: (
      state: AppState,
      action: PayloadAction<{
        data: {
          hosEntities: HoSRowType[];
          governorEntities: GovernorRowType[];
          presidentEntities: PresidentRowType[];
        };
      }>,
    ) => {
      state.hosEntities = action.payload.data.hosEntities;
      state.governorEntities = action.payload.data.governorEntities;
      state.presidentEntities = action.payload.data.presidentEntities;
    },
    setUsers: (
      state: AppState,
      action: PayloadAction<{
        data: PartnerRowType[];
      }>,
    ) => {
      state.users = action.payload.data;
      state.usersLoading = false;
    },
    setLocationCurrency: (
      state: AppState,
      action: PayloadAction<{
        data: { locationCurrency: string; fallbackCurrency: string };
      }>,
    ) => {
      state.locationCurrency = action.payload.data.locationCurrency;
      state.fallbackCurrency = action.payload.data.fallbackCurrency;
    },
    setOpenPayment: (
      state: AppState,
      action: PayloadAction<{
        data: { showPayment: boolean };
      }>,
    ) => {
      state.showPayment = action.payload.data.showPayment;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AppState>) => {
    builder.addCase(fetchAppBasicData.pending, (state: AppState) => {
      state.loading = true;
    });
    builder.addCase(fetchAppBasicData.rejected, (state: AppState) => {
      state.loading = false;
    });
    builder.addCase(fetchAppBasicData.fulfilled, (state: AppState, action) => {
      const { Organisation, Divisions, Chapters } = action.payload.basicData;
      const { HoSEntities, GovernorEntities, PresidentEntities } = action.payload.basicData;
      const guestUser = action.payload.guestUser;

      state.loading = false;
      state.organisation = Organisation;
      state.divisions = Divisions;
      state.chapters = Chapters;
      state.hosEntities = HoSEntities;
      state.governorEntities = GovernorEntities;
      state.presidentEntities = PresidentEntities;
      state.guestUser = guestUser;
    });
  },
});

export const {
  setAuthLoading,
  setOrganisation,
  setDivisions,
  setChapters,
  setUsers,
  setAdminEntities,
  setOperationalEntities,
  setUsersLoading,
  setLocationCurrency,
  setOpenPayment,
} =
  appSlice.actions;

export default appSlice.reducer;
