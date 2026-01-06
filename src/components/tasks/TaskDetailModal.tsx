"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/task";
import { useState, useEffect } from "react";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { taskApi } from "@/lib/task-api";
import { useLanguage } from "@/contexts/language-context";

// Simple toast fallback if not available
const showToast = (message: string, type: "success" | "error" = "success") => {
  // Check if toast exists in window or context, otherwise console
  console.log(`[${type.toUpperCase()}] ${message}`);
};
// Actually, let's just use console or simple state feedback for now as I don't see sonner setup explicitly in my context (though it's common).
// I'll assume basic feedback.

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
}: TaskDetailModalProps) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Initialize progress when task changes
  useEffect(() => {
    if (task) {
      setProgress(task.progress || 0);
      setComment("");
    }
    if (task && isOpen) {
      fetchLogs();
    }
  }, [task, isOpen]);

  const fetchLogs = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token || !task) return;

    setIsLoadingLogs(true);
    try {
      const response = await taskApi.getTaskLogs(token, task.id);
      if (response.success && Array.isArray(response.data)) {
        setLogs(response.data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  if (!task) return null;

  const handleSaveProgress = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsSavingProgress(true);
    try {
      // Determine status based on progress
      let status = "PENDING";
      if (progress === 100) status = "COMPLETED";
      else if (progress > 0) status = "IN_PROGRESS";

      const response = await taskApi.updateTask(token, task.id, {
        progress,
      });

      if (response.success) {
        onUpdate();
        showToast(t.progressUpdated);
      }
    } catch (err) {
      console.error("Failed to update progress", err);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleSendComment = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token || !comment.trim()) return;

    setIsSendingComment(true);
    try {
      const response = await taskApi.addComment(token, task.id, {
        comment: comment.trim(),
      });

      if (response.success) {
        setComment("");
        showToast(t.commentAdded);
        fetchLogs();
        // Maybe onUpdate to refresh? Comments might strictly not need it unless we show them.
      }
    } catch (err) {
      console.error("Failed to send comment", err);
    } finally {
      setIsSendingComment(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-bold">
            {t.description}
          </DialogTitle>
          {/* Close button is automatic in DialogContent usually via X icon */}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Section */}
          <div>
            <h2 className="text-2xl font-bold mb-1">{task.title}</h2>
            <p className="text-muted-foreground">{task.description}</p>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className={
                task.priority === "HIGH"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "MEDIUM"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }
            >
              {task.priority || "MEDIUM"}
            </Badge>
            <Badge
              variant="secondary"
              className={
                task.progress === 100
                  ? "bg-green-100 text-green-700"
                  : task.progress > 0
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }
            >
              {task.progress === 100
                ? t.completed
                : task.progress > 0
                ? t.inProgress
                : t.pending}
            </Badge>
            {task.project && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                {task.project.name}
              </Badge>
            )}
            {task.points && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-700"
              >
                {task.points} {t.totalPoints.split(" ")[1]}
              </Badge>
            )}
          </div>

          {/* Update Progress Section */}
          <div className="bg-blue-50/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <TrendingUpIcon className="h-4 w-4" />
              {t.updateProgress}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t.slideToSetProgress}
                </span>
                <span className="font-bold text-lg">{progress}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
                style={{
                  background: `linear-gradient(to right, #2563eb ${progress}%, #e5e7eb ${progress}%)`,
                }}
              />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSaveProgress}
              disabled={isSavingProgress}
            >
              {isSavingProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.save}...
                </>
              ) : (
                <>
                  <TrendingUpIcon className="mr-2 h-4 w-4" />
                  {t.saveProgress}
                </>
              )}
            </Button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-muted/20 rounded-xl">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                {t.assignedBy}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                  {getInitials(task.creator?.fullName || "A")}
                </div>
                <span className="font-medium text-sm">
                  {task.creator?.fullName || "Admin"}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                {t.date}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-medium text-sm">
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Logs Section */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4 border">
            <div className="flex items-center gap-2 text-gray-700 font-medium border-b pb-2">
              <MessageSquare className="h-4 w-4" />
              {t.activityLogs}
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {isLoadingLogs ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : logs.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  {t.noLogs}
                </p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {getInitials(log.user?.fullName || "System")}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {log.user?.fullName || "System"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {log.action === "COMMENT" ||
                        log.action === "COMMENT_ADDED" ? (
                          <span className="italic">
                            "
                            {log.comment ||
                              log.details?.comment ||
                              "No content"}
                            "
                          </span>
                        ) : (
                          <span>
                            {log.action?.replace(/_/g, " ") || "Action"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Response Section */}
          <div className="space-y-3 pt-2">
            <Label className="text-sm font-medium">{t.addComment}</Label>
            <div className="relative">
              <Textarea
                placeholder={t.writeComment}
                className="min-h-[100px] resize-none pr-10"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-slate-600 hover:bg-slate-700 text-white"
              onClick={handleSendComment}
              disabled={isSendingComment || !comment.trim()}
            >
              {isSendingComment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.sending}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t.sendComment}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper icons and utils
function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
