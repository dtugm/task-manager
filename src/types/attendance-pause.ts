export interface AttendancePause {
  id: string;
  attendanceLogId: string;
  pauseStart: string;
  pauseEnd?: string;
  duration?: number; // In minutes, optional if calculated backend or frontend
  createdAt: string;
  updatedAt: string;
}

export interface StartPausePayload {
  pauseStart: string;
  attendanceLogId: string;
  pauseEnd?: string; // Optional, though usually start doesn't have end immediately
}

export interface ResumePausePayload {
  pauseEnd: string;
  attendanceLogId: string;
}
