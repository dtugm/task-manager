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
import { Loader2, Plus } from "lucide-react";
import { CreateTaskRequest } from "@/types/task";
import { Project } from "@/types/project";
import { taskApi } from "@/lib/task-api";
import { useLanguage } from "@/contexts/language-context";
import React, { useState } from "react";

interface Manager {
  id: string;
  fullName: string;
  email: string;
}

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  managers: Manager[];
  isOptionsLoading: boolean;
  onTaskCreated: () => void;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projects,
  managers,
  isOptionsLoading,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    points: 0,
    priority: "MEDIUM",
    dueDate: "",
    projectId: "",
    assigneeIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedManagers, setSelectedManagers] = useState<Manager[]>([]);
  // Use local state for assignable users, initialized with managers but updated via search
  const [assignableUsers, setAssignableUsers] = useState<Manager[]>(managers);
  const [error, setError] = useState<string | null>(null);

  // Sync assignableUsers with managers prop if managers load later or change
  // and we haven't searched yet (to maintain initial list)
  if (assignableUsers.length === 0 && managers.length > 0 && !managerSearch) {
    setAssignableUsers(managers);
  }

  // Click outside logic
  const projectDropdownRef = React.useRef<HTMLDivElement>(null);
  const managerDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProjectDropdown(false);
      }
      if (
        managerDropdownRef.current &&
        !managerDropdownRef.current.contains(event.target as Node)
      ) {
        setShowManagerDropdown(false);
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
      projectId: "",
      assigneeIds: [],
    });
    setProjectSearch("");
    setManagerSearch("");
    setSelectedProject(null);
    setSelectedManagers([]);
    setShowProjectDropdown(false);
    setShowManagerDropdown(false);
    setError(null);
  };

  const handleCreateTask = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await taskApi.createTask(token, formData);
      if (response.success) {
        onTaskCreated();
        onOpenChange(false);
        resetForm();
      } else {
        setError(response.error?.message || "Failed to create task");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-slate-200/50 pb-4">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {t.createTask}
          </DialogTitle>
          <DialogDescription>{t.taskAssignmentDesc}</DialogDescription>
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
              <div
                className="relative flex flex-col gap-2"
                ref={projectDropdownRef}
              >
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.project}
                </Label>
                <Input
                  placeholder={t.search}
                  value={projectSearch}
                  onChange={(e) => {
                    setProjectSearch(e.target.value);
                    setShowProjectDropdown(true);
                  }}
                  onFocus={() => setShowProjectDropdown(true)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
                />
                {showProjectDropdown && projects.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-lg max-h-[200px] overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {projects
                      .filter((project) => {
                        if (!projectSearch) return true;
                        const query = projectSearch.toLowerCase();
                        return project.name.toLowerCase().includes(query);
                      })
                      .map((project) => (
                        <div
                          key={project.id}
                          className="px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 last:border-0"
                          onClick={() => {
                            setSelectedProject(project);
                            setFormData({
                              ...formData,
                              projectId: project.id,
                            });
                            setProjectSearch(project.name);
                            setShowProjectDropdown(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                              {project.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {(project as any).description || "No description"}
                            </span>
                          </div>
                        </div>
                      ))}
                    <div className="border-t border-slate-200 dark:border-slate-800 p-2">
                      <a
                        href="/project-management"
                        target="_blank"
                        className="flex items-center justify-center gap-2 p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        {t.createNewProject}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.assignTo || "Assign To"}
                {isOptionsLoading && (
                  <Loader2 className="ml-2 h-3 w-3 animate-spin inline" />
                )}
              </Label>
              <div className="relative" ref={managerDropdownRef}>
                <Input
                  placeholder={
                    isOptionsLoading ? "Loading..." : "Search Assignee"
                  }
                  value={managerSearch}
                  disabled={isOptionsLoading}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setManagerSearch(value);
                    setShowManagerDropdown(true);

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
                          // Dynamically import to avoid circular dependency issues if any, or just to keep it isolated
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
                  onFocus={() => setShowManagerDropdown(true)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
                />
                {showManagerDropdown && assignableUsers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-lg max-h-[200px] overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {assignableUsers
                      .filter((user) => {
                        if (!managerSearch) return true;
                        const query = managerSearch.toLowerCase();
                        return (
                          user.fullName.toLowerCase().includes(query) ||
                          user.email.toLowerCase().includes(query)
                        );
                      })
                      .map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 last:border-0"
                          onClick={() => {
                            if (
                              !selectedManagers.find((m) => m.id === user.id)
                            ) {
                              const newManagers = [...selectedManagers, user];
                              setSelectedManagers(newManagers);
                              setFormData({
                                ...formData,
                                assigneeIds: newManagers.map((m) => m.id),
                              });
                            }
                            setManagerSearch("");
                            setShowManagerDropdown(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                              {user.fullName}
                            </span>
                            <span className="text-xs text-slate-400">
                              {user.email}
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
                        setFormData({
                          ...formData,
                          assigneeIds: newManagers.map((m) => m.id),
                        });
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
