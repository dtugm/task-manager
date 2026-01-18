export type OvertimeStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OvertimeRequest {
  id: string;
  requesterId: string;
  clockIn: string;
  clockOut: string;
  activities: string;
  status: OvertimeStatus;
  approverId?: string;
  approvalNote?: string;
  createdAt: string;
  updatedAt: string;
  // Optional relations
  requester?: {
    id: string;
    fullName: string;
    email: string;
  };
  approver?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CreateOvertimePayload {
  clockIn: string;
  clockOut: string;
  activities: string;
}

export interface UpdateOvertimePayload {
  clockIn?: string;
  clockOut?: string;
  activities?: string;
}
export interface ApproveOvertimePayload {
  status: "APPROVED" | "REJECTED";
  approvalNote?: string;
}
