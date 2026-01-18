"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OvertimeRequest } from "@/types/overtime";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OvertimeApprovalTableProps {
  requests: OvertimeRequest[];
  loading: boolean;
  onApprove: (request: OvertimeRequest) => void;
  onReject: (request: OvertimeRequest) => void;
}

export function OvertimeApprovalTable({
  requests,
  loading,
  onApprove,
  onReject,
}: OvertimeApprovalTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    }
  };

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-slate-500">
        <Clock className="w-6 h-6 animate-spin mr-2" />
        Loading requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">
          No overtime requests found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>Approval Note</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="text-slate-900 dark:text-slate-100">
                      {req.requester?.fullName || "Unknown"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {req.requester?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="text-slate-900 dark:text-slate-100">
                      {req.approver?.fullName || "-"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(req.clockIn), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>In: {format(new Date(req.clockIn), "HH:mm")}</div>
                    <div>Out: {format(new Date(req.clockOut), "HH:mm")}</div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate cursor-help">
                        {req.activities}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm break-words">
                      <p>{req.activities}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate cursor-help text-slate-500 italic">
                        {req.approvalNote || "-"}
                      </div>
                    </TooltipTrigger>
                    {req.approvalNote && (
                      <TooltipContent className="max-w-sm break-words">
                        <p>{req.approvalNote}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(req.status)} border shadow-sm`}
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {req.status === "PENDING" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={() => onApprove(req)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => onReject(req)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {/* Note is now in its own column, remove from here to avoid duplication if desired, or keep "No note" text if user wants interactions. User asked for columns. I'll remove the redundant text display in actions column to clean up. */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
