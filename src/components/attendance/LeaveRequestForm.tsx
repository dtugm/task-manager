import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface LeaveRequestFormProps {
  startDate: string;
  endDate: string;
  reason: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function LeaveRequestForm({
  startDate,
  endDate,
  reason,
  onStartDateChange,
  onEndDateChange,
  onReasonChange,
  onSubmit,
  isLoading,
}: LeaveRequestFormProps) {
  return (
    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl border border-white/20 dark:border-slate-700/30">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Start Date
          </Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-500/30"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            End Date
          </Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-500/30"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Reason
        </Label>
        <Textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Please provide a reason for your leave request..."
          className="resize-none h-24 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-500/30"
        />
      </div>
    </div>
  );
}
