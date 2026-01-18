import { ApiResponse } from "@/types/attendance";
import {
  AttendancePause,
  StartPausePayload,
  ResumePausePayload,
} from "@/types/attendance-pause";
import {
  OvertimeRequest,
  CreateOvertimePayload,
  UpdateOvertimePayload,
} from "@/types/overtime";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://internal-service-production.up.railway.app/api/v1";

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

export const pauseOvertimeApi = {
  // --- Attendance Pause Endpoints ---
  startPause: async (
    token: string,
    payload: StartPausePayload
  ): Promise<ApiResponse<AttendancePause>> => {
    return fetcher<ApiResponse<AttendancePause>>(
      "/attendance-pauses/start",
      token,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  resumePause: async (
    token: string,
    payload: ResumePausePayload
  ): Promise<ApiResponse<AttendancePause>> => {
    return fetcher<ApiResponse<AttendancePause>>(
      "/attendance-pauses/resume",
      token,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  getPausesByLogId: async (
    token: string,
    attendanceLogId: string
  ): Promise<ApiResponse<AttendancePause[]>> => {
    return fetcher<ApiResponse<AttendancePause[]>>(
      `/attendance-pauses/${attendanceLogId}`,
      token,
      {
        method: "GET",
      }
    );
  },

  deletePause: async (
    token: string,
    pauseId: string
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(`/attendance-pauses/${pauseId}`, token, {
      method: "DELETE",
    });
  },

  // --- Overtime Request Endpoints ---
  createOvertime: async (
    token: string,
    payload: CreateOvertimePayload
  ): Promise<ApiResponse<OvertimeRequest>> => {
    return fetcher<ApiResponse<OvertimeRequest>>("/overtime-request", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAllOvertimeRequests: async (
    token: string,
    page: number = 1,
    limit: number = 20,
    requesterId?: string,
    approverId?: string,
    status?: string,
    date?: string
  ): Promise<
    ApiResponse<{
      data: OvertimeRequest[];
      pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
      };
    }>
  > => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (requesterId) params.append("requesterId", requesterId);
    if (approverId) params.append("approverId", approverId);
    if (status) params.append("status", status);
    if (date) params.append("date", date);

    return fetcher<
      ApiResponse<{
        data: OvertimeRequest[];
        pagination: {
          total: number;
          pages: number;
          page: number;
          limit: number;
        };
      }>
    >(`/overtime-request?${params.toString()}`, token, {
      method: "GET",
    });
  },

  getMyOvertimeRequests: async (
    token: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    date?: string
  ): Promise<
    ApiResponse<{
      data: OvertimeRequest[];
      pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
      };
    }>
  > => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (status) params.append("status", status);
    if (date) params.append("date", date);

    return fetcher<
      ApiResponse<{
        data: OvertimeRequest[];
        pagination: {
          total: number;
          pages: number;
          page: number;
          limit: number;
        };
      }>
    >(`/overtime-request/me?${params.toString()}`, token, {
      method: "GET",
    });
  },

  updateOvertime: async (
    token: string,
    id: string,
    payload: UpdateOvertimePayload
  ): Promise<ApiResponse<OvertimeRequest>> => {
    return fetcher<ApiResponse<OvertimeRequest>>(
      `/overtime-request/${id}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  deleteOvertime: async (
    token: string,
    id: string
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(`/overtime-request/${id}`, token, {
      method: "DELETE",
    });
  },

  approveOvertime: async (
    token: string,
    id: string,
    payload: { status: string; approvalNote?: string }
  ): Promise<ApiResponse<OvertimeRequest>> => {
    return fetcher<ApiResponse<OvertimeRequest>>(
      `/overtime-request/${id}/approve`,
      token,
      {
        method: "PATCH", // Using PATCH based on user request
        body: JSON.stringify(payload),
      }
    );
  },
};
