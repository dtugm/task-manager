"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Camera, ImageOff, RefreshCcw, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CameraCaptureDialog } from "./CameraCaptureDialog";

interface PhotoCaptureProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  helperText?: string;
  fileNamePrefix?: string;
}

export function PhotoCapture({
  label,
  value,
  onChange,
  disabled,
  helperText,
  fileNamePrefix,
}: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  }, []);

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

  const openCamera = () => {
    if (disabled) return;
    setCameraOpen(true);
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
        capture={isMobile ? "environment" : undefined}
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
            <div className="flex flex-wrap gap-2">
              {isMobile ? (
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
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openCamera}
                    disabled={disabled}
                  >
                    <Camera className="mr-1 h-4 w-4" />
                    Retake
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={openPicker}
                    disabled={disabled}
                  >
                    <Upload className="mr-1 h-4 w-4" />
                    Upload
                  </Button>
                </>
              )}
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
      ) : isMobile ? (
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
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <Camera className="h-7 w-7" />
          <span className="text-sm font-medium">Take photo</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={openCamera}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed",
              "border-slate-300/60 dark:border-slate-700/60 bg-white/30 dark:bg-slate-900/30",
              "py-8 text-slate-600 dark:text-slate-400 transition-colors",
              !disabled &&
                "hover:border-blue-400/70 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 hover:text-blue-700 dark:hover:text-blue-300",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <Camera className="h-7 w-7" />
            <span className="text-sm font-medium">Take photo</span>
          </button>
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed",
              "border-slate-300/60 dark:border-slate-700/60 bg-white/30 dark:bg-slate-900/30",
              "py-8 text-slate-600 dark:text-slate-400 transition-colors",
              !disabled &&
                "hover:border-indigo-400/70 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 hover:text-indigo-700 dark:hover:text-indigo-300",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <Upload className="h-7 w-7" />
            <span className="text-sm font-medium">Upload</span>
          </button>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-500">
        {helperText ??
          "Optional. Will be resized and timestamped automatically."}
      </p>

      <CameraCaptureDialog
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(file) => onChange(file)}
        fileNamePrefix={fileNamePrefix}
      />
    </div>
  );
}
