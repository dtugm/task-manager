import { ApiResponse } from "@/types/auth";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksResponse,
  CreatedTasksSummaryResponse,
} from "@/types/task";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://internal-service-production.up.railway.app/api/v1";

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

export const taskApi = {
  getTask: async (token: string, id: string): Promise<ApiResponse<Task>> => {
    return fetcher<ApiResponse<Task>>(`/tasks/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getTasks: async (
    token: string,
    page: number = 1,
    limit: number = 20,
    assigneeId?: string,
    creatorId?: string,
    search?: string,
    projectId?: string,
  ): Promise<TasksResponse> => {
    let url = `/tasks?page=${page}&limit=${limit}`;
    if (assigneeId) {
      url += `&assigneeId=${assigneeId}`;
    }
    if (creatorId) {
      url += `&creatorId=${creatorId}`;
    }
    if (search) {
      url += `&title=${encodeURIComponent(search)}`;
    }
    if (projectId) {
      url += `&projectId=${projectId}`;
    }
    return fetcher<TasksResponse>(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getProjectTasks: async (
    token: string,
    projectId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<TasksResponse> => {
    return fetcher<TasksResponse>(`/tasks/projects/${projectId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createTask: async (
    token: string,
    data: CreateTaskRequest,
  ): Promise<ApiResponse<Task>> => {
    return fetcher<ApiResponse<Task>>("/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  updateTask: async (
    token: string,
    id: string,
    data: UpdateTaskRequest,
  ): Promise<ApiResponse<Task>> => {
    return fetcher<ApiResponse<Task>>(`/tasks/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  deleteTask: async (token: string, id: string): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(`/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  addComment: async (
    token: string,
    id: string,
    data: { comment: string },
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(`/tasks/${id}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  getTaskLogs: async (
    token: string,
    id: string,
  ): Promise<ApiResponse<any[]>> => {
    return fetcher<ApiResponse<any[]>>(`/tasks/${id}/logs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getCreatedTasksSummary: async (
    token: string,
  ): Promise<CreatedTasksSummaryResponse> => {
    return fetcher<CreatedTasksSummaryResponse>("/tasks/summary/created", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateStatus: async (
    token: string,
    id: string,
    status: string,
  ): Promise<ApiResponse<Task>> => {
    return fetcher<ApiResponse<Task>>(`/tasks/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  },

  approveTask: async (
    token: string,
    id: string,
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(`/tasks/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  rejectTask: async (
    token: string,
    id: string,
    reason: string,
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(`/tasks/${id}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
  },

  assignTask: async (
    token: string,
    id: string,
    assigneeIds: string[],
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(`/tasks/${id}/assign`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ assigneeIds }),
    });
  },

  unassignTask: async (
    token: string,
    id: string,
    assigneeIds: string[],
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>(`/tasks/${id}/assign`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ assigneeIds }),
    });
  },

  sendReminder: async (
    token: string,
    taskId: string,
  ): Promise<ApiResponse<null>> => {
    return fetcher<ApiResponse<null>>("/tasks/reminder", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ taskId }),
    });
  },
};
