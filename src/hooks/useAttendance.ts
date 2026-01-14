import { useState, useEffect } from "react";
import { attendanceApi } from "@/lib/attendance-api";
import type { AttendanceLog, ClockInPayload } from "@/types/attendance";

export function useAttendance() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [attendanceId, setAttendanceId] = useState<string | null>(null);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [history, setHistory] = useState<AttendanceLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterWorkType, setFilterWorkType] = useState<string>("all");

  const getAuthToken = () => {
    const match = document.cookie.match(/accessToken=([^;]+)/);
    return match ? match[1] : null;
  };

  const fetchHistory = async () => {
    const token = getAuthToken();
    if (!token) return;

    setHistoryLoading(true);
    try {
      const resp = await attendanceApi.getAllCurrentUser(
        token,
        1,
        20,
        startDate,
        endDate,
        filterWorkType
      );
      if (resp.success && resp.data) {
        setHistory(resp.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const resp = await attendanceApi.getTodayAttendance(token);
      if (resp.success && resp.data) {
        // Use availability flag if present, otherwise fallback to check if clockIn exists
        const isAvailable = resp.data.availability ?? !!resp.data.clockIn;
        setIsClockedIn(isAvailable);
        setAttendanceId(resp.data.id);
        if (resp.data.clockIn) {
          setClockInTime(new Date(resp.data.clockIn));
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch today's attendance:", error);
    }
  };

  const handleClockIn = async (payload: ClockInPayload) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login first");
    }

    const resp = await attendanceApi.clockIn(token, payload);
    if (resp.success && resp.data) {
      setIsClockedIn(true);
      setAttendanceId(resp.data.id);
      setClockInTime(new Date());
      await fetchHistory();
      return resp.data;
    }
    throw new Error("Failed to clock in");
  };

  const handleClockOut = async (
    activities: string,
    latitude: number,
    longitude: number
  ) => {
    const token = getAuthToken();
    if (!token || !attendanceId) {
      throw new Error("Invalid state");
    }

    const resp = await attendanceApi.clockOut(token, attendanceId, {
      clockOut: new Date().toISOString(),
      latClockOut: latitude,
      longClockOut: longitude,
      activities,
    });

    if (resp.success) {
      setIsClockedIn(false);
      setAttendanceId(null);
      setClockInTime(null);
      await fetchHistory();
      return resp.data;
    }
    throw new Error("Failed to clock out");
  };

  useEffect(() => {
    fetchTodayAttendance();
    fetchHistory();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [startDate, endDate, filterWorkType]);

  return {
    isClockedIn,
    attendanceId,
    clockInTime,
    history,
    historyLoading,
    startDate,
    endDate,
    filterWorkType,
    setStartDate,
    setEndDate,
    setFilterWorkType,
    handleClockIn,
    handleClockOut,
    fetchHistory,
  };
}
