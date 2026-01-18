import { ApiResponse } from "@/types/auth";
import {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  SetActiveOrganizationRequest,
  AddOrganizationUserRequest,
  UpdateOrganizationUserRoleRequest,
  OrganizationWithRole,
  OrganizationUsersResponse,
  Organization,
} from "@/types/organization";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://internal-service-production.up.railway.app/api/v1";

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (process.env.NEXT_PUBLIC_REGISTER_APIKEY) {
    headers["X-API-Key"] = process.env.NEXT_PUBLIC_REGISTER_APIKEY;
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

export const organizationApi = {
  getAllOrganizations: async (
    token: string
  ): Promise<ApiResponse<OrganizationWithRole[]>> => {
    return fetcher<ApiResponse<OrganizationWithRole[]>>("/organizations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getActiveOrganization: async (
    token: string
  ): Promise<ApiResponse<OrganizationWithRole>> => {
    return fetcher<ApiResponse<OrganizationWithRole>>("/organizations/active", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getOrganizationById: async (
    token: string,
    id: string
  ): Promise<ApiResponse<Organization>> => {
    return fetcher<ApiResponse<Organization>>(`/organizations/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createOrganization: async (
    token: string,
    data: CreateOrganizationRequest
  ): Promise<ApiResponse<OrganizationWithRole>> => {
    return fetcher<ApiResponse<OrganizationWithRole>>("/organizations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  updateOrganization: async (
    token: string,
    id: string,
    data: UpdateOrganizationRequest
  ): Promise<ApiResponse<Organization>> => {
    return fetcher<ApiResponse<Organization>>(`/organizations/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  deleteOrganization: async (
    token: string,
    id: string
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(`/organizations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  setActiveOrganization: async (
    token: string,
    data: SetActiveOrganizationRequest
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>("/organizations/set-active", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  getOrganizationUsers: async (
    token: string,
    id: string,
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<ApiResponse<OrganizationUsersResponse>> => {
    let url = `/organizations/${id}/users?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return fetcher<ApiResponse<OrganizationUsersResponse>>(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  addOrganizationUser: async (
    token: string,
    id: string,
    data: AddOrganizationUserRequest
  ): Promise<ApiResponse<any>> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return fetcher<ApiResponse<any>>(`/organizations/${id}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  },

  updateOrganizationUserRole: async (
    token: string,
    organizationId: string,
    userId: string,
    data: UpdateOrganizationUserRoleRequest
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(
      `/organizations/${organizationId}/users/${userId}/role`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
  },

  removeOrganizationUser: async (
    token: string,
    organizationId: string,
    userId: string
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(
      `/organizations/${organizationId}/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getMyRoleInOrganization: async (
    token: string,
    organizationId: string
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(
      `/organizations/${organizationId}/my-role`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
