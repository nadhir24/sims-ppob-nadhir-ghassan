export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export interface Balance {
  balance: number;
}

export interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

export interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

export interface TopUpRequest {
  top_up_amount: number;
}

export interface TransactionRequest {
  service_code: string;
}

export interface Transaction {
  invoice_number: string;
  service_code: string;
  service_name: string;
  transaction_type: string;
  total_amount: number;
  created_on: string;
}

export interface TransactionHistoryParams {
  offset?: number;
  limit?: number;
}
