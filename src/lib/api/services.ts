import { apiRequest } from "./config";
import {
  ApiResponse,
  Balance,
  Banner,
  Service,
  TopUpRequest,
  TransactionRequest,
  Transaction,
  TransactionHistoryParams,
} from "./types";

export const getBalance = async (): Promise<ApiResponse<Balance>> => {
  return apiRequest<ApiResponse<Balance>>("/balance", {
    method: "GET",
  });
};

export const getBanners = async (): Promise<ApiResponse<Banner[]>> => {
  return apiRequest<ApiResponse<Banner[]>>("/banner", {
    method: "GET",
  });
};

export const getServices = async (): Promise<ApiResponse<Service[]>> => {
  return apiRequest<ApiResponse<Service[]>>("/services", {
    method: "GET",
  });
};

export const topUp = async (
  data: TopUpRequest
): Promise<ApiResponse<Balance>> => {
  return apiRequest<ApiResponse<Balance>>("/topup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const createTransaction = async (
  data: TransactionRequest
): Promise<ApiResponse<Transaction>> => {
  return apiRequest<ApiResponse<Transaction>>("/transaction", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getTransactionHistory = async (
  params?: TransactionHistoryParams
): Promise<ApiResponse<{ offset: number; limit: number; records: Transaction[] }>> => {
  const queryParams = new URLSearchParams();
  if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
  return apiRequest<ApiResponse<{ offset: number; limit: number; records: Transaction[] }>>(
    `/transaction/history${queryString}`,
    {
      method: "GET",
    }
  );
};
