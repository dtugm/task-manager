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
import {
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Search,
  RefreshCw,
} from "lucide-react";
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
import { ExecutiveTaskCard } from "@/components/tasks/ExecutiveTaskCard";
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
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

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

  // Fetch managers and RnD members
  const fetchManagers = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    try {
      const RND_PROJECT_ID = "sXeA6VyPZc7wSxgr2JkuC";

      // Fetch both Organization Managers and RnD Project Users
      const [managersResponse, rndResponse] = await Promise.all([
        authApi.getOrganizationUsers(token, ORGANIZATION_ID, 1, 100),
        projectApi.getProjectUsers(token, RND_PROJECT_ID, 1, 100),
      ]);

      const allUsersMap = new Map<string, Manager>();

      // Process Managers
      let managersData: any = managersResponse;
      if (
        managersResponse &&
        (managersResponse as any).success &&
        (managersResponse as any).data
      ) {
        managersData = (managersResponse as any).data;
      }

      let managersSource: any[] = [];
      if (Array.isArray(managersData)) {
        managersSource = managersData;
      } else if (managersData && Array.isArray(managersData.data)) {
        managersSource = managersData.data;
      } else if (managersData && Array.isArray(managersData.users)) {
        managersSource = managersData.users;
      }

      managersSource.forEach((item: any) => {
        if (item.role === "Manager" || item.role === "MANAGER") {
          const user = item.user || item; // Handle both wrapper and direct user object
          if (user.id || item.id) {
            const id = user.id || item.id;
            const fullName =
              user.fullName ||
              user.username ||
              item.fullName ||
              item.username ||
              "Unknown";
            const email = user.email || item.email || "";
            allUsersMap.set(id, { id, fullName, email });
          }
        }
      });

      // Process RnD Users
      let rndData: any = rndResponse;
      if (
        rndResponse &&
        (rndResponse as any).success &&
        (rndResponse as any).data
      ) {
        rndData = (rndResponse as any).data;
      }

      let rndSource: any[] = [];
      if (Array.isArray(rndData)) {
        rndSource = rndData;
      } else if (rndData && Array.isArray(rndData.data)) {
        rndSource = rndData.data;
      } else if (rndData && Array.isArray(rndData.users)) {
        rndSource = rndData.users;
      } else if (rndData && Array.isArray(rndData.projectUsers)) {
        // Possible variation
        rndSource = rndData.projectUsers;
      }

      rndSource.forEach((item: any) => {
        // Identify user object structure
        const user = item.user || item;
        if (user.id || item.id) {
          const id = user.id || item.id;
          const fullName =
            user.fullName ||
            user.username ||
            item.fullName ||
            item.username ||
            "Unknown";
          const email = user.email || item.email || "";
          // Add to map (overwrites if exists, which is fine)
          allUsersMap.set(id, { id, fullName, email });
        }
      });

      setManagers(Array.from(allUsersMap.values()));
    } catch (err) {
      console.error("Failed to fetch assignees", err);
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
    completed: tasks.filter((t) => t.status === "ACCEPTED").length,
    inProgress: tasks.filter((t) => t.progress > 0 && t.progress < 100).length,
    todo: tasks.filter((t) => t.status === "PENDING_APPROVAL").length, // User requested Todo -> Pending Approval
  };

  return (
    <div className="relative isolate space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in-50 duration-500 min-h-[calc(100vh-4rem)]">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob bg-[#0077FF]/30 dark:bg-[#0077FF]/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-[#F1677C]/30 dark:bg-[#F1677C]/20"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bg-[#FFB200]/30 dark:bg-[#FFB200]/20"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0C426A] to-[#0077FF] dark:from-white dark:to-slate-300">
            {t.taskAssignment}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t.taskAssignmentDesc}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0077FF] transition-colors" />
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full md:w-[280px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#0077FF]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchTasks}
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              title={t.refresh}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant={deleteMode ? "destructive" : "outline"}
              onClick={() => setDeleteMode(!deleteMode)}
              className={
                !deleteMode
                  ? "flex-1 md:flex-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all rounded-xl shadow-sm"
                  : "flex-1 md:flex-none rounded-xl shadow-sm"
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMode ? t.cancel : t.delete}
            </Button>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="flex-1 md:flex-none bg-[#0077FF] hover:bg-[#0066DD] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t.createTask}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl shadow-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <TaskStats stats={stats} />

      {/* Filters Section */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-white/5">
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
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-16 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#0077FF]" />
              <p className="text-muted-foreground font-medium">
                Loading tasks...
              </p>
            </CardContent>
          </Card>
        ) : tasks.length === 0 ? (
          <Card className="border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-16 text-center">
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                {t.noTasksFound}
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Try adjusting your filters or create a new task.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <ExecutiveTaskCard
                key={task.id}
                task={task}
                expandedTasks={expandedTasks}
                toggleExpand={toggleExpand}
                onSelectTask={(t) => {
                  setSelectedTask(t);
                  setIsDetailOpen(true);
                }}
                onEditTask={(t) => {
                  setEditingTask(t);
                  setIsEditOpen(true);
                }}
                onDeleteTask={(id) => setTaskToDelete(id)}
                fetchTasks={fetchTasks}
                deleteMode={deleteMode}
                userRole="Executive"
                targetRole="Supervisor"
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-xl p-4 border border-white/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.itemsPerPage}
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.page} {currentPage} {t.of} {totalPages}
            </span>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded-lg hover:bg-[#0077FF] hover:text-white transition-colors"
              >
                {t.first}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg hover:bg-[#0077FF] hover:text-white transition-colors"
              >
                {t.previous}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-lg hover:bg-[#0077FF] hover:text-white transition-colors"
              >
                {t.next}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="rounded-lg hover:bg-[#0077FF] hover:text-white transition-colors"
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
        projects={projects}
        isOptionsLoading={isOptionsLoading}
        onTaskUpdated={() => fetchTasks()}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t.confirmDeletion}
            </DialogTitle>
            <DialogDescription className="text-base">
              {t.confirmDeletionDesc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setTaskToDelete(null)}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={isSubmitting}
              className="rounded-xl bg-red-600 hover:bg-red-700"
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
