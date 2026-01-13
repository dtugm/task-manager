"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tag,
  TrendingUp,
  Calendar as CalendarIcon,
  User,
  ChevronDown,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { Task } from "@/types/task";
import { useLanguage } from "@/contexts/language-context";
import { CreateRelatedTaskModal } from "@/components/tasks/CreateRelatedTaskModal";
import { useState } from "react";
import { TaskActionDialog } from "@/components/tasks/TaskActionDialog";
import { taskApi } from "@/lib/task-api";

interface ExecutiveTaskCardProps {
  task: Task;
  expandedTasks: Set<string>;
  toggleExpand: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  fetchTasks: () => void;
  deleteMode: boolean;
  targetRole?: "Supervisor" | "Employee";
  userRole?: "Executive" | "Manager" | "Supervisor";
}

export function ExecutiveTaskCard({
  task,
  expandedTasks,
  toggleExpand,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  fetchTasks,
  deleteMode,
  targetRole,
  userRole,
}: ExecutiveTaskCardProps) {
  const { t } = useLanguage();
  const [actionDialogState, setActionDialogState] = useState<{
    open: boolean;
    type: "approve" | "reject" | "ask_approval";
    taskId: string;
    taskTitle: string;
  }>({
    open: false,
    type: "ask_approval",
    taskId: "",
    taskTitle: "",
  });
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  // Helper to open dialog
  const openActionDialog = (
    type: "approve" | "reject" | "ask_approval",
    taskId: string,
    taskTitle: string
  ) => {
    setActionDialogState({
      open: true,
      type,
      taskId,
      taskTitle,
    });
  };

  const handleActionConfirm = async (reason?: string) => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token || !actionDialogState.taskId) return;

    setIsActionSubmitting(true);
    try {
      let response;
      if (actionDialogState.type === "ask_approval") {
        response = await taskApi.updateStatus(
          token,
          actionDialogState.taskId,
          "PENDING_APPROVAL"
        );
      } else if (actionDialogState.type === "approve") {
        response = await taskApi.approveTask(token, actionDialogState.taskId);
      } else if (actionDialogState.type === "reject") {
        response = await taskApi.rejectTask(
          token,
          actionDialogState.taskId,
          reason || ""
        );
      }

      if (response && (response.success || (response as any).status === 200)) {
        fetchTasks();
        setActionDialogState((prev) => ({ ...prev, open: false }));
      } else {
        console.error("Action failed", response);
      }
    } catch (err) {
      console.error("Action error", err);
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const renderApprovalButtons = (taskItem: Task, isChild: boolean) => {
    // 0. If task is already ACCEPTED, no buttons needed
    if (taskItem.status === "ACCEPTED") return null;

    // Buttons JSX

    const ApproveButton = () => (
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs border-green-500 text-green-600 hover:bg-green-50"
        onClick={(e) => {
          e.stopPropagation();
          openActionDialog("approve", taskItem.id, taskItem.title);
        }}
      >
        {t.approve}
      </Button>
    );

    const RejectButton = () => (
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs border-red-500 text-red-600 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation();
          openActionDialog("reject", taskItem.id, taskItem.title);
        }}
      >
        {t.reject}
      </Button>
    );

    // 1. PENDING_APPROVAL -> Show ONLY Approve and Reject
    if (taskItem.status === "PENDING_APPROVAL") {
      if (
        userRole === "Executive" ||
        (userRole === "Supervisor" && isChild) ||
        (userRole === "Manager" && isChild)
      ) {
        return (
          <div className="flex gap-1 mt-2 justify-end">
            <ApproveButton />
            <RejectButton />
          </div>
        );
      }
    }

    return null;
  };

  const formatDescription = (text: string) => {
    if (!text) return "";
    const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const href = part.startsWith("www.") ? `http://${part}` : part;
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline z-50 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <>
      <div
        className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
        onClick={() => onSelectTask(task)}
      >
        {/* Title and Badges */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {task.title}
              </h3>
              {deleteMode && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 break-words">
              {formatDescription(task.description)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:ml-4">
            <Badge
              variant="outline"
              className={`
                border-0 rounded-lg px-2.5 py-0.5 font-semibold shadow-sm
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
                border-0 rounded-lg px-2.5 py-0.5 font-semibold shadow-sm
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

            {userRole !== "Supervisor" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* From, Project, Due Date */}
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6 bg-white/30 dark:bg-slate-800/30 p-3 rounded-xl border border-white/10 w-fit max-w-full">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5" />
            <span>
              {t.assignedTo}:{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {task.assignees && task.assignees.length > 0
                  ? task.assignees.map((a) => a.assignee.fullName).join(", ")
                  : t.unassigned}
              </span>
            </span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-slate-300 dark:bg-slate-600/50" />
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5" />
            <span>{task.project?.name || t.project}</span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-slate-300 dark:bg-slate-600/50" />
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>
              {new Date(task.dueDate).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Asia/Jakarta",
              })}{" "}
              WIB
            </span>
          </div>
        </div>

        {/* Progress from Employees */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wide uppercase">
              <TrendingUp className="h-3.5 w-3.5" />
              {t.progressFromEmployees}
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

        {renderApprovalButtons(task, false)}
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
            ? `Are you sure you want to approve "${actionDialogState.taskTitle}"?`
            : actionDialogState.type === "reject"
            ? `Are you sure you want to reject "${actionDialogState.taskTitle}"?`
            : `Are you sure you want to ask approval for "${actionDialogState.taskTitle}"?`
        }
        actionType={actionDialogState.type}
        onConfirm={handleActionConfirm}
        isSubmitting={isActionSubmitting}
      />
    </>
  );
}
