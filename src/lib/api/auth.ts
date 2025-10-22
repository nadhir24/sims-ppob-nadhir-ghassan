import { apiRequest, setAuthToken, removeAuthToken, getAuthToken, API_BASE_URL } from "./config";
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "./types";

export const register = async (
  data: RegisterRequest
): Promise<ApiResponse<null>> => {
  return apiRequest<ApiResponse<null>>("/registration", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiRequest<ApiResponse<LoginResponse>>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (response.data?.token) {
    setAuthToken(response.data.token);
  }

  return response;
};

export const logout = (): void => {
  removeAuthToken();
};

export const getProfile = async (): Promise<ApiResponse<User>> => {
  return apiRequest<ApiResponse<User>>("/profile", {
    method: "GET",
  });
};

export const updateProfile = async (
  data: Partial<User>
): Promise<ApiResponse<User>> => {
  return apiRequest<ApiResponse<User>>("/profile/update", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updateProfileImage = async (
  file: File
): Promise<ApiResponse<User>> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/profile/image`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload image");
  }

  return data;
};
