import { apiClient } from "@/lib/api-client";

export const register = async (
  email: string,
  password: string
): Promise<RegisterResponse> => {
  return apiClient.post<RegisterResponse>("/user", { email, password });
};
