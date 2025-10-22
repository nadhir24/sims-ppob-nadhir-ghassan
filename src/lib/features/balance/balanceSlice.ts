import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as servicesApi from "../../api/services";
import { Balance, Banner, Service } from "../../api/types";

export interface BalanceState {
  balance: number;
  banners: Banner[];
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BalanceState = {
  balance: 0,
  banners: [],
  services: [],
  isLoading: false,
  error: null,
};

export const fetchBalanceAsync = createAsyncThunk(
  "balance/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getBalance();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch balance");
    }
  }
);

export const fetchBannersAsync = createAsyncThunk(
  "balance/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getBanners();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch banners");
    }
  }
);

export const fetchServicesAsync = createAsyncThunk(
  "balance/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getServices();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch services");
    }
  }
);

export const topUpAsync = createAsyncThunk(
  "balance/topUp",
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await servicesApi.topUp({ top_up_amount: amount });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Top up failed");
    }
  }
);

export const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBalanceAsync.fulfilled, (state, action: PayloadAction<Balance>) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.error = null;
      })
      .addCase(fetchBalanceAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBannersAsync.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.banners = action.payload;
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.services = action.payload;
      })
      .addCase(topUpAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(topUpAsync.fulfilled, (state, action: PayloadAction<Balance>) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.error = null;
      })
      .addCase(topUpAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = balanceSlice.actions;
export default balanceSlice.reducer;
