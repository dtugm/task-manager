import {
  ApiResponse,
  PathAccess,
  PathAccessPayload,
  GroupedPathAccess,
} from "@/types/path-access";

const BASE_URL = "https://internal-service-production.up.railway.app/api/v1";

async function fetcher<T>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

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

export const pathAccessApi = {
  getAll: async (token: string): Promise<ApiResponse<PathAccess[]>> => {
    return fetcher<ApiResponse<PathAccess[]>>("/path-access", token, {
      method: "GET",
    });
  },

  getGrouped: async (
    token: string
  ): Promise<ApiResponse<GroupedPathAccess[]>> => {
    return fetcher<ApiResponse<GroupedPathAccess[]>>(
      "/path-access/grouped",
      token,
      {
        method: "GET",
      }
    );
  },

  getMe: async (token: string): Promise<ApiResponse<string[]>> => {
    return fetcher<ApiResponse<string[]>>("/path-access/me", token, {
      method: "GET",
    });
  },

  create: async (
    token: string,
    payload: PathAccessPayload
  ): Promise<ApiResponse<PathAccess>> => {
    return fetcher<ApiResponse<PathAccess>>("/path-access", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (
    token: string,
    id: string,
    payload: PathAccessPayload
  ): Promise<ApiResponse<PathAccess>> => {
    return fetcher<ApiResponse<PathAccess>>(`/path-access/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (token: string, id: string): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(`/path-access/${id}`, token, {
      method: "DELETE",
    });
  },
};
