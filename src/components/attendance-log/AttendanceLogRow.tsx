"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttendanceLogItem } from "@/types/attendance";
import { ActivityCell } from "./ActivityCell";

interface AttendanceLogRowProps {
  log: AttendanceLogItem;
  index: number;
}

export const AttendanceLogRow = ({ log, index }: AttendanceLogRowProps) => {
  const isAttendance = log.type === "ATTENDANCE";
  const isLeave = log.type === "LEAVE";

  return (
    <TableRow
      key={`${log.user?.id}-${log.date}-${index}`}
      className="hover:bg-white/40 dark:hover:bg-slate-800/40 border-white/10 transition-colors"
    >
      {/* Employee */}
      <TableCell>
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {log.user?.name || "Unknown"}
          </p>
          <p className="text-xs text-slate-500">{log.user?.email || "-"}</p>
        </div>
      </TableCell>

      {/* Date */}
      <TableCell className="text-slate-600 dark:text-slate-400">
        {format(new Date(log.date), "dd MMM yyyy")}
      </TableCell>

      {/* Type Badge */}
      <TableCell>
        {isAttendance ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            Attendance
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
            Leave
          </span>
        )}
      </TableCell>

      {/* Details / Status */}
      <TableCell>
        {isAttendance ? (
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded w-fit font-medium",
                log.workType === "Work from Home" &&
                  "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
                log.workType === "Work from Office" &&
                  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
                log.workType === "Field Work" &&
                  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
              )}
            >
              {log.workType || "Unknown"}
            </span>
            {log.clockOut ? (
              <span className="text-xs font-medium text-green-600">
                Completed
              </span>
            ) : (
              <span className="text-xs font-medium text-amber-600">Active</span>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">{log.leaveType}</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded w-fit",
                log.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : log.status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              )}
            >
              {log.status}
            </span>
          </div>
        )}
      </TableCell>

      {/* Times */}
      <TableCell className="font-medium text-slate-700 dark:text-slate-300">
        {isAttendance ? (
          <div className="flex flex-col text-xs gap-1">
            <div className="flex items-center gap-1.5 text-green-600">
              <Clock className="h-3 w-3" />
              <span>
                In: {log.clockIn ? format(new Date(log.clockIn), "HH:mm") : "-"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600">
              <Clock className="h-3 w-3" />
              <span>
                Out:{" "}
                {log.clockOut ? format(new Date(log.clockOut), "HH:mm") : "-"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500">
            {log.totalLeaveDays} days
          </div>
        )}
      </TableCell>

      {/* Activities / Reason */}
      <TableCell className="max-w-[200px]">
        <ActivityCell
          text={isAttendance ? log.activities || "" : log.requestReason || ""}
          title={isAttendance ? "Activities" : "Request Reason"}
        />
      </TableCell>

      {/* Working Hours */}
      <TableCell className="text-xs text-slate-600 dark:text-slate-400">
        {isAttendance ? log.workingHours?.toFixed(2) + " h" : "-"}
      </TableCell>

      {/* Pause Hours */}
      <TableCell className="text-xs text-slate-600 dark:text-slate-400">
        {isAttendance ? log.pauseHours?.toFixed(2) + " h" : "-"}
      </TableCell>

      {/* Overtime Hours */}
      <TableCell className="text-xs text-slate-600 dark:text-slate-400">
        {isAttendance ? log.overtimeHours?.toFixed(2) + " h" : "-"}
      </TableCell>

      {/* Total Working Hours */}
      <TableCell className="text-xs font-medium text-slate-900 dark:text-slate-100">
        {isAttendance ? log.totalWorkingHours?.toFixed(2) + " h" : "-"}
      </TableCell>

      {/* Location */}
      <TableCell className="text-slate-500">
        {isAttendance && log.latClockIn && log.lngClockIn ? (
          <div
            className="flex items-center gap-1 text-xs cursor-help"
            title={`In: ${log.latClockIn}, ${log.lngClockIn}`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Map</span>
          </div>
        ) : (
          <span className="text-xs">-</span>
        )}
      </TableCell>
    </TableRow>
  );
};
