"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { Task } from "@/types/task";
import { useLanguage } from "@/contexts/language-context";
import { CreateRelatedTaskModal } from "@/components/tasks/CreateRelatedTaskModal";

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
}: ExecutiveTaskCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelectTask(task)}
    >
      <CardContent className="p-6">
        {/* Title and Badges */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
            <p className="text-muted-foreground text-sm">{task.description}</p>
          </div>

          <div className="flex gap-2 ml-4">
            <Badge
              variant="secondary"
              className={
                task.priority === "HIGH"
                  ? "bg-red-100 text-red-700 hover:bg-red-100"
                  : task.priority === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                  : "bg-green-100 text-green-700 hover:bg-green-100"
              }
            >
              {task.priority === "HIGH"
                ? t.high
                : task.priority === "MEDIUM"
                ? t.medium
                : t.low}
            </Badge>
            <Badge
              variant="secondary"
              className={
                task.progress === 100
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : task.progress > 0
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
              }
            >
              {task.progress === 100
                ? t.completed
                : task.progress > 0
                ? t.inProgress
                : t.pending}
            </Badge>
          </div>
        </div>

        {/* From, Project, Due Date */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              {t.from}: {task.creator?.fullName || "Executive"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{task.project?.name || t.project}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progress from Employees */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-blue-600 font-medium">
              <TrendingUp className="h-4 w-4" />
              {t.progressFromEmployees}
            </span>
            <span className="font-bold">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        {/* Create Related Task Button and Related Count */}
        <div className="flex items-center gap-3">
          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <CreateRelatedTaskModal
              relatedTaskTitle={task.title}
              parentTaskId={task.id}
              parentProjectId={task.project?.id || task.projectId}
              onTaskCreated={fetchTasks}
              targetRole={targetRole}
            />
          </div>
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(task.id);
            }}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedTasks.has(task.id) ? "rotate-180" : ""
              }`}
            />
            <span>
              {task.childTasks?.length || 0} {t.relatedTasks}
            </span>
          </button>
        </div>

        {/* Related Tasks Section - Collapsible */}
        {task.childTasks &&
          task.childTasks.length > 0 &&
          expandedTasks.has(task.id) && (
            <div
              className="mt-6 pt-6 border-t"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="font-semibold text-sm mb-4">
                {t.relatedTasksForEmployees}
              </h4>
              <div className="space-y-3">
                {task.childTasks.map((relatedTask) => (
                  <div
                    key={relatedTask.id}
                    className="bg-muted/30 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onSelectTask(relatedTask)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium">{relatedTask.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {relatedTask.description}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTask(relatedTask);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {deleteMode && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(relatedTask.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Badge
                          variant="secondary"
                          className={
                            relatedTask.progress === 100
                              ? "bg-green-100 text-green-700"
                              : relatedTask.progress > 0
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {relatedTask.progress === 100
                            ? t.completed
                            : relatedTask.progress > 0
                            ? t.inProgress
                            : t.todo}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>
                        {t.assignedTo}{" "}
                        {relatedTask.assignees
                          ?.map(
                            (a: any) =>
                              a.assignee?.fullName ||
                              a.assignee?.username ||
                              t.unknown
                          )
                          .join(", ") || t.unassigned}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={relatedTask.progress}
                        className="h-1.5 flex-1"
                      />
                      <span className="text-xs font-medium">
                        {relatedTask.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
