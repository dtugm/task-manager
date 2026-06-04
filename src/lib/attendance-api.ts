import {
  ApiResponse,
  AttendanceLog,
  AttendanceLogItem,
  ClockInPayload,
  ClockOutPayload,
} from "@/types/attendance";
import { LeaveRequestPayload, LeaveRequest } from "@/types/leave";

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

async function multipartFetcher<T>(
  url: string,
  token: string,
  form: FormData,
  method: "POST" | "PATCH"
): Promise<T> {
  // Intentionally do not set Content-Type — the browser adds the multipart boundary.
  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form,
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

  clockInWithPhoto: async (
    token: string,
    payload: ClockInPayload,
    photo: File | null
  ): Promise<ApiResponse<AttendanceLog>> => {
    const form = new FormData();
    form.append("clockIn", payload.clockIn);
    form.append("latClockIn", String(payload.latClockIn));
    form.append("longClockIn", String(payload.longClockIn));
    form.append("workType", payload.workType);
    if (photo) form.append("photo", photo);
    return multipartFetcher<ApiResponse<AttendanceLog>>(
      "/attendance-log/clock-in-with-photo",
      token,
      form,
      "POST"
    );
  },

  clockOutWithPhoto: async (
    token: string,
    attendanceId: string,
    payload: ClockOutPayload,
    photo: File | null
  ): Promise<ApiResponse<AttendanceLog>> => {
    const form = new FormData();
    form.append("clockOut", payload.clockOut);
    form.append("latClockOut", String(payload.latClockOut));
    form.append("longClockOut", String(payload.longClockOut));
    form.append("activities", payload.activities);
    if (photo) form.append("photo", photo);
    return multipartFetcher<ApiResponse<AttendanceLog>>(
      `/attendance-log/${attendanceId}/clock-out-with-photo`,
      token,
      form,
      "PATCH"
    );
  },

  replaceAttendancePhoto: async (
    token: string,
    attendanceId: string,
    side: "in" | "out",
    photo: File
  ): Promise<ApiResponse<AttendanceLog>> => {
    const form = new FormData();
    form.append("photo", photo);
    return multipartFetcher<ApiResponse<AttendanceLog>>(
      `/attendance-log/${attendanceId}/photo?side=${side}`,
      token,
      form,
      "PATCH"
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

  getAllAttendanceLogs: async (
    token: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    workType?: string,
    role?: string,
    startDate?: string,
    endDate?: string,
    projectId?: string,
    type?: string,
    status?: string
  ): Promise<
    ApiResponse<{ attendanceLogs: AttendanceLogItem[]; pagination: any }>
  > => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (workType && workType !== "all") params.append("workType", workType);
    if (role && role !== "all") params.append("role", role);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (projectId && projectId !== "all") params.append("projectId", projectId);
    if (type && type !== "all") params.append("type", type);
    if (status && status !== "all") params.append("status", status);

    return fetcher<
      ApiResponse<{ attendanceLogs: AttendanceLogItem[]; pagination: any }>
    >(`/attendance-log/all?${params.toString()}`, token, {
      method: "GET",
    });
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
