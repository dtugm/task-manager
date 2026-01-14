export interface ClockInPayload {
  clockIn: string;
  latClockIn: number;
  longClockIn: number;
  workType: "Work from Office" | "Work from Home" | "Field Work";
}

export interface ClockOutPayload {
  clockOut: string;
  latClockOut: number;
  longClockOut: number;
  activities: string;
}

export interface AttendanceLog {
  id: string;
  clockIn: string;
  clockOut?: string;
  latClockIn: number;
  longClockIn: number;
  latClockOut?: number;
  longClockOut?: number;
  workType: string;
  activities?: string;
  availability?: boolean;
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
