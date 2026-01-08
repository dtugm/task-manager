"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/task";
import { useState, useEffect, useRef } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { taskApi } from "@/lib/task-api";
import { useLanguage } from "@/contexts/language-context";

interface ProjectTaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectTaskDetailModal({
  task,
  isOpen,
  onClose,
}: ProjectTaskDetailModalProps) {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Initialize and fetch logs when task changes or modal opens
  useEffect(() => {
    if (task && isOpen) {
      fetchLogs();
    }
  }, [task, isOpen]);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (logsEndRef.current && isOpen) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen, isLoadingLogs]);

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-200/50 pb-4">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {t.description}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Section */}
          <div>
            <h2 className="text-2xl font-bold mb-1 text-slate-800 dark:text-slate-100">
              {task.title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {task.description}
            </p>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`
                border-0 rounded-lg px-2.5 py-1 font-medium
                ${
                  task.priority === "HIGH"
                    ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                    : task.priority === "MEDIUM"
                    ? "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                    : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                }
              `}
            >
              {task.priority || "MEDIUM"}
            </Badge>
            <Badge
              variant="outline"
              className={`
                border-0 rounded-lg px-2.5 py-1 font-medium
                ${
                  task.progress === 100
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : task.progress > 0
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }
              `}
            >
              {task.progress === 100
                ? t.completed
                : task.progress > 0
                ? t.inProgress
                : t.pending}
            </Badge>
            {task.project && (
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-0 rounded-lg px-2.5 py-1 font-medium"
              >
                {task.project.name}
              </Badge>
            )}
            {task.points && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border-0 rounded-lg px-2.5 py-1 font-medium"
              >
                {task.points} {t.totalPoints.split(" ")[1]}
              </Badge>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <Label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                {t.assignedBy}
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-300 shadow-sm border border-purple-200 dark:border-purple-800/30">
                  {getInitials(task.creator?.fullName || "A")}
                </div>
                <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                  {task.creator?.fullName || "Admin"}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                Assigned To
              </Label>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {task.assignees && task.assignees.length > 0 ? (
                  task.assignees.map((assignee, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800/30">
                        {getInitials(assignee.assignee.fullName)}
                      </div>
                      <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                        {assignee.assignee.fullName}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 italic">
                    Unassigned
                  </span>
                )}
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                {t.date}
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
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
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
              <MessageSquare className="h-4 w-4" />
              {t.activityLogs}
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingLogs ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : logs.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-4 italic">
                  {t.noLogs}
                </p>
              ) : (
                <div className="space-y-4">
                  {logs.map((log, index) => {
                    const renderChanges = () => {
                      if (
                        log.action === "COMMENT" ||
                        log.action === "COMMENT_ADDED"
                      ) {
                        return (
                          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                            <MessageSquare className="h-4 w-4 mt-0.5 text-indigo-500" />
                            <span className="italic">
                              "
                              {log.comment ||
                                JSON.parse(log.changes || "{}").comment ||
                                ""}
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
                                  {parsedChanges.status.from?.replace(
                                    /_/g,
                                    " "
                                  )}
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
                      <div key={index} className="flex gap-3 text-sm group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800/30">
                          {getInitials(log.user?.fullName || "System")}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {log.user?.fullName || "System"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {log.createdAt
                                ? format(new Date(log.createdAt), "MMM d, p")
                                : "Unknown Date"}
                            </span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm">
                            {renderChanges()}
                            {log.comment &&
                              !["COMMENT", "COMMENT_ADDED"].includes(
                                log.action
                              ) && (
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
