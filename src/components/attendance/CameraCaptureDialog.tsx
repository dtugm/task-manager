"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Loader2, RefreshCcw, Check, AlertCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface CameraCaptureDialogProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  fileNamePrefix?: string;
}

type CameraState = "loading" | "streaming" | "review" | "error";

export function CameraCaptureDialog({
  open,
  onClose,
  onCapture,
  fileNamePrefix,
}: CameraCaptureDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [reviewBlob, setReviewBlob] = useState<Blob | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startStream = useCallback(async () => {
    setState("loading");
    setErrorMessage("");
    // getUserMedia requires a secure context (HTTPS or localhost).
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setErrorMessage(
        "Camera is not available in this browser. Please use upload instead.",
      );
      setState("error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState("streaming");
    } catch (err) {
      const message =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Camera permission was denied. Please allow access or use upload instead."
          : "Could not access the camera. Please use upload instead.";
      setErrorMessage(message);
      setState("error");
    }
  }, []);

  useEffect(() => {
    if (!open) {
      stopStream();
      if (reviewUrl) {
        URL.revokeObjectURL(reviewUrl);
      }
      setReviewUrl(null);
      setReviewBlob(null);
      return;
    }
    void startStream();
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (reviewUrl) {
        URL.revokeObjectURL(reviewUrl);
      }
    };
  }, [reviewUrl]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setReviewBlob(blob);
        setReviewUrl(url);
        setState("review");
        stopStream();
      },
      "image/jpeg",
      0.85,
    );
  };

  const handleRetake = () => {
    if (reviewUrl) {
      URL.revokeObjectURL(reviewUrl);
    }
    setReviewUrl(null);
    setReviewBlob(null);
    void startStream();
  };

  const handleUsePhoto = () => {
    if (!reviewBlob) return;
    const name = `${fileNamePrefix ?? "photo"}-${Date.now()}.jpg`;
    const file = new File([reviewBlob], name, { type: "image/jpeg" });
    onCapture(file);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Take a photo
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          {state === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">Starting camera...</span>
            </div>
          )}

          {state === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-white">
              <AlertCircle className="h-8 w-8 text-amber-300" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover -scale-x-100 ${
              state === "streaming" ? "block" : "hidden"
            }`}
          />

          {state === "review" && reviewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reviewUrl}
              alt="Captured photo preview"
              className="h-full w-full object-contain"
            />
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          {state === "streaming" && (
            <Button type="button" onClick={handleCapture}>
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          )}

          {state === "review" && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleRetake}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button type="button" onClick={handleUsePhoto}>
                <Check className="mr-2 h-4 w-4" />
                Use photo
              </Button>
            </div>
          )}

          {state === "error" && (
            <Button type="button" variant="outline" onClick={startStream}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
