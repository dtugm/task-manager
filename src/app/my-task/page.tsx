"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Task } from "@/types/task";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { useMyTasks } from "@/hooks/useMyTasks";
import { MyTaskStats } from "@/components/tasks/MyTaskStats";
import { MyTaskFilters } from "@/components/tasks/MyTaskFilters";
import { MyTaskCard } from "@/components/tasks/MyTaskCard";

export default function MyTasksPage() {
  const { t } = useLanguage();
  const { tasks, projects, isLoading, fetchTasks } = useMyTasks();

  // Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter State
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by search (task name)
      if (filterSearch) {
        const searchLower = filterSearch.toLowerCase();
        if (!task.title.toLowerCase().includes(searchLower)) return false;
      }

      // Filter by date range
      if (filterDateFrom || filterDateTo) {
        const taskDate = new Date(task.dueDate);
        if (filterDateFrom) {
          const fromDate = new Date(filterDateFrom);
          if (taskDate < fromDate) return false;
        }
        if (filterDateTo) {
          const toDate = new Date(filterDateTo);
          toDate.setHours(23, 59, 59, 999); // Include the entire end date
          if (taskDate > toDate) return false;
        }
      }

      // Filter by project
      if (filterProject !== "all") {
        const projectId = task.project?.id || task.projectId;
        if (projectId !== filterProject) return false;
      }

      // Filter by priority
      if (filterPriority !== "all") {
        if (task.priority !== filterPriority.toUpperCase()) return false;
      }

      // Filter by status
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
    tasks,
    filterSearch,
    filterDateFrom,
    filterDateTo,
    filterProject,
    filterPriority,
    filterStatus,
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.myTasksTitle}</h2>
        <p className="text-muted-foreground">{t.myTasksDesc}</p>
      </div>

      <section className="space-y-6">
        {/* Stats Grid */}
        <MyTaskStats tasks={tasks} />

        {/* Filters */}
        <MyTaskFilters
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
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {t.noTasksAssigned}
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <MyTaskCard
              key={task.id}
              task={task}
              onClick={(task) => {
                setSelectedTask(task);
                setIsDetailOpen(true);
              }}
            />
          ))
        )}
      </section>

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
