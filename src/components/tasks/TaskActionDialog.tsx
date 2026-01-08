"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";

interface TaskActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionType: "approve" | "reject" | "ask_approval";
  onConfirm: (reason?: string) => void;
  isSubmitting: boolean;
}

export function TaskActionDialog({
  open,
  onOpenChange,
  title,
  description,
  actionType,
  onConfirm,
  isSubmitting,
}: TaskActionDialogProps) {
  const { t } = useLanguage();
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            {actionType === "approve" ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : actionType === "reject" ? (
              <XCircle className="h-6 w-6 text-red-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            )}
          </div>
          <DialogTitle className="text-center text-xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        {actionType === "reject" && (
          <div className="py-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Reason for rejection
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason..."
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 rounded-xl resize-none"
              rows={3}
            />
          </div>
        )}

        <DialogFooter className="sm:justify-center gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-xl border-slate-200"
          >
            {t.cancel}
          </Button>
          <Button
            variant={actionType === "reject" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={
              isSubmitting || (actionType === "reject" && !reason.trim())
            }
            className={`rounded-xl ${
              actionType === "approve"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : actionType === "ask_approval"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.processing}
              </>
            ) : actionType === "approve" ? (
              t.approve
            ) : actionType === "reject" ? (
              t.reject
            ) : (
              t.confirm
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
