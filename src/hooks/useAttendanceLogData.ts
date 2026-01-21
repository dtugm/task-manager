import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import jsCookie from "js-cookie";
import { DateRange } from "react-day-picker";
import { AttendanceLogItem } from "@/types/attendance";
import { attendanceApi } from "@/lib/attendance-api";

interface UseAttendanceLogDataProps {
  debouncedSearch: string;
  date: DateRange | undefined;
  recordType: string;
  workType: string;
  status: string;
  role: string;
  projectId: string;
  currentPage: number;
  itemsPerPage: number;
}

export const useAttendanceLogData = ({
  debouncedSearch,
  date,
  recordType,
  workType,
  status,
  role,
  projectId,
  currentPage,
  itemsPerPage,
}: UseAttendanceLogDataProps) => {
  const [logs, setLogs] = useState<AttendanceLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = jsCookie.get("accessToken");

      const authToken =
        token ||
        document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"))?.[2] ||
        "";

      if (!authToken) {
        console.log("No access token found");
        return;
      }

      const startDate = date?.from
        ? format(date.from, "yyyy-MM-dd")
        : undefined;
      const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

      const isSearching = debouncedSearch.length > 0;

      // If searching, fetch "all" (limit 3000) for client-side filtering
      // If NOT searching, use efficient server-side pagination
      const fetchPage = isSearching ? 1 : currentPage;
      const fetchLimit = isSearching ? 3000 : itemsPerPage;

      const response = await attendanceApi.getAllAttendanceLogs(
        authToken,
        fetchPage,
        fetchLimit,
        undefined, // Skip server-side search param as it's not supported
        recordType === "Attendance"
          ? workType === "all"
            ? undefined
            : workType
          : undefined,
        role === "all" ? undefined : role,
        startDate,
        endDate,
        projectId === "all" ? undefined : projectId,
        recordType === "all" ? undefined : recordType,
        recordType === "Leave" || recordType === "Overtime"
          ? status === "all"
            ? undefined
            : status
          : undefined,
      );

      if (response.success && response.data) {
        if (isSearching) {
          // CLIENT-SIDE FILTERING & PAGINATION
          const allData = response.data.attendanceLogs;
          const searchLower = debouncedSearch.toLowerCase();
          const filtered = allData.filter(
            (log) =>
              log.user.name.toLowerCase().includes(searchLower) ||
              log.user.email.toLowerCase().includes(searchLower),
          );

          setTotalItems(filtered.length);

          // Slice for current page
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedLogs = filtered.slice(
            startIndex,
            startIndex + itemsPerPage,
          );
          setLogs(paginatedLogs);
        } else {
          // SERVER-SIDE PAGINATION
          setLogs(response.data.attendanceLogs);
          setTotalItems(response.data.pagination.total);
        }
      } else {
        setLogs([]);
        setTotalItems(0);
      }
    } catch (error: any) {
      console.error("Failed to fetch logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    workType,
    status,
    recordType,
    role,
    date,
    projectId,
  ]);

  // Effect to fetch when any dependency changes
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    totalItems,
    fetchLogs,
  };
};
