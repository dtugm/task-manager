"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2, Plus, Trash2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { taskApi } from "@/lib/task-api";
import { projectApi } from "@/lib/project-api";
import { authApi } from "@/lib/auth-api";
import { Task } from "@/types/task";
import { Project } from "@/types/project";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { TaskStats } from "@/components/tasks/TaskStats";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskCard } from "@/components/tasks/TaskCard";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";
import { useLanguage } from "@/contexts/language-context";

const ORGANIZATION_ID =
  process.env.NEXT_PUBLIC_ORGANIZATION_ID || "KELGsLB6canc9jAX7035G";

interface Manager {
  id: string;
  fullName: string;
  email: string;
}

export default function TaskAssignmentPage() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Task Detail
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  // Filter State
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch current user if not already fetched
      let userId = currentUserId;
      if (!userId) {
        const cachedData = localStorage.getItem("user_data");
        if (cachedData) {
          try {
            const userData = JSON.parse(cachedData);
            if (userData.user && userData.user.id) {
              userId = userData.user.id;
              setCurrentUserId(userId);
            }
          } catch (e) {
            console.error("Failed to parse cached user data in tasks", e);
          }
        }

        // Only fetch if not found in cache
        if (!userId) {
          const userResponse = await authApi.getCurrentUser(token);
          if (userResponse.success && userResponse.data) {
            userId = userResponse.data.id;
            setCurrentUserId(userId);
          }
        }
      }

      const response = await taskApi.getCreatedTasksSummary(token);

      if (response.success) {
        let fetchedTasks = response.data.tasks;
        // Client-side fallback for search if API ignores it or if specific behavior required
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          fetchedTasks = fetchedTasks.filter(
            (task) =>
              task.title.toLowerCase().includes(lowerQuery) ||
              task.description.toLowerCase().includes(lowerQuery)
          );
        }

        setTasks(fetchedTasks);
        setTotalPages(1); // Assuming summary returns all tasks
        setTotalTasks(response.data.totalTasks);
      } else {
        setError(response.error?.message || "Failed to fetch tasks");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 500); // Debounce
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, searchQuery]);

  // Fetch projects
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

  // Fetch managers
  const fetchManagers = async () => {
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

      const mappedManagers: Manager[] = [];
      let usersSource: any[] = [];

      if (Array.isArray(rawData)) {
        usersSource = rawData;
      } else if (rawData && Array.isArray(rawData.data)) {
        usersSource = rawData.data;
      } else if (rawData && Array.isArray(rawData.users)) {
        usersSource = rawData.users;
      }

      usersSource.forEach((item: any) => {
        // Filter by role = Manager
        if (item.role === "Manager" || item.role === "MANAGER") {
          if (item.user && item.user.id) {
            mappedManagers.push({
              id: item.user.id,
              fullName: item.user.fullName || item.user.username || "Unknown",
              email: item.user.email,
            });
          } else if (item.id && (item.fullName || item.username)) {
            mappedManagers.push({
              id: item.id,
              fullName: item.fullName || item.username || "Unknown",
              email: item.email,
            });
          }
        }
      });

      setManagers(mappedManagers);
    } catch (err) {
      console.error("Failed to fetch managers", err);
    }
  };

  // Fetch projects and managers when dialogs open
  useEffect(() => {
    if (isCreateOpen || isEditOpen) {
      const loadOptions = async () => {
        setIsOptionsLoading(true);
        try {
          await Promise.all([fetchProjects(), fetchManagers()]);
        } catch (error) {
          console.error("Error loading options:", error);
        } finally {
          setIsOptionsLoading(false);
        }
      };
      loadOptions();
    }
  }, [isCreateOpen, isEditOpen]);

  // Delete task
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await taskApi.deleteTask(token, taskToDelete);
      const isEmptyObject =
        response &&
        typeof response === "object" &&
        Object.keys(response).length === 0;
      const isSuccess = !response || response.success === true || isEmptyObject;

      if (isSuccess) {
        await fetchTasks();
        setTaskToDelete(null);
        setError(null);
      } else {
        setError(response.error?.message || "Failed to delete task");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Logic
  const filteredTasks = tasks.filter((task) => {
    if (filterDateFrom || filterDateTo) {
      const taskDate = new Date(task.dueDate);
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        if (taskDate < fromDate) return false;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (taskDate > toDate) return false;
      }
    }

    if (filterProject !== "all") {
      const projectId = task.project?.id || task.projectId;
      if (projectId !== filterProject) return false;
    }

    if (filterPriority !== "all") {
      if (task.priority !== filterPriority.toUpperCase()) return false;
    }

    if (filterStatus !== "all") {
      if (filterStatus === "pending" && task.progress !== 0) return false;
      if (
        filterStatus === "in-progress" &&
        (task.progress === 0 || task.progress === 100)
      )
        return false;
      if (filterStatus === "completed" && task.progress !== 100) return false;
    }

    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.progress === 100).length,
    inProgress: tasks.filter((t) => t.progress > 0 && t.progress < 100).length,
    todo: tasks.filter((t) => t.progress === 0).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.taskAssignment}
          </h2>
          <p className="text-muted-foreground">{t.taskAssignmentDesc}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 w-full md:w-[250px]"
            />
          </div>

          <Button
            variant={deleteMode ? "destructive" : "outline"}
            onClick={() => setDeleteMode(!deleteMode)}
            className={
              !deleteMode
                ? "text-destructive border-destructive/20 hover:bg-destructive/10"
                : ""
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteMode ? t.cancel : t.delete}
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t.createTask}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <TaskStats stats={stats} />

      {/* Filters Section */}
      <TaskFilters
        filterDateFrom={filterDateFrom}
        setFilterDateFrom={setFilterDateFrom}
        filterDateTo={filterDateTo}
        setFilterDateTo={setFilterDateTo}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        projects={projects}
        onClear={() => {
          setFilterDateFrom("");
          setFilterDateTo("");
          setFilterProject("all");
          setFilterPriority("all");
          setFilterStatus("all");
        }}
      />

      {/* Task List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-12 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {t.noTasksFound}
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteMode={deleteMode}
              onClick={(task) => {
                setSelectedTask(task);
                setIsDetailOpen(true);
              }}
              onEdit={(task) => {
                setEditingTask(task);
                setIsEditOpen(true);
              }}
              onConfirmDelete={(taskId) => setTaskToDelete(taskId)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t.itemsPerPage}
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t.page} {currentPage} {t.of} {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                {t.first}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t.previous}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                {t.next}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                {t.last}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        projects={projects}
        managers={managers}
        isOptionsLoading={isOptionsLoading}
        onTaskCreated={() => fetchTasks()}
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        task={editingTask}
        managers={managers}
        isOptionsLoading={isOptionsLoading}
        onTaskUpdated={() => fetchTasks()}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.confirmDeletion}</DialogTitle>
            <DialogDescription>{t.confirmDeletionDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTaskToDelete(null)}
              disabled={isSubmitting}
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                t.delete
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdate={() => {
          fetchTasks();
        }}
      />
    </div>
  );
}
