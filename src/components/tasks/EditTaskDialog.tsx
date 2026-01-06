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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update task details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter task title"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.description}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t.projectDescPlaceholder}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.totalPoints}</Label>
              <Input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t.filterByPriority.split(" ")[2]}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">{t.low}</SelectItem>
                  <SelectItem value="MEDIUM">{t.medium}</SelectItem>
                  <SelectItem value="HIGH">{t.high}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t.date}</Label>
            <Input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              {t.searchManager}
              {isOptionsLoading && (
                <Loader2 className="ml-2 h-3 w-3 animate-spin inline" />
              )}
            </Label>
            <div className="relative">
              <Input
                placeholder={
                  isOptionsLoading ? "Loading managers..." : t.searchManager
                }
                value={managerSearch}
                disabled={isOptionsLoading}
                onChange={(e) => {
                  setManagerSearch(e.target.value);
                  setShowManagerDropdown(true);
                }}
                onFocus={() => setShowManagerDropdown(true)}
                className="w-full"
              />
              {showManagerDropdown && managers.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[200px] overflow-auto">
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
                        className="px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
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
                          <span className="font-medium">
                            {manager.fullName}
                          </span>
                          <span className="text-xs text-muted-foreground">
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
                    className="cursor-pointer"
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button onClick={handleUpdateTask} disabled={isSubmitting}>
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
