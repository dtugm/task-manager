import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  SignupData,
  User,
  UpdateUserData,
  UserContext,
} from "@/types/auth";

// ... imports

const BASE_URL = "https://internal-service-production.up.railway.app/api/v1";

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (process.env.NEXT_PUBLIC_REGISTER_APIKEY) {
    headers["x-api-key"] = process.env.NEXT_PUBLIC_REGISTER_APIKEY;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error?.message || "An error occurred");
  }

  return data;
}

export const authApi = {
  signIn: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    return fetcher<ApiResponse<AuthResponse>>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  signUp: async (data: SignupData): Promise<ApiResponse<AuthResponse>> => {
    return fetcher<ApiResponse<AuthResponse>>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMe: async (token: string): Promise<ApiResponse<UserContext>> => {
    return fetcher<ApiResponse<UserContext>>("/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  validateToken: async (token: string): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>("/auth/validate", {
      method: "POST",
      body: JSON.stringify({ accessToken: token }),
    });
  },

  updateUser: async (
    token: string,
    id: string,
    data: UpdateUserData
  ): Promise<ApiResponse<User>> => {
    return fetcher<ApiResponse<User>>(`/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  getOrganizationUsers: async (
    token: string,
    organizationId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(
      `/organizations/${organizationId}/users?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getCurrentUser: async (token: string): Promise<ApiResponse<User>> => {
    return fetcher<ApiResponse<User>>("/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<ApiResponse<AuthResponse>> => {
    return fetcher<ApiResponse<AuthResponse>>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};
