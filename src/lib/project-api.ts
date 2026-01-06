import { ApiResponse } from "@/types/auth";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  AddProjectUserRequest,
  UpdateProjectUserRoleRequest,
} from "@/types/project";

const BASE_URL = "https://internal-service-production.up.railway.app/api/v1";

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
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

export const projectApi = {
  getAllProjects: async (token: string): Promise<ApiResponse<Project[]>> => {
    return fetcher<ApiResponse<Project[]>>("/projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getProjectById: async (
    token: string,
    id: string
  ): Promise<ApiResponse<Project>> => {
    return fetcher<ApiResponse<Project>>(`/projects/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createProject: async (
    token: string,
    data: CreateProjectRequest
  ): Promise<ApiResponse<Project>> => {
    return fetcher<ApiResponse<Project>>("/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  updateProject: async (
    token: string,
    id: string,
    data: UpdateProjectRequest
  ): Promise<ApiResponse<Project>> => {
    return fetcher<ApiResponse<Project>>(`/projects/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  deleteProject: async (
    token: string,
    id: string
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(`/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getProjectUsers: async (
    token: string,
    id: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<any>> => {
    // Return type 'any' for now since the full user response structure wasn't provided
    return fetcher<ApiResponse<any>>(
      `/projects/${id}/users?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  addProjectUser: async (
    token: string,
    id: string,
    data: AddProjectUserRequest
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(`/projects/${id}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  updateProjectUserRole: async (
    token: string,
    projectId: string,
    userId: string,
    data: UpdateProjectUserRoleRequest
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(
      `/projects/${projectId}/users/${userId}/role`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
  },

  removeProjectUser: async (
    token: string,
    projectId: string,
    userId: string
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(
      `/projects/${projectId}/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getMyRole: async (
    token: string,
    projectId: string
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(`/projects/${projectId}/my-role`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
