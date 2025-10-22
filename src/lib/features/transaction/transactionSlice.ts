import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactionHistory } from "@/lib/api/services";
import { Transaction } from "@/lib/api/types";

interface TransactionState {
  allTransactions: Transaction[];
  displayedTransactions: Transaction[];
  currentPage: number;
  limit: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  allTransactions: [],
  displayedTransactions: [],
  currentPage: 0,
  limit: 5,
  hasMore: true,
  isLoading: false,
  error: null,
};

export const fetchTransactionHistoryAsync = createAsyncThunk(
  "transaction/fetchHistory",
  async () => {
    const response = await getTransactionHistory({});
    return response.data;
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    resetTransactions: (state) => {
      state.allTransactions = [];
      state.displayedTransactions = [];
      state.currentPage = 0;
      state.hasMore = true;
      state.error = null;
    },
    showMoreTransactions: (state) => {
      const nextPage = state.currentPage + 1;
      const startIndex = 0;
      const endIndex = (nextPage + 1) * state.limit;
      state.displayedTransactions = state.allTransactions.slice(startIndex, endIndex);
      state.currentPage = nextPage;
      state.hasMore = endIndex < state.allTransactions.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionHistoryAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistoryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTransactions = action.payload.records;
        state.displayedTransactions = action.payload.records.slice(0, state.limit);
        state.currentPage = 0;
        state.hasMore = action.payload.records.length > state.limit;
      })
      .addCase(fetchTransactionHistoryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      });
  },
});

export const { resetTransactions, showMoreTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
