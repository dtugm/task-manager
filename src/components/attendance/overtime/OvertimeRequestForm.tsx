import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle } from "lucide-react";
import { CreateOvertimePayload } from "@/types/overtime";
import { useState } from "react";

interface OvertimeRequestFormProps {
  onSubmit: (payload: CreateOvertimePayload) => Promise<void>;
  isLoading: boolean;
}

export function OvertimeRequestForm({
  onSubmit,
  isLoading,
}: OvertimeRequestFormProps) {
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [activities, setActivities] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clockIn || !clockOut || !activities) return;

    await onSubmit({
      clockIn: new Date(clockIn).toISOString(),
      clockOut: new Date(clockOut).toISOString(),
      activities,
    });

    // Reset form after successful submission
    setClockIn("");
    setClockOut("");
    setActivities("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clockIn">Clock In</Label>
          <Input
            id="clockIn"
            type="datetime-local"
            value={clockIn}
            onChange={(e) => setClockIn(e.target.value)}
            required
            className="bg-white/50 dark:bg-slate-900/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clockOut">Clock Out</Label>
          <Input
            id="clockOut"
            type="datetime-local"
            value={clockOut}
            onChange={(e) => setClockOut(e.target.value)}
            required
            className="bg-white/50 dark:bg-slate-900/50"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="activities">Activities</Label>
        <Textarea
          id="activities"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          placeholder="Describe your overtime activities..."
          required
          className="bg-white/50 dark:bg-slate-900/50 min-h-[100px]"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !clockIn || !clockOut || !activities}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Overtime Request
          </>
        )}
      </Button>
    </form>
  );
}
