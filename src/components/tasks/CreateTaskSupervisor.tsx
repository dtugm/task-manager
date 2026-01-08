"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface CreateTaskModalProps {
  userRole?: string;
  onTaskCreated?: () => void;
}

interface Employee {
  id: string;
  fullName: string;
  email: string;
}

export function CreateTaskModal({
  userRole = "Supervisor",
  onTaskCreated,
}: CreateTaskModalProps) {
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
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    points: 0,
    priority: "MEDIUM",
    dueDate: "",
    projectId: "",
    assigneeIds: [],
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
        // Filter by role = Employee
        if (
          item.role === "User" ||
          item.role === "USER" ||
          item.role === "Employee" ||
          item.role === "EMPLOYEE"
        ) {
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
        setFormData({
          title: "",
          description: "",
          points: 0,
          priority: "MEDIUM",
          dueDate: "",
          projectId: "",
          assigneeIds: [],
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
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          {t.createTask}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-1 border-b border-slate-200/50 pb-4">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {t.createTask}
          </DialogTitle>
          <p className="text-sm text-slate-500">{t.supervisorDesc}</p>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t.title}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t.enterTaskTitle}
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t.description}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t.enterTaskDesc}
              rows={4}
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="points"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {t.points}
              </Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: Number(e.target.value) })
                }
                className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {t.priority}
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
            <Label
              htmlFor="dueDate"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t.dueDate}
            </Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="project"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t.project}
            </Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) =>
                setFormData({ ...formData, projectId: value })
              }
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl">
                <SelectValue placeholder={t.selectProject} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.assignToEmployees}
            </Label>
            <div className="relative">
              <Input
                placeholder={t.typeToSearchEmployees}
                value={employeeSearch}
                onChange={(e) => {
                  setEmployeeSearch(e.target.value);
                  setShowEmployeeDropdown(true);
                }}
                onFocus={() => setShowEmployeeDropdown(true)}
                className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
              />
              {showEmployeeDropdown && employees.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-lg max-h-[200px] overflow-auto animate-in fade-in zoom-in-95 duration-200">
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
                        className="px-3 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 last:border-0"
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
                          <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                            {emp.fullName}
                          </span>
                          <span className="text-xs text-slate-400">
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
                    className="cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg px-2 py-1"
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

        <DialogFooter className="border-t border-slate-200/50 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
          >
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
