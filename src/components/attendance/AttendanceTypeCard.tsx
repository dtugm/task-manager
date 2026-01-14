import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AttendanceTypeCardProps {
  id: string;
  label: string;
  displayLabel: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  gradient: string;
  border: string;
  disabled: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function AttendanceTypeCard({
  id,
  label,
  displayLabel,
  icon: Icon,
  color,
  bg,
  gradient,
  border,
  disabled,
  isSelected,
  onSelect,
}: AttendanceTypeCardProps) {
  return (
    <button
      onClick={() => !disabled && onSelect()}
      disabled={disabled}
      title={disabled ? "You are not within office range" : ""}
      className={cn(
        "relative group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 h-32 overflow-hidden",
        isSelected
          ? "border-blue-500/50 shadow-lg shadow-blue-500/20"
          : "bg-white/40 dark:bg-slate-800/40 border-white/20 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-800/60",
        disabled && "opacity-50 cursor-not-allowed grayscale"
      )}
    >
      {isSelected && !disabled && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-20",
            gradient
          )}
        />
      )}
      <div
        className={cn(
          "p-3 rounded-xl transition-colors duration-300",
          isSelected && !disabled
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110"
            : cn(
                "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-110",
                color
              )
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          isSelected && !disabled
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-600 dark:text-slate-300"
        )}
      >
        {displayLabel}
      </span>
    </button>
  );
}
