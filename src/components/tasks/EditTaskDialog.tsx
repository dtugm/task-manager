"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Task, UpdateTaskRequest } from "@/types/task";
import { taskApi } from "@/lib/task-api";
import { useLanguage } from "@/contexts/language-context";

interface Manager {
  id: string;
  fullName: string;
  email: string;
}

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  managers: Manager[];
  isOptionsLoading: boolean;
  onTaskUpdated: () => void;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  managers,
  isOptionsLoading,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<UpdateTaskRequest>({
    title: "",
    description: "",
    points: 0,
    priority: "MEDIUM",
    dueDate: "",
    assigneeIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managerSearch, setManagerSearch] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [selectedManagers, setSelectedManagers] = useState<Manager[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        points: task.points,
        priority: task.priority,
        dueDate: task.dueDate,
        assigneeIds: task.assigneeIds || [],
      });

      if (task.assignees && task.assignees.length > 0) {
        setSelectedManagers(
          task.assignees.map((a) => a.assignee as unknown as Manager)
        );
      } else {
        setSelectedManagers([]);
      }
    }
  }, [task]);

  const handleUpdateTask = async () => {
    if (!task) return;

    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateTaskRequest = {
        title: formData.title,
        description: formData.description,
        points: formData.points,
        priority: formData.priority,
        dueDate: formData.dueDate,
        assigneeIds: selectedManagers.map((m) => m.id),
      };

      const response = await taskApi.updateTask(token, task.id, updateData);
      if (response.success) {
        onTaskUpdated();
        onOpenChange(false);
        setError(null);
      } else {
        setError(response.error?.message || "Failed to update task");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-slate-200/50 pb-4">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Edit Task
          </DialogTitle>
          <DialogDescription>Update task details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Title
            </Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter task title"
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.description}
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t.projectDescPlaceholder}
              rows={4}
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.totalPoints}
              </Label>
              <Input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: Number(e.target.value) })
                }
                className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.filterByPriority.split(" ")[2]}
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                  <SelectItem value="LOW">{t.low}</SelectItem>
                  <SelectItem value="MEDIUM">{t.medium}</SelectItem>
                  <SelectItem value="HIGH">{t.high}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.date}
            </Label>
            <Input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Assign Users
              {isOptionsLoading && (
                <Loader2 className="ml-2 h-3 w-3 animate-spin inline" />
              )}
            </Label>
            <div className="relative">
              <Input
                placeholder={
                  isOptionsLoading ? "Loading..." : "Search Assignee"
                }
                value={managerSearch}
                disabled={isOptionsLoading}
                onChange={(e) => {
                  setManagerSearch(e.target.value);
                  setShowManagerDropdown(true);
                }}
                onFocus={() => setShowManagerDropdown(true)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
              />
              {showManagerDropdown && managers.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-lg max-h-[200px] overflow-auto animate-in fade-in zoom-in-95 duration-200">
                  {managers
                    .filter((manager) => {
                      if (!managerSearch) return true;
                      const query = managerSearch.toLowerCase();
                      return (
                        manager.fullName.toLowerCase().includes(query) ||
                        manager.email.toLowerCase().includes(query)
                      );
                    })
                    .map((manager) => (
                      <div
                        key={manager.id}
                        className="px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 last:border-0"
                        onClick={() => {
                          if (
                            !selectedManagers.find((m) => m.id === manager.id)
                          ) {
                            const newManagers = [...selectedManagers, manager];
                            setSelectedManagers(newManagers);
                          }
                          setManagerSearch("");
                          setShowManagerDropdown(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                            {manager.fullName}
                          </span>
                          <span className="text-xs text-slate-400">
                            {manager.email}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            {selectedManagers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedManagers.map((manager) => (
                  <Badge
                    key={manager.id}
                    variant="secondary"
                    className="cursor-pointer bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg px-2 py-1"
                    onClick={() => {
                      const newManagers = selectedManagers.filter(
                        (m) => m.id !== manager.id
                      );
                      setSelectedManagers(newManagers);
                    }}
                  >
                    {manager.fullName} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {error && (
            <div className="mx-4 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
        <DialogFooter className="border-t border-slate-200/50 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleUpdateTask}
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Task"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
