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
import { useState, useRef, useEffect } from "react";
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
    parentTaskId: parentTask.id, // Explicitly set parentTaskId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);
  // Use local state for assignable users, initialized with assignees but updated via search
  const [assignableUsers, setAssignableUsers] = useState<Assignee[]>(assignees);
  const [error, setError] = useState<string | null>(null);

  // Sync assignableUsers with assignees prop if assignees load later or change
  if (assignableUsers.length === 0 && assignees.length > 0 && !assigneeSearch) {
    setAssignableUsers(assignees);
  }

  const assigneeDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        assigneeDropdownRef.current &&
        !assigneeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAssigneeDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    if (!formData.title) {
      setError("Title is required.");
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
        <DialogHeader className="border-b border-slate-200/50 pb-4">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Create Related Task
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Creating a subtask for:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {parentTask.title}
            </span>
          </DialogDescription>
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
              placeholder="Enter subtask title"
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
              placeholder="Enter task description"
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
                {t.filterByPriority.split(" ")[2] || "Priority"}
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
          <div className="space-y-4">
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
                Assign To
                {isOptionsLoading && (
                  <Loader2 className="ml-2 h-3 w-3 animate-spin inline" />
                )}
              </Label>
              <div className="relative" ref={assigneeDropdownRef}>
                <Input
                  placeholder={
                    isOptionsLoading ? "Loading..." : "Search Assignee"
                  }
                  value={assigneeSearch}
                  disabled={isOptionsLoading}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setAssigneeSearch(value);
                    setShowAssigneeDropdown(true);

                    // Fetch users dynamically
                    const match = document.cookie.match(
                      new RegExp("(^| )accessToken=([^;]+)")
                    );
                    const token = match ? match[2] : null;

                    if (token) {
                      try {
                        let organizationId = "";
                        const userDataStr = localStorage.getItem("user_data");
                        if (userDataStr) {
                          const userData = JSON.parse(userDataStr);
                          organizationId =
                            userData.user?.organizationId ||
                            userData.organizations?.[0]?.id ||
                            userData.data?.organizations?.[0]?.id ||
                            "";
                        }

                        if (organizationId) {
                          const { organizationApi } = await import(
                            "@/lib/organization-api"
                          );
                          const response =
                            await organizationApi.getOrganizationUsers(
                              token,
                              organizationId,
                              1,
                              20,
                              value
                            );

                          if (response.success && response.data?.users) {
                            const users = response.data.users.map((u: any) => ({
                              id: u.user ? u.user.id : u.id,
                              fullName: u.user ? u.user.fullName : u.fullName,
                              email: u.user ? u.user.email : u.email,
                            }));
                            setAssignableUsers(users);
                          }
                        }
                      } catch (err) {
                        console.error("Failed to search users", err);
                      }
                    }
                  }}
                  onFocus={() => setShowAssigneeDropdown(true)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
                />
                {showAssigneeDropdown && assignableUsers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-lg max-h-[200px] overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {assignableUsers
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
                          className="px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 last:border-0"
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
                            <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                              {assignee.fullName}
                            </span>
                            <span className="text-xs text-slate-400">
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
                      className="cursor-pointer bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg px-2 py-1"
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
                    >
                      {assignee.fullName} ×
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
            onClick={handleCreateTask}
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
          >
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
