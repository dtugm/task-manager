export enum LeaveType {
  SICK = "SICK",
  VACATION = "VACATION",
  ABSENT = "ABSENT",
}

export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

export interface LeaveRequestPayload {
  type: LeaveType;
  requestReason: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  status: LeaveStatus;
  requestReason: string;
  startDate: string;
  endDate: string;
  approver: string | null;
  approvalNote: string | null;
  createdAt: string;
  updatedAt: string;
  requester?: {
    id: string;
    username: string;
    email: string;
    fullName: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}
