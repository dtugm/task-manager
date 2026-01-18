import { Button } from "@/components/ui/button";
import { Loader2, Play, Pause } from "lucide-react";

interface PauseControlsProps {
  isLoading: boolean;
  isPaused: boolean; // Derived from whether the last pause has no end date or custom logic
  onStartPause: () => void;
  onResumePause: () => void;
  disabled: boolean;
}

export function PauseControls({
  isLoading,
  isPaused,
  onStartPause,
  onResumePause,
  disabled,
}: PauseControlsProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/30 animate-in fade-in slide-in-from-top-2">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
        {isPaused ? "You are currently on pause" : "Need a break?"}
      </h3>

      {isPaused ? (
        <Button
          size="lg"
          onClick={onResumePause}
          disabled={isLoading || disabled}
          className="w-full md:w-auto min-w-[200px] h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/20 rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Resuming...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Resume Work
            </>
          )}
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={onStartPause}
          disabled={isLoading || disabled}
          className="w-full md:w-auto min-w-[200px] h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/20 rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Puasing...
            </>
          ) : (
            <>
              <Pause className="mr-2 h-5 w-5" />
              Start Pause
            </>
          )}
        </Button>
      )}
    </div>
  );
}
