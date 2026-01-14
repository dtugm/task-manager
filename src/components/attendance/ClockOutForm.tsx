import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ClockOutFormProps {
  activities: string;
  onActivitiesChange: (value: string) => void;
  onClockOut: () => void;
  isLoading: boolean;
}

export function ClockOutForm({
  activities,
  onActivitiesChange,
  onClockOut,
  isLoading,
}: ClockOutFormProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Today's Activities
        </Label>
        <Textarea
          value={activities}
          onChange={(e) => onActivitiesChange(e.target.value)}
          placeholder="Describe what you worked on today..."
          className="resize-none h-32 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-500/30"
        />
      </div>
      <Button
        onClick={onClockOut}
        disabled={isLoading || !activities.trim()}
        className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/30 transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Clocking Out...
          </>
        ) : (
          "Clock Out"
        )}
      </Button>
    </div>
  );
}
