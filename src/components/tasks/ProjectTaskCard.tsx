import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Clock,
  ClipboardList,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { useState } from "react";
import { TaskLogsDialog } from "./TaskLogsDialog";

interface ProjectTaskCardProps {
  task: Task;
  expandedTasks: Set<string>;
  toggleExpand: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
}

export function ProjectTaskCard({
  task,
  expandedTasks,
  toggleExpand,
  onSelectTask,
}: ProjectTaskCardProps) {
  const isExpanded = expandedTasks.has(task.id);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [logTask, setLogTask] = useState<Task | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "LOW":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400 text-[10px] px-1.5 py-0 h-5">
            Pending Approval
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 text-[10px] px-1.5 py-0 h-5">
            Accepted
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 text-[10px] px-1.5 py-0 h-5">
            Completed
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:border-sky-800 dark:text-sky-400 text-[10px] px-1.5 py-0 h-5">
            In Progress
          </Badge>
        );
      case "NEEDS_REVISION":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 text-[10px] px-1.5 py-0 h-5">
            Needs Revision
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 text-[10px] px-1.5 py-0 h-5">
            {(status || "TODO").replace(/_/g, " ")}
          </Badge>
        );
    }
  };

  const formattedDate = task.dueDate
    ? format(new Date(task.dueDate), "MMM d, yyyy")
    : "No date";

  return (
    <>
      <Card
        className={`border-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group ${
          isExpanded ? "ring-2 ring-indigo-500/20" : ""
        }`}
      >
        <CardHeader className="p-4 sm:p-6 pb-2">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5 flex-1 p-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`border-0 font-semibold uppercase tracking-wide text-[10px] px-1.5 py-0 h-5 ${
                    (task.quest || "main") === "main"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {(task.quest || "main") === "main"
                    ? "Main Quest"
                    : "Side Quest"}
                </Badge>
                <Badge
                  variant="outline"
                  className={`${getPriorityColor(
                    task.priority
                  )} border-0 font-semibold`}
                >
                  {task.priority}
                </Badge>
                {task.project && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  >
                    {task.project.name}
                  </Badge>
                )}
                {/* Parent Task Status Badge */}
                {getStatusBadge(task.status)}
              </div>
              <div
                className="cursor-pointer hover:underline decoration-indigo-500/30 underline-offset-4"
                onClick={() => onSelectTask(task)}
              >
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {task.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-slate-600 dark:text-slate-400">
                  {task.description}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-1 text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <User className="h-3.5 w-3.5" />
                  {task.assignees && task.assignees.length > 0
                    ? task.assignees.map((a) => a.assignee.fullName).join(", ")
                    : "Unassigned"}
                </div>
                <div className="flex items-center justify-end gap-1 text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </div>
                {task.childTasks && task.childTasks.length > 0 && (
                  <div className="text-xs font-medium text-slate-400">
                    {task.childTasks.length} subtasks
                  </div>
                )}
              </div>

              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setLogTask(task);
                  setIsLogsOpen(true);
                }}
                className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="View Logs"
              >
                <FileText className="h-4 w-4 text-slate-500" />
              </Button> */}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleExpand(task.id)}
                className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="mt-2 mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-1.5" />
          </div>

          {isExpanded && (
            <div className="mt-6 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4 animate-in slide-in-from-top-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Related Tasks (Subtasks)
                </h4>
              </div>

              {!task.childTasks || task.childTasks.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 text-sm">No related tasks.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {task.childTasks.map((child) => (
                    <div
                      key={child.id}
                      className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5
                              className="font-medium text-slate-800 dark:text-slate-200 truncate cursor-pointer hover:text-indigo-600 transition-colors"
                              onClick={() => onSelectTask(child)}
                            >
                              {child.title}
                            </h5>
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(
                                child.priority
                              )} border-0 text-[10px] px-1.5 py-0 h-5`}
                            >
                              {child.priority}
                            </Badge>
                            {getStatusBadge(child.status)}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {child.assignees && child.assignees.length > 0
                                ? child.assignees
                                    .map((a) => a.assignee.fullName)
                                    .join(", ")
                                : "Unassigned"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {child.dueDate
                                ? format(new Date(child.dueDate), "MMM d")
                                : "No date"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              setLogTask(child);
                              setIsLogsOpen(true);
                            }}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Logs
                          </Button>
                        </div>
                      </div>

                      <div className="px-1">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{child.progress}%</span>
                        </div>
                        <Progress value={child.progress} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {logTask && (
        <TaskLogsDialog
          open={isLogsOpen}
          onOpenChange={setIsLogsOpen}
          taskId={logTask.id}
          taskTitle={logTask.title}
        />
      )}
    </>
  );
}
