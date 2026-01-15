export interface ClockInPayload {
  clockIn: string;
  latClockIn: number;
  lngClockIn: number;
  workType: "Work from Office" | "Work from Home" | "Field Work";
}

export interface ClockOutPayload {
  clockOut: string;
  latClockOut: number;
  lngClockOut: number;
  activities: string;
}

export interface OrganizationRole {
  id: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  isActive: boolean;
}

export interface ProjectRole {
  id: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  username: string;
  email: string;
  fullName: string;
  organizationRoles: OrganizationRole[];
  projectRoles: ProjectRole[];
}

export interface BaseLogUser {
  id: string;
  name: string;
  email: string;
}

export interface BaseLog {
  date: string;
  user: BaseLogUser;
}

export interface AttendanceItem extends BaseLog {
  type: "ATTENDANCE";
  workType: string;
  clockIn: string | null;
  clockOut: string | null;
  lngClockIn: number | null;
  latClockIn: number | null;
  activities: string | null;
  pauseHours: number;
  workingHours: number;
  overtimeHours: number;
  totalWorkingHours: number;
  overtime: {
    clockIn: string | null;
    clockOut: string | null;
    activities: string | null;
    hours: number;
  };
}

export interface LeaveItem extends BaseLog {
  type: "LEAVE";
  startDate: string;
  endDate: string;
  totalLeaveDays: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  leaveType: string;
  requestReason: string;
  approvalNote: string | null;
}

export type AttendanceLogItem = AttendanceItem | LeaveItem;

// Keeping existing AttendanceLog for other parts of the app for now,
// though we might want to consolidate eventually.
export interface AttendanceLog {
  id: string;
  clockIn: string;
  clockOut: string | null;
  latClockIn: number;
  lngClockIn: number;
  latClockOut: number | null;
  lngClockOut: number | null;
  activities: string | null;
  availability: boolean;
  date: string;
  workType: string;
  user: User;
  attendancePauses: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}
