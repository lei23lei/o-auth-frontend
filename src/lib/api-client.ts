import { getTokenFromStorage } from "@/services/auth";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getTokenFromStorage();

    // Debug logging
    console.log("API Request Debug:", {
      endpoint,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
      baseURL: this.baseURL,
    });

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    console.log("Request headers:", config.headers);

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      // Handle token expiration (401 Unauthorized)
      if (response.status === 401 && token) {
        console.warn("Token expired or invalid, removing from storage");
        // You could add a token refresh logic here or redirect to login
        // For now, just log the issue
      }

      const errorData = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      const error = new Error(errorData.message || "Request failed");
      (error as any).response = { data: errorData, status: response.status };
      throw error;
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
