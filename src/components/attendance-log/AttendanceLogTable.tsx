"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, History } from "lucide-react";
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
  return (
    <div className="rounded-2xl border border-white/20 bg-white/30 dark:bg-slate-900/30">
      <Table>
        <TableHeader className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              {t.employee}
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              {t.date}
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Type
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Details / Status
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Times
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Activities / Reason
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Working Hours
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Pause
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Overtime
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Total
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
          ) : logs.length === 0 ? (
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
            logs.map((log, index) => (
              <AttendanceLogRow key={index} log={log} index={index} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
