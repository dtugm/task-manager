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

export interface AttendanceLog {
  id: string;
  clockIn: string;
  clockOut: string | null;
  latClockIn: number;
  lngClockIn: number; // Changed from longClockIn to match API
  latClockOut: number | null;
  lngClockOut: number | null; // Changed from longClockOut to match API
  activities: string | null;
  availability: boolean;
  date: string;
  workType: string;
  user: User;
  attendancePauses: any[]; // You might want to define a type for pauses too if needed
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
