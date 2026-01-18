"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { taskApi } from "@/lib/task-api";
import { projectApi } from "@/lib/project-api";
import { authApi } from "@/lib/auth-api";
import { CreateTaskRequest } from "@/types/task";
import { Project } from "@/types/project";
import { useLanguage } from "@/contexts/language-context";

const ORGANIZATION_ID =
  process.env.NEXT_PUBLIC_ORGANIZATION_ID || "KELGsLB6canc9jAX7035G";

interface CreateRelatedTaskModalProps {
  relatedTaskTitle: string;
  parentTaskId: string;
  parentProjectId: string;
  targetRole?: "Supervisor" | "Employee"; // New prop
  onTaskCreated?: () => void;
}

interface Employee {
  id: string;
  fullName: string;
  email: string;
}

export function CreateRelatedTaskModal({
  relatedTaskTitle,
  parentTaskId,
  parentProjectId,
  targetRole = "Supervisor", // Default to Supervisor
  onTaskCreated,
}: CreateRelatedTaskModalProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Projects and Employees
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  // Form State
  // Form State
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    points: 0,
    priority: "MEDIUM",
    quest: "main",
    dueDate: "",
    projectId: parentProjectId,
    assigneeIds: [],
    parentTaskId: parentTaskId,
  });

  // Fetch projects and employees when dialog opens
  useEffect(() => {
    if (open) {
      fetchProjects();
      fetchEmployees();
    }
  }, [open]);

  const fetchProjects = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    try {
      const response = await projectApi.getAllProjects(token);
      if (response.success && Array.isArray(response.data)) {
        setProjects(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const fetchEmployees = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    try {
      const response = await authApi.getOrganizationUsers(
        token,
        ORGANIZATION_ID,
        1,
        100
      );

      let rawData: any = response;
      if (response && (response as any).success && (response as any).data) {
        rawData = (response as any).data;
      }

      const mappedEmployees: Employee[] = [];
      let usersSource: any[] = [];

      if (Array.isArray(rawData)) {
        usersSource = rawData;
      } else if (rawData && Array.isArray(rawData.data)) {
        usersSource = rawData.data;
      } else if (rawData && Array.isArray(rawData.users)) {
        usersSource = rawData.users;
      }

      usersSource.forEach((item: any) => {
        const role = item.role?.toUpperCase() || "";
        let matches = false;

        if (targetRole === "Supervisor") {
          matches = role === "SUPERVISOR";
        } else {
          // Employee matches User/Employee
          matches = role === "USER" || role === "EMPLOYEE";
        }

        if (matches) {
          if (item.user && item.user.id) {
            mappedEmployees.push({
              id: item.user.id,
              fullName: item.user.fullName || item.user.username || "Unknown",
              email: item.user.email,
            });
          } else if (item.id && (item.fullName || item.username)) {
            mappedEmployees.push({
              id: item.id,
              fullName: item.fullName || item.username || "Unknown",
              email: item.email,
            });
          }
        }
      });

      setEmployees(mappedEmployees);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleSubmit = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await taskApi.createTask(token, formData);
      if (response.success) {
        // Reset form
        // Reset form
        setFormData({
          title: "",
          description: "",
          points: 0,
          priority: "MEDIUM",
          quest: "main",
          dueDate: "",
          projectId: parentProjectId,
          assigneeIds: [],
          parentTaskId: parentTaskId,
        });
        setSelectedEmployees([]);
        setEmployeeSearch("");
        setOpen(false);

        // Notify parent to refresh
        if (onTaskCreated) {
          onTaskCreated();
        }
      }
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          {t.createRelatedTask}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">{t.createRelatedTask}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {t.relatedTo}{" "}
            <span className="text-foreground font-medium">
              {relatedTaskTitle}
            </span>
          </p>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.title}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t.enterTaskTitle}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t.enterTaskDesc}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">{t.points}</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">{t.priority}</Label>
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
            <div className="space-y-2 col-span-2">
              <Label>Quest</Label>
              <Select
                value={formData.quest}
                onValueChange={(value: "main" | "side") =>
                  setFormData({ ...formData, quest: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="side">Side</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">{t.dueDate}</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">{t.project}</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) =>
                setFormData({ ...formData, projectId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t.selectProject} />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.assignToEmployees}</Label>
            <div className="relative">
              <Input
                placeholder={t.typeToSearchEmployees}
                value={employeeSearch}
                onChange={(e) => {
                  setEmployeeSearch(e.target.value);
                  setShowEmployeeDropdown(true);
                }}
                onFocus={() => setShowEmployeeDropdown(true)}
              />
              {showEmployeeDropdown && employees.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[200px] overflow-auto">
                  {employees
                    .filter((emp) => {
                      if (!employeeSearch) return true;
                      const query = employeeSearch.toLowerCase();
                      return (
                        emp.fullName.toLowerCase().includes(query) ||
                        emp.email.toLowerCase().includes(query)
                      );
                    })
                    .map((emp) => (
                      <div
                        key={emp.id}
                        className="px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => {
                          if (!selectedEmployees.find((e) => e.id === emp.id)) {
                            const newEmployees = [...selectedEmployees, emp];
                            setSelectedEmployees(newEmployees);
                            setFormData({
                              ...formData,
                              assigneeIds: newEmployees.map((e) => e.id),
                            });
                          }
                          setEmployeeSearch("");
                          setShowEmployeeDropdown(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{emp.fullName}</span>
                          <span className="text-xs text-muted-foreground">
                            {emp.email}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            {selectedEmployees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEmployees.map((emp) => (
                  <Badge
                    key={emp.id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      const newEmployees = selectedEmployees.filter(
                        (e) => e.id !== emp.id
                      );
                      setSelectedEmployees(newEmployees);
                      setFormData({
                        ...formData,
                        assigneeIds: newEmployees.map((e) => e.id),
                      });
                    }}
                  >
                    {emp.fullName} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.creating}
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
