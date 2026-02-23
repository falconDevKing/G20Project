import { fetchUserPayment, fetchEntityPayment } from "@/services/payment";
import store from "./store";
import { ActionReducerMapBuilder, createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { PartnerRowType, PaymentRowType } from "@/supabase/modifiedSupabaseTypes";

interface PaymentState {
  userPayments: PaymentRowType[];
  adminPayments: PaymentRowType[];
  loading: boolean;
  adminLoading: boolean;
}

const initialState: PaymentState = {
  userPayments: [],
  adminPayments: [],
  loading: false,
  adminLoading: false,
};

export const getUserPayments = createAsyncThunk("payment/getUserPayments", async () => {
  try {
    const user_id = store.getState().auth.userDetails.id || "";
    const userPayments = await fetchUserPayment(user_id);
    return userPayments;
  } catch (err: any) {
    console.log("error", err);
    throw err;
    // ErrorHandler({ message: err });
  }
});

export const getAdminPayments = createAsyncThunk("payment/getAdminPayments", async () => {
  try {
    const userDetails = store.getState().auth.userDetails;

    const adminLevel = userDetails.permission_type || "";
    const entityKey = (adminLevel.toLowerCase() + "_id") as keyof Partial<PartnerRowType>;
    const entityId = userDetails[entityKey] as string;

    const adminPayments = await fetchEntityPayment(adminLevel, entityId);
    return adminPayments;
  } catch (err: any) {
    console.log("error", err);
    throw err;
    // ErrorHandler({ message: err });
  }
});

// Then, handle actions in your reducers:
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setUserPaymentsLoading: (
      state: PaymentState,
      action: PayloadAction<{
        data: boolean;
      }>,
    ) => {
      state.loading = action.payload.data;
    },
    setUserPayments: (
      state: PaymentState,
      action: PayloadAction<{
        userPayments: PaymentRowType[];
      }>,
    ) => {
      state.userPayments = action.payload.userPayments;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<PaymentState>) => {
    builder.addCase(getUserPayments.pending, (state: PaymentState) => {
      state.loading = true;
    });
    builder.addCase(getUserPayments.rejected, (state: PaymentState) => {
      state.loading = false;
    });
    builder.addCase(getUserPayments.fulfilled, (state: PaymentState, action) => {
      state.loading = false;
      state.userPayments = action.payload || [];
    });
    builder.addCase(getAdminPayments.pending, (state: PaymentState) => {
      state.adminLoading = true;
    });
    builder.addCase(getAdminPayments.rejected, (state: PaymentState) => {
      state.adminLoading = false;
    });
    builder.addCase(getAdminPayments.fulfilled, (state: PaymentState, action) => {
      state.adminLoading = false;
      state.adminPayments = action.payload || [];
    });
  },
});

export const { setUserPaymentsLoading, setUserPayments } = paymentSlice.actions;

export default paymentSlice.reducer;
