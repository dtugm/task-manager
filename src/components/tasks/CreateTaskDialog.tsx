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
import { useState } from "react";
import { CreateTaskRequest } from "@/types/task";
import { Project } from "@/types/project";
import { taskApi } from "@/lib/task-api";
import { useLanguage } from "@/contexts/language-context";

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
  const [error, setError] = useState<string | null>(null);

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.createTask}</DialogTitle>
          <DialogDescription>{t.taskAssignmentDesc}</DialogDescription>
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
              <div className="relative flex flex-col gap-2">
                <Label>{t.project}</Label>
                <Input
                  placeholder={t.search}
                  value={projectSearch}
                  onChange={(e) => {
                    setProjectSearch(e.target.value);
                    setShowProjectDropdown(true);
                  }}
                  onFocus={() => setShowProjectDropdown(true)}
                  className="w-full"
                />
                {showProjectDropdown && projects.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[200px] overflow-auto">
                    {projects
                      .filter((project) => {
                        if (!projectSearch) return true;
                        const query = projectSearch.toLowerCase();
                        return project.name.toLowerCase().includes(query);
                      })
                      .map((project) => (
                        <div
                          key={project.id}
                          className="px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
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
                            <span className="font-medium">{project.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(project as any).description || "No description"}
                            </span>
                          </div>
                        </div>
                      ))}
                    <div className="border-t">
                      <a
                        href="/project-management"
                        target="_blank"
                        className="px-3 py-2 flex items-center gap-2 text-sm text-blue-600 hover:bg-accent transition-colors"
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
                              const newManagers = [
                                ...selectedManagers,
                                manager,
                              ];
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
                      className="flex items-center gap-1"
                    >
                      {manager.fullName}
                      <button
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
