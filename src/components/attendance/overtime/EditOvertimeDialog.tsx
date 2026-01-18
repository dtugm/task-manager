import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { OvertimeRequest, UpdateOvertimePayload } from "@/types/overtime";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface EditOvertimeDialogProps {
  open: boolean;
  onClose: () => void;
  request: OvertimeRequest | null;
  onUpdate: (id: string, payload: UpdateOvertimePayload) => Promise<void>;
  isLoading: boolean;
}

export function EditOvertimeDialog({
  open,
  onClose,
  request,
  onUpdate,
  isLoading,
}: EditOvertimeDialogProps) {
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [activities, setActivities] = useState("");

  useEffect(() => {
    if (request) {
      // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
      const formatDateForInput = (dateStr: string) => {
        const date = new Date(dateStr);
        return format(date, "yyyy-MM-dd'T'HH:mm");
      };

      setClockIn(formatDateForInput(request.clockIn));
      setClockOut(formatDateForInput(request.clockOut));
      setActivities(request.activities);
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !clockIn || !clockOut || !activities) return;

    await onUpdate(request.id, {
      clockIn: new Date(clockIn).toISOString(),
      clockOut: new Date(clockOut).toISOString(),
      activities,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Overtime Request</DialogTitle>
          <DialogDescription>
            Update the details of your overtime request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-clockIn">Clock In</Label>
              <Input
                id="edit-clockIn"
                type="datetime-local"
                value={clockIn}
                onChange={(e) => setClockIn(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-clockOut">Clock Out</Label>
              <Input
                id="edit-clockOut"
                type="datetime-local"
                value={clockOut}
                onChange={(e) => setClockOut(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-activities">Activities</Label>
            <Textarea
              id="edit-activities"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="Describe activities..."
              required
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
