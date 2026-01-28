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
import {
  Download,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { LeaveRequest } from "@/types/leave";
import { ActivityCell } from "@/components/attendance-log/ActivityCell";

interface ManagerLeaveTableProps {
  leaveRequests: LeaveRequest[];
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onApprove: (leave: LeaveRequest) => void;
  onReject: (leave: LeaveRequest) => void;
  onEdit: (leave: LeaveRequest) => void;
  onDelete: (id: string) => void;
  filterStatus: string;
  filterType: string;
  startDate: string;
  endDate: string;
  requesterFilter: string;
  onFilterStatusChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onRequesterFilterChange: (value: string) => void;
}

export function ManagerLeaveTable({
  leaveRequests,
  loading,
  onRefresh,
  onExport,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  filterStatus,
  filterType,
  startDate,
  endDate,
  requesterFilter,
  onFilterStatusChange,
  onFilterTypeChange,
  onStartDateChange,
  onEndDateChange,
  onRequesterFilterChange,
}: ManagerLeaveTableProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
            Leave Requests
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review and manage employee leave requests
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Requester</Label>
          <Input
            type="text"
            value={requesterFilter}
            onChange={(e) => onRequesterFilterChange(e.target.value)}
            placeholder="Search by name..."
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50"
          />
        </div>
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
          <Label className="text-xs mb-1.5 block">Status</Label>
          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Type</Label>
          <Select value={filterType} onValueChange={onFilterTypeChange}>
            <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="SICK">Sick</SelectItem>
              <SelectItem value="VACATION">Vacation</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onRequesterFilterChange("");
              onStartDateChange("");
              onEndDateChange("");
              onFilterStatusChange("all");
              onFilterTypeChange("all");
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
              <TableHead>Requester</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading leave requests...
                  </div>
                </TableCell>
              </TableRow>
            ) : leaveRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-slate-500"
                >
                  No leave requests found
                </TableCell>
              </TableRow>
            ) : (
              leaveRequests.map((leave) => (
                <TableRow
                  key={leave.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">
                    {leave.requester?.fullName || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {leave.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {format(new Date(leave.startDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {format(new Date(leave.endDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px]">
                    <ActivityCell
                      text={leave.requestReason}
                      title="Request Reason"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        leave.status === "APPROVED" &&
                          "bg-green-100 text-green-700 hover:bg-green-100",
                        leave.status === "PENDING" &&
                          "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
                        leave.status === "REJECTED" &&
                          "bg-red-100 text-red-700 hover:bg-red-100",
                      )}
                    >
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(leave)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(leave.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onApprove(leave)}
                        disabled={leave.status !== "PENDING"}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onReject(leave)}
                        disabled={leave.status !== "PENDING"}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
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
