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

// NextAuth callback - create/update OAuth user in backend
export const nextAuthCallback = async (
  email: string,
  name?: string,
  image?: string,
  provider: string = "github",
  provider_id?: string,
  username?: string
): Promise<UserResponse> => {
  // Build query parameters
  const params = new URLSearchParams();
  params.append("email", email);
  if (name) params.append("name", name);
  if (image) params.append("image", image);
  params.append("provider", provider);
  if (provider_id) params.append("provider_id", provider_id);
  if (username) params.append("username", username);

  return apiClient.post<UserResponse>(
    `/auth/nextauth-callback?${params.toString()}`
  );
};
