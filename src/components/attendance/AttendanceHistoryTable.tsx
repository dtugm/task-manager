import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { AttendanceLog } from "@/types/attendance";
import { ActivityCell } from "../attendance-log/ActivityCell";

interface AttendanceHistoryTableProps {
  history: AttendanceLog[];
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
  startDate: string;
  endDate: string;
  filterWorkType: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onFilterWorkTypeChange: (value: string) => void;
  t: any; // Translation object
}

export function AttendanceHistoryTable({
  history,
  loading,
  onRefresh,
  onExport,
  startDate,
  endDate,
  filterWorkType,
  onStartDateChange,
  onEndDateChange,
  onFilterWorkTypeChange,
  t,
}: AttendanceHistoryTableProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
            {t.attendanceHistory}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.yourPastRecords}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="rounded-xl"
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", loading && "animate-spin")}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={onExport}
            className="rounded-xl border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-800 hover:border-green-300 transition-all bg-white/50 dark:bg-slate-900/50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50"
          />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50"
          />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Work Type</Label>
          <Select value={filterWorkType} onValueChange={onFilterWorkTypeChange}>
            <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Work from Office">Work from Office</SelectItem>
              <SelectItem value="Work from Home">Work from Home</SelectItem>
              <SelectItem value="Field Work">Field Work</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onStartDateChange("");
              onEndDateChange("");
              onFilterWorkTypeChange("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/20">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead className="hidden md:table-cell">Activities</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading history...
                  </div>
                </TableCell>
              </TableRow>
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-500"
                >
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              history.map((log) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">
                    {log.clockIn
                      ? format(new Date(log.clockIn), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {log.workType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.clockIn ? format(new Date(log.clockIn), "HH:mm") : "-"}
                  </TableCell>
                  <TableCell>
                    {log.clockOut
                      ? format(new Date(log.clockOut), "HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px]">
                    <ActivityCell
                      text={log.activities || ""}
                      title="Activities"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        log.clockOut
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100",
                      )}
                    >
                      {log.clockOut ? "Completed" : "Active"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
