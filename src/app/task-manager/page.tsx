"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Loader2,
  ListTodo,
  RefreshCw,
  Plus,
  Search,
  ListFilter,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { ExecutiveTaskStats } from "@/components/tasks/ExecutiveTaskStats";
import { ManagerTaskFilters } from "@/components/tasks/ManagerTaskFilters";
import { ManagerTaskCard } from "@/components/tasks/ManagerTaskCard";
import { useLanguage } from "@/contexts/language-context";
import { taskApi } from "@/lib/task-api";
import { Task } from "@/types/task";
import { useManagerTasks } from "@/hooks/useManagerTasks";

export default function TaskManagerForManagerPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // Custom Hook for Data Fetching
  const {
    executiveTasks,
    allTasks,
    projects,
    supervisors,
    isLoading,
    isSupervisorsLoading,
    fetchTasks,
  } = useManagerTasks();

  // Local UI State
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter State
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterQuest, setFilterQuest] = useState<string>("all");

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await taskApi.deleteTask(token, taskToDelete);
      const isSuccess =
        !response ||
        response.success === true ||
        (typeof response === "object" && Object.keys(response).length === 0);

      if (isSuccess) {
        await fetchTasks();
        setTaskToDelete(null);
      } else {
        console.error("Failed to delete task", response?.error);
      }
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle opening task from notification
  useEffect(() => {
    const taskId = searchParams.get("taskId");
    if (taskId && allTasks.length > 0) {
      // First check if task exists in already fetched tasks
      const taskFromList = allTasks.find((t) => t.id === taskId);

      if (taskFromList) {
        setSelectedTask(taskFromList);
        setIsDetailOpen(true);
      } else {
        // Task not in list, fetch it individually
        const match = document.cookie.match(
          new RegExp("(^| )accessToken=([^;]+)"),
        );
        const token = match ? match[2] : null;

        if (token) {
          taskApi
            .getTask(token, taskId)
            .then((response) => {
              if (response.success && response.data) {
                setSelectedTask(response.data);
                setIsDetailOpen(true);
              } else {
                console.error("Failed to fetch task from notification");
              }
            })
            .catch((err) => {
              console.error("Failed to fetch task from notification", err);
            });
        }
      }
    }
  }, [searchParams, allTasks]);

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    return executiveTasks.filter((task) => {
      if (filterSearch) {
        const searchLower = filterSearch.toLowerCase();
        const parentMatches =
          task.title.toLowerCase().includes(searchLower) ||
          (task.description &&
            task.description.toLowerCase().includes(searchLower));

        const childMatches = task.childTasks?.some(
          (child) =>
            child.title.toLowerCase().includes(searchLower) ||
            (child.description &&
              child.description.toLowerCase().includes(searchLower)),
        );

        if (!parentMatches && !childMatches) return false;
      }

      // if (filterDateFrom || filterDateTo) {
      //   const taskDate = new Date(task.dueDate);
      //   if (filterDateFrom) {
      //     const fromDate = new Date(filterDateFrom);
      //     if (taskDate < fromDate) return false;
      //   }
      //   if (filterDateTo) {
      //     const toDate = new Date(filterDateTo);
      //     toDate.setHours(23, 59, 59, 999);
      //     if (taskDate > toDate) return false;
      //   }
      // }

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

      if (filterQuest !== "all") {
        if (task.quest !== filterQuest) return false;
      }

      return true;
    });
  }, [
    executiveTasks,
    filterSearch,
    filterDateFrom,
    filterDateTo,
    filterProject,
    filterPriority,
    filterStatus,
    filterQuest,
  ]);

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Blobs Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob bg-purple-500/30 dark:bg-purple-500/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-blue-500/30 dark:bg-blue-500/20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bg-pink-500/30 dark:bg-pink-500/20"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/20 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 flex items-center gap-3">
              <ListTodo className="h-8 w-8 text-indigo-500" />
              {t.taskManagerTitle}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t.taskManagerDesc}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchTasks}
              className="bg-white/50 dark:bg-slate-900/50 border-white/20 hover:bg-white/80 rounded-xl"
              title={t.refresh}
              disabled={isLoading}
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
                  ? "bg-white/50 dark:bg-slate-900/50 border-white/20 hover:bg-white/80 text-rose-500 hover:text-rose-600 rounded-xl"
                  : "rounded-xl"
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMode ? t.cancel : t.delete}
            </Button>
          </div>
        </div>

        {/* Sticky Header Section */}
        <div className="lg:sticky lg:top-0 z-30 space-y-4 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 backdrop-blur-xl bg-slate-50/80 dark:bg-slate-950/80 supports-[backdrop-filter]:bg-slate-50/30 dark:supports-[backdrop-filter]:bg-slate-950/30 transition-all rounded-b-2xl shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 pl-3 border-l-4 border-indigo-500">
              {t.tasksFromExecutives}
            </h3>
          </div>

          {/* Stats Grid - Now Sticky */}
          <ExecutiveTaskStats tasks={executiveTasks} />

          {/* Toolbar & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 w-full">
              {/* Search */}
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0077FF] transition-colors" />
                <Input
                  placeholder={t.searchByName || "Search tasks..."}
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="pl-10 w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#0077FF]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 md:pb-0">
                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className={
                    showFilters
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 rounded-xl"
                      : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                >
                  <ListFilter className="h-4 w-4 mr-2" />
                  {t.filter || "Filters"}
                </Button>

                <CreateTaskDialog
                  open={isCreateOpen}
                  onOpenChange={setIsCreateOpen}
                  projects={projects}
                  managers={supervisors}
                  isOptionsLoading={isSupervisorsLoading}
                  onTaskCreated={() => fetchTasks()}
                />

                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-[#0077FF] hover:bg-[#0066DD] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all rounded-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{t.createTask}</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>

            {/* Collapsible Filters Section */}
            {showFilters && (
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-white/5 animate-in slide-in-from-top-2 fade-in duration-200">
                <ManagerTaskFilters
                  filterSearch={filterSearch}
                  setFilterSearch={setFilterSearch}
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
                  filterQuest={filterQuest}
                  setFilterQuest={setFilterQuest}
                  projects={projects}
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: Tasks from Executives (Content) */}
        <section className="space-y-6">
          {/* Executive Tasks List */}
          {isLoading ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-12 flex items-center justify-center border border-white/10">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : executiveTasks.length === 0 ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-4">
                <ListTodo className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
                No tasks found
              </h3>
              <p className="text-slate-500">{t.noTasksFromExecutivesEmpty}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <ManagerTaskCard
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
                  userRole="Manager"
                  assignees={supervisors}
                  deleteMode={deleteMode}
                />
              ))}
            </div>
          )}
        </section>

        {/* Edit Task Dialog */}
        {editingTask && (
          <EditTaskDialog
            open={isEditOpen}
            onOpenChange={(open) => {
              setIsEditOpen(open);
              if (!open) setEditingTask(null);
            }}
            task={editingTask}
            managers={supervisors}
            projects={projects}
            isOptionsLoading={isSupervisorsLoading}
            onTaskUpdated={fetchTasks}
          />
        )}

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            isOpen={isDetailOpen}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedTask(null);
            }}
            task={selectedTask}
            onUpdate={fetchTasks}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteTaskDialog
          open={!!taskToDelete}
          onOpenChange={(open) => !open && setTaskToDelete(null)}
          onConfirm={handleDeleteTask}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
