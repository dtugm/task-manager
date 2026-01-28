"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  History,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useState } from "react";
import { AttendanceLogItem } from "@/types/attendance";
import { AttendanceLogRow } from "./AttendanceLogRow";

interface AttendanceLogTableProps {
  logs: AttendanceLogItem[];
  loading: boolean;
  t: any; // Language translations
}

export const AttendanceLogTable = ({
  logs,
  loading,
  t,
}: AttendanceLogTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: "employee" | "times" | "workingHours" | "total" | "date" | "createdAt";
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });

  const sortedLogs = [...logs].sort((a, b) => {
    switch (sortConfig.key) {
      case "employee": {
        const nameA = a.user?.name || "";
        const nameB = b.user?.name || "";
        return sortConfig.direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      case "times": {
        // Sort by clockIn time
        const timeA =
          a.type === "ATTENDANCE" || a.type === "OVERTIME"
            ? new Date(a.clockIn || 0).getTime()
            : 0;
        const timeB =
          b.type === "ATTENDANCE" || b.type === "OVERTIME"
            ? new Date(b.clockIn || 0).getTime()
            : 0;
        return sortConfig.direction === "asc" ? timeA - timeB : timeB - timeA;
      }
      case "workingHours": {
        const hoursA =
          a.type === "ATTENDANCE"
            ? a.workingHours || 0
            : a.type === "OVERTIME"
              ? a.overtimeHours || 0
              : 0;
        const hoursB =
          b.type === "ATTENDANCE"
            ? b.workingHours || 0
            : b.type === "OVERTIME"
              ? b.overtimeHours || 0
              : 0;
        return sortConfig.direction === "asc"
          ? hoursA - hoursB
          : hoursB - hoursA;
      }
      case "total": {
        const totalA = a.type === "ATTENDANCE" ? a.totalWorkingHours || 0 : 0;
        const totalB = b.type === "ATTENDANCE" ? b.totalWorkingHours || 0 : 0;
        return sortConfig.direction === "asc"
          ? totalA - totalB
          : totalB - totalA;
      }
      case "date": {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      case "createdAt":
      default: {
        // 1. Primary Sort: Date (Day)
        const dateA = new Date(a.date).setHours(0, 0, 0, 0);
        const dateB = new Date(b.date).setHours(0, 0, 0, 0);

        if (dateA !== dateB) {
          // Always sort dates DESC by default for "newest day first"
          // If the user clicked the column to toggle, use sortConfig.direction
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }

        // 2. Secondary Sort: Time within the day
        // Prioritize clockIn for Attendance/Overtime, then specific timestamps
        const getTime = (item: AttendanceLogItem) => {
          if (
            (item.type === "ATTENDANCE" || item.type === "OVERTIME") &&
            item.clockIn
          ) {
            return new Date(item.clockIn).getTime();
          }
          if (item.createdAt) return new Date(item.createdAt).getTime();
          if (item.updatedAt) return new Date(item.updatedAt).getTime();
          return 0;
        };

        const timeA = getTime(a);
        const timeB = getTime(b);
        return sortConfig.direction === "asc" ? timeA - timeB : timeB - timeA;
      }
    }
  });

  const handleSort = (
    key: "employee" | "times" | "workingHours" | "total" | "date" | "createdAt",
  ) => {
    setSortConfig(
      (current: {
        key:
          | "employee"
          | "times"
          | "workingHours"
          | "total"
          | "date"
          | "createdAt";
        direction: "asc" | "desc";
      }) => ({
        key,
        direction:
          current.key === key && current.direction === "asc" ? "desc" : "asc",
      }),
    );
  };

  const SortIcon = ({
    columnKey,
  }: {
    columnKey:
      | "employee"
      | "times"
      | "workingHours"
      | "total"
      | "date"
      | "updatedAt";
  }) => {
    if (sortConfig.key !== columnKey)
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-indigo-500" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-indigo-500" />
    );
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-white/30 dark:bg-slate-900/30">
      <Table>
        <TableHeader className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead
              className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
              onClick={() => handleSort("employee")}
            >
              <div className="flex items-center">
                {t.employee}
                <SortIcon columnKey="employee" />
              </div>
            </TableHead>
            <TableHead
              className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                {t.date}
                <SortIcon columnKey="date" />
              </div>
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Type
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Details / Status
            </TableHead>
            <TableHead
              className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
              onClick={() => handleSort("times")}
            >
              <div className="flex items-center">
                Times
                <SortIcon columnKey="times" />
              </div>
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Activities / Reason
            </TableHead>
            <TableHead
              className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
              onClick={() => handleSort("workingHours")}
            >
              <div className="flex items-center">
                Working Hours
                <SortIcon columnKey="workingHours" />
              </div>
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Pause
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Overtime
            </TableHead>
            <TableHead
              className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
              onClick={() => handleSort("total")}
            >
              <div className="flex items-center">
                Total
                <SortIcon columnKey="total" />
              </div>
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              {t.location}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="border-none">
              <TableCell colSpan={11} className="h-64 text-center">
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
              </TableCell>
            </TableRow>
          ) : sortedLogs.length === 0 ? (
            <TableRow className="hover:bg-transparent border-none">
              <TableCell colSpan={11} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4">
                    <History className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="font-medium text-lg">{t.noRecords}</p>
                  <p className="text-sm opacity-70 mt-1">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedLogs.map((log, index) => (
              <AttendanceLogRow key={index} log={log} index={index} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
