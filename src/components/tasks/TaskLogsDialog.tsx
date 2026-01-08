import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, User, Send, MessageSquare } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { taskApi } from "@/lib/task-api";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TaskLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
}

export function TaskLogsDialog({
  open,
  onOpenChange,
  taskId,
  taskTitle,
}: TaskLogsDialogProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    if (!taskId) return;
    setIsLoading(true);
    setError(null);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    try {
      const response = await taskApi.getTaskLogs(token, taskId);
      if (response.success && Array.isArray(response.data)) {
        setLogs(response.data);
      } else {
        if (response.success && (response as any).data?.logs) {
          setLogs((response as any).data.logs);
        } else {
          setLogs([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setError("Failed to load activity logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && taskId) {
      fetchLogs();
    }
  }, [open, taskId]);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current && open) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, open, isLoading]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    try {
      await taskApi.addComment(token, taskId, { comment: newComment });
      setNewComment("");
      // Refresh logs to show new comment
      await fetchLogs();
    } catch (e) {
      console.error("Failed to add comment", e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl flex flex-col h-[600px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle>Activity & Comments</DialogTitle>
          <DialogDescription>
            History for: <span className="font-semibold">{taskTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              No activity recorded yet.
            </div>
          ) : (
            <div className="space-y-6">
              {logs.map((log, index) => {
                const renderChanges = () => {
                  if (log.action === "COMMENT_ADDED") {
                    return (
                      <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-indigo-500" />
                        <span className="italic">
                          "
                          {log.comment ||
                            JSON.parse(log.changes || "{}").comment}
                          "
                        </span>
                      </div>
                    );
                  }

                  let parsedChanges = null;
                  try {
                    parsedChanges = log.changes
                      ? JSON.parse(log.changes)
                      : null;
                  } catch (e) {
                    parsedChanges = log.changes;
                  }

                  switch (log.action) {
                    case "CREATED":
                      return (
                        <span className="text-slate-600 dark:text-slate-400">
                          Task created
                        </span>
                      );
                    case "UPDATED":
                      if (parsedChanges?.progress) {
                        return (
                          <span>
                            Progress updated:{" "}
                            <span className="font-semibold">
                              {parsedChanges.progress.from}%
                            </span>{" "}
                            →{" "}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {parsedChanges.progress.to}%
                            </span>
                          </span>
                        );
                      }
                      return <span>Task updated</span>;
                    case "STATUS_CHANGED":
                      if (parsedChanges?.status) {
                        return (
                          <span>
                            Status changed:{" "}
                            <span className="font-medium">
                              {parsedChanges.status.from?.replace(/_/g, " ")}
                            </span>{" "}
                            →{" "}
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {parsedChanges.status.to?.replace(/_/g, " ")}
                            </span>
                          </span>
                        );
                      }
                      return <span>Status changed</span>;
                    case "REJECTED":
                      return (
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Task Rejected. Reason: "
                          {parsedChanges?.reason || "No reason provided"}"
                        </span>
                      );
                    case "APPROVED":
                      return (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Task Approved
                        </span>
                      );
                    default:
                      return (
                        <span className="text-slate-500">
                          <span className="font-medium mr-1 uppercase text-xs">
                            {log.action}:
                          </span>
                          {typeof parsedChanges === "object"
                            ? JSON.stringify(parsedChanges)
                            : log.message || ""}
                        </span>
                      );
                  }
                };

                return (
                  <div key={index} className="flex gap-4 relative group">
                    {/* Timeline Line */}
                    {index !== logs.length - 1 && (
                      <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                    )}

                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm z-10">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {log.user?.fullName ||
                            log.user?.username ||
                            "Unknown User"}
                        </span>
                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {log.createdAt
                            ? format(new Date(log.createdAt), "MMM d, h:mm a")
                            : "Unknown Date"}
                        </span>
                      </div>

                      <div className="text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
                        {renderChanges()}

                        {log.comment && log.action !== "COMMENT_ADDED" && (
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/50 italic text-slate-500 text-xs">
                            "{log.comment}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-2">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-[80px] resize-none bg-white dark:bg-slate-800"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              size="icon"
              className="h-[80px] w-[80px] shrink-0"
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmittingComment}
            >
              {isSubmittingComment ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
