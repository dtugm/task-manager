"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Task } from "@/types/task";
import {
  Loader2,
  CheckSquare,
  RefreshCw,
  Search,
  ListFilter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [showFilters, setShowFilters] = useState(false);

  // Filter State
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterQuest, setFilterQuest] = useState<string>("all");

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

      // Filter by quest
      if (filterQuest !== "all") {
        if (task.quest !== filterQuest) return false;
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
    filterQuest,
  ]);

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
              <CheckSquare className="h-8 w-8 text-indigo-500" />
              {t.myTasksTitle}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t.myTasksDesc}
            </p>
          </div>
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
        </div>

        <section>
          {/* Sticky Header Section */}
          <div className="sticky top-0 z-30 space-y-4 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 backdrop-blur-xl bg-slate-50/80 dark:bg-slate-950/80 supports-[backdrop-filter]:bg-slate-50/30 dark:supports-[backdrop-filter]:bg-slate-950/30 transition-all rounded-b-2xl shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 mb-6">
            {/* Stats Grid - Now Sticky */}
            <MyTaskStats tasks={tasks} />

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
                </div>
              </div>

              {/* Collapsible Filters Section */}
              {showFilters && (
                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-white/5 animate-in slide-in-from-top-2 fade-in duration-200">
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
                    filterQuest={filterQuest}
                    setFilterQuest={setFilterQuest}
                    projects={projects}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Task List */}
          {isLoading ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-12 flex items-center justify-center border border-white/10">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-4">
                <CheckSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
                No tasks assigned
              </h3>
              <p className="text-slate-500">{t.noTasksAssigned}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <MyTaskCard
                  key={task.id}
                  task={task}
                  onClick={(task) => {
                    setSelectedTask(task);
                    setIsDetailOpen(true);
                  }}
                />
              ))}
            </div>
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
    </div>
  );
}
