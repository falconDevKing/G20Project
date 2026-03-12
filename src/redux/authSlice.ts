import { DummyObject } from "@/interfaces/tools";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import {
  // ActionReducerMapBuilder, createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface AuthState {
  user_name: string;
  cognito_user_id: string;
  loading: boolean;
  authenticated: boolean;
  signInDetails: PartnerRowType | DummyObject | undefined;
  userDetails: PartnerRowType | DummyObject;
  user_id: string;
}

const initialState: AuthState = {
  user_name: "",
  user_id: "",
  cognito_user_id: "",
  signInDetails: {},
  loading: false,
  authenticated: false,
  userDetails: {},
};

// Then, handle actions in your reducers:
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (
      state: AuthState,
      action: PayloadAction<{
        data: boolean;
      }>,
    ) => {
      state.loading = action.payload.data;
    },
    setUserDetails: (
      state: AuthState,
      action: PayloadAction<{
        userDetails: any;
      }>,
    ) => {
      state.userDetails = action.payload.userDetails;
      state.user_id = action.payload.userDetails.id;
    },
    setAuthData: (
      state: AuthState,
      action: PayloadAction<{
        cognito_user_id: string;
        user_name: string;
        authenticated: boolean;
        signInDetails: any;
        // Record<string, string>;
      }>,
    ) => {
      state.loading = false;
      state.cognito_user_id = action.payload.cognito_user_id;
      state.user_name = action.payload.user_name;
      state.authenticated = action.payload.authenticated;
      state.signInDetails = action.payload.signInDetails;
    },
    setLogOut: (state: AuthState) => {
      state.loading = false;
      state.cognito_user_id = "";
      state.user_id = "";
      state.user_name = "";
      state.authenticated = false;
      state.signInDetails = {};
      state.userDetails = {};
    },
    setAuthenticated: (
      state: AuthState,
      action: PayloadAction<{
        authenticated: boolean;
      }>,
    ) => {
      state.authenticated = action.payload.authenticated;
    },
  },
  // extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
  //   builder.addCase(getLoggedInUser.pending, (state: AuthState) => {
  //     state.loading = true;
  //   });
  // },
});

export const { setAuthLoading, setAuthData, setAuthenticated, setUserDetails, setLogOut } = authSlice.actions;

export default authSlice.reducer;
