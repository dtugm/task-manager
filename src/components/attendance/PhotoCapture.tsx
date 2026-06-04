"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Camera, ImageOff, RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PhotoCaptureProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  helperText?: string;
}

export function PhotoCapture({
  label,
  value,
  onChange,
  disabled,
  helperText,
}: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      return undefined;
    }
    const url = URL.createObjectURL(value);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [value]);

  const previewUrl = value ? objectUrl : null;

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    e.target.value = "";
  };

  const sizeKb = value ? Math.max(1, Math.round(value.size / 1024)) : 0;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </Label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-white/30 dark:border-slate-700/50 bg-black/5 dark:bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Attendance photo preview"
            className="max-h-72 w-full object-contain"
          />
          <div className="flex items-center justify-between gap-2 p-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {sizeKb} KB
              {value?.name ? ` · ${value.name}` : ""}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openPicker}
                disabled={disabled}
              >
                <RefreshCcw className="mr-1 h-4 w-4" />
                Retake
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
                disabled={disabled}
              >
                <ImageOff className="mr-1 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed",
            "border-slate-300/60 dark:border-slate-700/60 bg-white/30 dark:bg-slate-900/30",
            "py-8 text-slate-600 dark:text-slate-400 transition-colors",
            !disabled &&
              "hover:border-blue-400/70 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 hover:text-blue-700 dark:hover:text-blue-300",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Camera className="h-7 w-7" />
          <span className="text-sm font-medium">Take photo</span>
        </button>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-500">
        {helperText ??
          "Optional. Will be resized and timestamped automatically."}
      </p>
    </div>
  );
}
