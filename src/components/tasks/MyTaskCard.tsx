"use client";

import { useLanguage } from "@/contexts/language-context";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Tag,
  Calendar as CalendarIcon,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { TaskActionDialog } from "./TaskActionDialog";
import { taskApi } from "@/lib/task-api";

interface MyTaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onUpdate?: () => void; // Add callback to refresh tasks
}

export function MyTaskCard({ task, onClick, onUpdate }: MyTaskCardProps) {
  const { t } = useLanguage();
  const [actionDialogState, setActionDialogState] = useState<{
    open: boolean;
    type: "approve" | "reject" | "ask_approval";
  }>({
    open: false,
    type: "ask_approval",
  });
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const handleActionClick = (
    e: React.MouseEvent,
    type: "approve" | "reject" | "ask_approval"
  ) => {
    e.stopPropagation();
    setActionDialogState({ open: true, type });
  };

  const handleActionConfirm = async (reason?: string) => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) return;

    setIsActionSubmitting(true);
    try {
      let response;
      if (actionDialogState.type === "ask_approval") {
        response = await taskApi.updateStatus(
          token,
          task.id,
          "PENDING_APPROVAL"
        );
      } else if (actionDialogState.type === "approve") {
        response = await taskApi.approveTask(token, task.id);
      } else if (actionDialogState.type === "reject") {
        response = await taskApi.rejectTask(token, task.id, reason || "");
      }

      if (response && (response.success || (response as any).status === 200)) {
        if (onUpdate) onUpdate();
        setActionDialogState((prev) => ({ ...prev, open: false }));
      }
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setIsActionSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
        onClick={() => onClick(task)}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:opacity-100 transition-opacity" />

        {/* Title and Badges */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex-1 mr-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
              {task.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
              {task.description}
            </p>
          </div>

          <div className="flex gap-2 flex-shrink-0 flex-col items-end">
            <Badge
              variant="outline"
              className={`
                border-0 rounded-lg px-2.5 py-0.5 font-semibold shadow-sm whitespace-nowrap uppercase tracking-wide
                ${
                  (task.quest || "main") === "main"
                    ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 ring-1 ring-inset ring-violet-600/20"
                    : "bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400 ring-1 ring-inset ring-slate-500/20"
                }
              `}
            >
              {(task.quest || "main") === "main" ? "Main Quest" : "Side Quest"}
            </Badge>
            <Badge
              variant="outline"
              className={`
                border-0 rounded-lg px-2.5 py-0.5 font-semibold shadow-sm whitespace-nowrap
                ${
                  task.priority === "HIGH"
                    ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-inset ring-red-600/20"
                    : task.priority === "MEDIUM"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20"
                }
              `}
            >
              {task.priority === "HIGH"
                ? t.high
                : task.priority === "MEDIUM"
                ? t.medium
                : t.low}
            </Badge>
            <Badge
              variant="outline"
              className={`
                border-0 rounded-lg px-2.5 py-0.5 font-semibold shadow-sm whitespace-nowrap
                ${
                  task.status === "ACCEPTED"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 ring-1 ring-inset ring-green-600/20"
                    : task.status === "REJECTED"
                    ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-inset ring-red-600/20"
                    : task.status === "PENDING_APPROVAL"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20"
                    : task.progress === 100
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20"
                    : task.progress > 0
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 ring-1 ring-inset ring-indigo-600/20"
                    : "bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400 ring-1 ring-inset ring-slate-500/20"
                }
              `}
            >
              {task.status === "ACCEPTED"
                ? t.accepted
                : task.status === "REJECTED"
                ? t.rejected
                : task.status === "PENDING_APPROVAL"
                ? t.pendingApproval
                : task.progress === 100
                ? t.completed
                : task.progress > 0
                ? t.inProgress
                : t.pending}
            </Badge>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6 bg-white/30 dark:bg-slate-800/30 p-3 rounded-xl border border-white/10 w-fit">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5" />
            <span>
              {t.from}:{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {task.creator?.fullName || "Manager"}
              </span>
            </span>
          </div>
          <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-600/50" />
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5" />
            <span>{task.project?.name || t.project}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-600/50" />
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          {task.points && (
            <>
              <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-600/50" />
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium">
                <Award className="h-3.5 w-3.5" />
                <span>
                  {task.points} {t.points}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Progress and Actions */}
        <div className="flex items-end justify-between gap-4 relative z-10">
          <div className="space-y-2 flex-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wide uppercase">
                <TrendingUp className="h-3.5 w-3.5" />
                {t.progress}
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {task.progress}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {/* Ask Approval Button when Completed */}
            {task.progress === 100 &&
              task.status !== "PENDING_APPROVAL" &&
              task.status !== "ACCEPTED" && (
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  onClick={(e) => handleActionClick(e, "ask_approval")}
                >
                  {t.askApproval}
                </Button>
              )}

            {/* Default arrow if no actions */}
            {task.progress !== 100 && task.status !== "PENDING_APPROVAL" && (
              <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskActionDialog
        open={actionDialogState.open}
        onOpenChange={(open) =>
          setActionDialogState((prev) => ({ ...prev, open }))
        }
        title={
          actionDialogState.type === "approve"
            ? t.approveTask
            : actionDialogState.type === "reject"
            ? t.rejectTask
            : t.askApproval
        }
        description={
          actionDialogState.type === "approve"
            ? `Are you sure you want to approve "${task.title}"?`
            : actionDialogState.type === "reject"
            ? `Are you sure you want to reject "${task.title}"?`
            : `Are you sure you want to ask approval for "${task.title}"?`
        }
        actionType={actionDialogState.type}
        onConfirm={handleActionConfirm}
        isSubmitting={isActionSubmitting}
      />
    </>
  );
}
