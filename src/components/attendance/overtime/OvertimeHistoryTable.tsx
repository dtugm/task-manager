import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Loader2,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { OvertimeRequest, OvertimeStatus } from "@/types/overtime";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OvertimeHistoryTableProps {
  requests: OvertimeRequest[];
  loading: boolean;
  onEdit: (request: OvertimeRequest) => void;
  onDelete: (id: string) => void;
}

export function OvertimeHistoryTable({
  requests,
  loading,
  onEdit,
  onDelete,
}: OvertimeHistoryTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        No overtime requests found.
      </div>
    );
  }

  const getStatusBadge = (status: OvertimeStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex w-fit items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" /> Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex w-fit items-center gap-1"
          >
            <XCircle className="w-3 h-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex w-fit items-center gap-1"
          >
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>Approval Note</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const start = new Date(request.clockIn);
              const end = new Date(request.clockOut);

              return (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {format(start, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="text-slate-500">
                        In: {format(start, "HH:mm")}
                      </span>
                      <span className="text-slate-500">
                        Out: {format(end, "HH:mm")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate cursor-help">
                          {request.activities}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md break-words">
                        <p className="whitespace-pre-wrap">
                          {request.activities}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate cursor-help text-muted-foreground">
                          {request.approvalNote || "-"}
                        </div>
                      </TooltipTrigger>
                      {request.approvalNote && (
                        <TooltipContent className="max-w-md break-words">
                          <p className="whitespace-pre-wrap">
                            {request.approvalNote}
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    {request.status === "PENDING" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => onEdit(request)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => onDelete(request.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
