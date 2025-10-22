import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import balanceReducer from "./features/balance/balanceSlice";
import transactionReducer from "./features/transaction/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    balance: balanceReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
