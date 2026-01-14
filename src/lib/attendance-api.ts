import {
  ApiResponse,
  AttendanceLog,
  ClockInPayload,
  ClockOutPayload,
} from "@/types/attendance";
import { LeaveRequestPayload, LeaveRequest } from "@/types/leave";

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

export const attendanceApi = {
  clockIn: async (
    token: string,
    payload: ClockInPayload
  ): Promise<ApiResponse<AttendanceLog>> => {
    return fetcher<ApiResponse<AttendanceLog>>(
      "/attendance-log/clock-in",
      token,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  clockOut: async (
    token: string,
    attendanceId: string,
    payload: ClockOutPayload
  ): Promise<ApiResponse<AttendanceLog>> => {
    return fetcher<ApiResponse<AttendanceLog>>(
      `/attendance-log/${attendanceId}/clock-out`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  },

  getTodayAttendance: async (
    token: string
  ): Promise<ApiResponse<AttendanceLog>> => {
    return fetcher<ApiResponse<AttendanceLog>>("/attendance-log/today", token, {
      method: "GET",
    });
  },

  getAllCurrentUser: async (
    token: string,
    page: number = 1,
    limit: number = 20,
    startDate?: string,
    endDate?: string,
    workType?: string
  ): Promise<ApiResponse<{ data: AttendanceLog[]; pagination: any }>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (workType && workType !== "all") params.append("workType", workType);

    return fetcher<ApiResponse<{ data: AttendanceLog[]; pagination: any }>>(
      `/attendance-log/all/current-user?${params.toString()}`,
      token,
      {
        method: "GET",
      }
    );
  },

  createLeaveRequest: async (
    token: string,
    payload: LeaveRequestPayload
  ): Promise<ApiResponse<LeaveRequest>> => {
    return fetcher<ApiResponse<LeaveRequest>>("/leave-request", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMyLeaveRequests: async (
    token: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    type?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<{ data: LeaveRequest[]; pagination: any }>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status && status !== "all") params.append("status", status);
    if (type && type !== "all") params.append("type", type);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return fetcher<ApiResponse<{ data: LeaveRequest[]; pagination: any }>>(
      `/leave-request/me?${params.toString()}`,
      token,
      {
        method: "GET",
      }
    );
  },

  updateLeaveRequest: async (
    token: string,
    leaveId: string,
    payload: LeaveRequestPayload
  ): Promise<ApiResponse<LeaveRequest>> => {
    return fetcher<ApiResponse<LeaveRequest>>(
      `/leave-request/${leaveId}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  deleteLeaveRequest: async (
    token: string,
    leaveId: string
  ): Promise<ApiResponse<any>> => {
    return fetcher<ApiResponse<any>>(`/leave-request/${leaveId}`, token, {
      method: "DELETE",
    });
  },

  // Manager-specific endpoints
  getAllLeaveRequests: async (
    token: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    type?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<{ data: LeaveRequest[]; pagination: any }>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status && status !== "all") params.append("status", status);
    if (type && type !== "all") params.append("type", type);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return fetcher<ApiResponse<{ data: LeaveRequest[]; pagination: any }>>(
      `/leave-request?${params.toString()}`,
      token
    );
  },

  approveLeaveRequest: async (
    token: string,
    id: string,
    payload: { status: "APPROVED" | "REJECTED"; approvalNote: string }
  ): Promise<ApiResponse<LeaveRequest>> => {
    return fetcher<ApiResponse<LeaveRequest>>(
      `/leave-request/${id}/approve`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  },
};
