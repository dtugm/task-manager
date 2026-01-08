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
import { useState } from "react";
import { CreateTaskRequest, Task } from "@/types/task";
import { taskApi } from "@/lib/task-api";
import { useLanguage } from "@/contexts/language-context";

interface Assignee {
  id: string;
  fullName: string;
  email: string;
}

interface CreateSubtaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentTask: Task;
  assignees: Assignee[];
  isOptionsLoading?: boolean;
  onTaskCreated: () => void;
}

export function CreateSubtaskDialog({
  open,
  onOpenChange,
  parentTask,
  assignees,
  isOptionsLoading = false,
  onTaskCreated,
}: CreateSubtaskDialogProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    points: 0,
    priority: "MEDIUM",
    dueDate: "",
    projectId: parentTask.projectId || parentTask.project?.id || "",
    assigneeIds: [],
    parentTaskId: parentTask.id,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Sync project ID if parent task changes (though dialog usually remounts or is keyed)
  // We initialize in state, but good to be safe if parentTask prop updates while open?
  // Probably fine for now.

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      points: 0,
      priority: "MEDIUM",
      dueDate: "",
      projectId: parentTask.projectId || parentTask.project?.id || "",
      assigneeIds: [],
      parentTaskId: parentTask.id,
    });
    setAssigneeSearch("");
    setSelectedAssignees([]);
    setShowAssigneeDropdown(false);
    setError(null);
  };

  const handleCreateTask = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    // Validate required fields
    if (!formData.title || !formData.projectId) {
      setError("Title and Project are required (Project should be inherited).");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await taskApi.createTask(token, formData);
      if (response.success) {
        onTaskCreated();
        onOpenChange(false);
        resetForm();
      } else {
        setError(response.error?.message || "Failed to create subtask");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create subtask");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create Related Task</DialogTitle>
          <DialogDescription>
            Creating a subtask for:{" "}
            <span className="font-semibold">{parentTask.title}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter subtask title"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.description}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter task description"
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
              <Label>{t.filterByPriority.split(" ")[2] || "Priority"}</Label>
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
          <div className="space-y-4">
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
                Assign To
                {isOptionsLoading && (
                  <Loader2 className="ml-2 h-3 w-3 animate-spin inline" />
                )}
              </Label>
              <div className="relative">
                <Input
                  placeholder={
                    isOptionsLoading ? "Loading..." : "Search Assignee"
                  }
                  value={assigneeSearch}
                  disabled={isOptionsLoading}
                  onChange={(e) => {
                    setAssigneeSearch(e.target.value);
                    setShowAssigneeDropdown(true);
                  }}
                  onFocus={() => setShowAssigneeDropdown(true)}
                  className="w-full"
                />
                {showAssigneeDropdown && assignees.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[200px] overflow-auto">
                    {assignees
                      .filter((assignee) => {
                        if (!assigneeSearch) return true;
                        const query = assigneeSearch.toLowerCase();
                        return (
                          assignee.fullName.toLowerCase().includes(query) ||
                          assignee.email.toLowerCase().includes(query)
                        );
                      })
                      .map((assignee) => (
                        <div
                          key={assignee.id}
                          className="px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => {
                            if (
                              !selectedAssignees.find(
                                (m) => m.id === assignee.id
                              )
                            ) {
                              const newAssignees = [
                                ...selectedAssignees,
                                assignee,
                              ];
                              setSelectedAssignees(newAssignees);
                              setFormData({
                                ...formData,
                                assigneeIds: newAssignees.map((m) => m.id),
                              });
                            }
                            setAssigneeSearch("");
                            setShowAssigneeDropdown(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {assignee.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {assignee.email}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {selectedAssignees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAssignees.map((assignee) => (
                    <Badge
                      key={assignee.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {assignee.fullName}
                      <button
                        onClick={() => {
                          const newAssignees = selectedAssignees.filter(
                            (m) => m.id !== assignee.id
                          );
                          setSelectedAssignees(newAssignees);
                          setFormData({
                            ...formData,
                            assigneeIds: newAssignees.map((m) => m.id),
                          });
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button onClick={handleCreateTask} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              t.createTask
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
