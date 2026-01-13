import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  SignupData,
  User,
  UpdateUserData,
  UserContext,
} from "@/types/auth";
import { fetcher } from "./api-client";

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
};
