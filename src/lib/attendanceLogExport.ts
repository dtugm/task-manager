import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import jsCookie from "js-cookie";
import * as XLSX from "xlsx";
import { attendanceApi } from "@/lib/attendance-api";

interface ExportAttendanceLogsParams {
  search: string;
  date: DateRange | undefined;
  recordType: string;
  workType: string;
  status: string;
  role: string;
  projectId: string;
}

export const exportAttendanceLogs = async ({
  search,
  date,
  recordType,
  workType,
  status,
  role,
  projectId,
}: ExportAttendanceLogsParams) => {
  try {
    const token = jsCookie.get("accessToken");
    if (!token) return;

    const startDate = date?.from ? format(date.from, "yyyy-MM-dd") : undefined;
    const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

    const response = await attendanceApi.getAllAttendanceLogs(
      token,
      1,
      3000, // Fetch more records to ensure we get all filtered data
      undefined,
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

    if (response.success && response.data?.attendanceLogs) {
      let logsToExport = response.data.attendanceLogs;

      // Apply client-side search filter if search is active
      if (search && search.trim().length > 0) {
        const searchLower = search.toLowerCase();
        logsToExport = logsToExport.filter(
          (log) =>
            log.user.name.toLowerCase().includes(searchLower) ||
            log.user.email.toLowerCase().includes(searchLower),
        );
      }

      if (logsToExport.length === 0) {
        alert("No data to export with current filters");
        return;
      }

      const dataToExport = logsToExport.map((log) => {
        if (log.type === "ATTENDANCE") {
          return {
            Type: "Attendance",
            Employee: log.user.name,
            Email: log.user.email,
            Date: format(new Date(log.date), "dd MMM yyyy"),
            "Clock In": log.clockIn
              ? format(new Date(log.clockIn), "HH:mm")
              : "-",
            "Clock Out": log.clockOut
              ? format(new Date(log.clockOut), "HH:mm")
              : "-",
            "Work Type": log.workType,
            "Working Hours": log.workingHours?.toFixed(2) || "0",
            "Pause Hours": log.pauseHours?.toFixed(2) || "0",
            "Overtime Hours": log.overtimeHours?.toFixed(2) || "0",
            "Total Working Hours": log.totalWorkingHours?.toFixed(2) || "0",
            Activities: log.activities || "-",
            Location: `(${log.latClockIn}, ${log.longClockIn})`,
          };
        } else if (log.type === "OVERTIME") {
          return {
            Type: "Overtime",
            Employee: log.user.name,
            Email: log.user.email,
            Date: format(new Date(log.date), "dd MMM yyyy"),
            "Clock In": log.clockIn
              ? format(new Date(log.clockIn), "HH:mm")
              : "-",
            "Clock Out": log.clockOut
              ? format(new Date(log.clockOut), "HH:mm")
              : "-",
            Status: log.status,
            Activities: log.activities || "-",
            "Overtime Hours": log.overtimeHours?.toFixed(2) || "-",
            "Work Type": "-",
            "Working Hours": "-",
            "Pause Hours": "-",
            "Total Working Hours": "-",
            "Leave Type": "-",
            "Req Reason": "-",
          };
        } else {
          return {
            Type: "Leave",
            Employee: log.user.name,
            Email: log.user.email,
            Date: format(new Date(log.date), "dd MMM yyyy"),
            Status: log.status,
            "Leave Type": log.leaveType,
            "Req Reason": log.requestReason,
            "Start Date": log.startDate,
            "End Date": log.endDate,
            "Working Hours": "-",
            "Pause Hours": "-",
            "Overtime Hours": "-",
            "Total Working Hours": "-",
          };
        }
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Logs");
      XLSX.writeFile(wb, "Attendance_Logs.xlsx");

      alert("Attendance logs exported successfully");
    } else {
      alert("No data to export");
    }
  } catch (error) {
    console.error("Failed to export:", error);
    alert("Failed to export data");
  }
};
