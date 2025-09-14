import { apiClient } from "@/lib/api-client";

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>("/auth/login", { email, password });
};

export const saveTokenToStorage = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

export const getTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("access_token");
};

export const removeTokenFromStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  return apiClient.get<UserResponse>("/auth/me");
};

export const forgotPassword = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  return apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", {
    email,
  });
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<ResetPasswordResponse> => {
  return apiClient.post<ResetPasswordResponse>("/auth/reset-password", {
    token,
    new_password: password,
  });
};
