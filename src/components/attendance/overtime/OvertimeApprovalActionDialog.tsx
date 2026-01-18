"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { OvertimeRequest } from "@/types/overtime";
import { Loader2 } from "lucide-react";

interface OvertimeApprovalActionDialogProps {
  open: boolean;
  onClose: () => void;
  request: OvertimeRequest | null;
  action: "APPROVE" | "REJECT" | null;
  onConfirm: (
    id: string,
    status: "APPROVED" | "REJECTED",
    note: string
  ) => void;
  isLoading: boolean;
}

export function OvertimeApprovalActionDialog({
  open,
  onClose,
  request,
  action,
  onConfirm,
  isLoading,
}: OvertimeApprovalActionDialogProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) setNote("");
  }, [open]);

  if (!request || !action) return null;

  const isApprove = action === "APPROVE";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isApprove ? "Approve" : "Reject"} Overtime Request
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? "Are you sure you want to approve this overtime request?"
              : "Are you sure you want to reject this overtime request?"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Request Details</h4>
            <div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border">
              <p>
                <span className="font-semibold">Requester:</span>{" "}
                {request.requester?.fullName}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(request.clockIn)}
              </p>
              <p>
                <span className="font-semibold">Activities:</span>{" "}
                {request.activities}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">
              {isApprove
                ? "Approval Note (Optional)"
                : "Rejection Reason (Required)"}
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isApprove
                  ? "e.g. Approved for project deadline"
                  : "e.g. Not pre-approved"
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={isApprove ? "default" : "destructive"}
            onClick={() =>
              onConfirm(request.id, isApprove ? "APPROVED" : "REJECTED", note)
            }
            disabled={isLoading || (!isApprove && !note.trim())}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isApprove ? "Confirm Approval" : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
}
