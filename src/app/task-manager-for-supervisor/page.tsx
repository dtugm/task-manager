"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { CreateTaskModal } from "@/components/tasks/CreateTaskSupervisor";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { ExecutiveTaskStats } from "@/components/tasks/ExecutiveTaskStats";
import { ManagerTaskFilters } from "@/components/tasks/ManagerTaskFilters";
import { ExecutiveTaskCard } from "@/components/tasks/ExecutiveTaskCard";
import { useLanguage } from "@/contexts/language-context";
import { taskApi } from "@/lib/task-api";
import { Task } from "@/types/task";
import { useSupervisorTasks } from "@/hooks/useSupervisorTasks";

export default function TaskManagerForSupervisorPage() {
  const { t } = useLanguage();

  // Custom Hook for Data Fetching & Strict Filtering
  const {
    executiveTasks, // Now filtered to assigned-to-me or created-by-me
    projects,
    employees,
    isLoading,
    isEmployeesLoading,
    fetchTasks,
  } = useSupervisorTasks();

  // Local UI State
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  // Filter State
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

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
              child.description.toLowerCase().includes(searchLower))
        );

        if (!parentMatches && !childMatches) return false;
      }

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
  }, [
    executiveTasks,
    filterSearch,
    filterDateFrom,
    filterDateTo,
    filterProject,
    filterPriority,
    filterStatus,
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Task Manager (Supervisor)
          </h2>
          <p className="text-muted-foreground">
            Manage tasks and assign to employees
          </p>
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
      </div>

      {/* SECTION 1: Tasks */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t.allTasks}</h3>
          <CreateTaskModal userRole="Supervisor" onTaskCreated={fetchTasks} />
        </div>

        {/* Stats Grid */}
        <ExecutiveTaskStats tasks={executiveTasks} />

        {/* Filters */}
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
          projects={projects}
        />

        {/* Task List */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : executiveTasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {t.noTasksFromExecutivesEmpty}
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
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
              targetRole="Employee"
            />
          ))
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
          managers={employees as any} // Pass employees as managers (generic assignees)
          isOptionsLoading={isEmployeesLoading}
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
  );
}
