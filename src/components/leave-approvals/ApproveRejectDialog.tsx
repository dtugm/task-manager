import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { LeaveRequest } from "@/types/leave";

interface ApproveRejectDialogProps {
  leave: LeaveRequest | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  actionType: "APPROVED" | "REJECTED" | null;
  approvalNote: string;
  setApprovalNote: (note: string) => void;
}

export function ApproveRejectDialog({
  leave,
  open,
  onClose,
  onConfirm,
  isLoading,
  actionType,
  approvalNote,
  setApprovalNote,
}: ApproveRejectDialogProps) {
  if (!leave || !actionType) return null;

  const isApprove = actionType === "APPROVED";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {isApprove ? "Approve" : "Reject"} Leave Request
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? "Approve this leave request and add an optional note."
              : "Reject this leave request. Please provide a reason."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Leave Request Details */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Requester
              </span>
              <span className="text-sm text-slate-900 dark:text-white font-semibold">
                {leave.requester?.fullName || "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Type
              </span>
              <Badge variant="outline" className="capitalize">
                {leave.type}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Period
              </span>
              <span className="text-sm text-slate-900 dark:text-white">
                {format(new Date(leave.startDate), "MMM d")} -{" "}
                {format(new Date(leave.endDate), "MMM d, yyyy")}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Reason
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {leave.requestReason}
              </p>
            </div>
          </div>

          {/* Approval Note */}
          <div className="space-y-2">
            <Label htmlFor="approvalNote">
              {isApprove ? "Approval Note (Optional)" : "Rejection Reason"}
            </Label>
            <Textarea
              id="approvalNote"
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              placeholder={
                isApprove
                  ? "Add a note for the requester..."
                  : "Please provide a reason for rejection..."
              }
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await onConfirm();
            }}
            disabled={isLoading || (!isApprove && !approvalNote.trim())}
            className={
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isApprove ? (
                  <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                {isApprove ? "Approve" : "Reject"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
