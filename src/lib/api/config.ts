import Cookies from "js-cookie";

export const API_BASE_URL = "https://take-home-test-api.nutech-integrasi.com";

export const getAuthToken = (): string | undefined => {
  return Cookies.get("authToken");
};

export const setAuthToken = (token: string): void => {
  Cookies.set("authToken", token, { expires: 7 }); // 7 days
};

export const removeAuthToken = (): void => {
  Cookies.remove("authToken");
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};
