import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Pencil } from "lucide-react";
import type { LeaveRequest } from "@/types/leave";

interface EditManagerLeaveDialogProps {
  leave: LeaveRequest | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  editType: string;
  setEditType: (value: string) => void;
  editStartDate: string;
  setEditStartDate: (value: string) => void;
  editEndDate: string;
  setEditEndDate: (value: string) => void;
  editRequestReason: string;
  setEditRequestReason: (value: string) => void;
}

export function EditManagerLeaveDialog({
  leave,
  open,
  onClose,
  onConfirm,
  isLoading,
  editType,
  setEditType,
  editStartDate,
  setEditStartDate,
  editEndDate,
  setEditEndDate,
  editRequestReason,
  setEditRequestReason,
}: EditManagerLeaveDialogProps) {
  if (!leave) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-blue-600" />
            Edit Leave Request
          </DialogTitle>
          <DialogDescription>
            Update the leave request details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editType">Leave Type</Label>
              <Select value={editType} onValueChange={setEditType}>
                <SelectTrigger id="editType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SICK">Sick</SelectItem>
                  <SelectItem value="VACATION">Vacation</SelectItem>
                  <SelectItem value="ABSENT">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1" /> {/* Spacer */}
            <div className="space-y-2">
              <Label htmlFor="editStartDate">Start Date</Label>
              <Input
                id="editStartDate"
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEndDate">End Date</Label>
              <Input
                id="editEndDate"
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editReason">Reason</Label>
            <Textarea
              id="editReason"
              value={editRequestReason}
              onChange={(e) => setEditRequestReason(e.target.value)}
              placeholder="Enter reason for leave..."
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
            disabled={
              isLoading ||
              !editType ||
              !editStartDate ||
              !editEndDate ||
              !editRequestReason.trim()
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
