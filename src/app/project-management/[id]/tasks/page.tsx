"use client";

import { useProjectTasks } from "@/hooks/useProjectTasks";
import { ProjectTaskCard } from "@/components/tasks/ProjectTaskCard";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Task } from "@/types/task";
import { ProjectTaskDetailModal } from "@/components/tasks/ProjectTaskDetailModal";

import { use } from "react";

export default function ProjectTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { tasks, isLoading, fetchTasks } = useProjectTasks(id);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Dialog states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob bg-purple-500/30 dark:bg-purple-500/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-blue-500/30 dark:bg-blue-500/20"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Project Tasks
            </h1>
            <p className="text-muted-foreground">Tasks for project ID: {id}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-12 bg-white/30 backdrop-blur-md rounded-xl border border-white/20">
            <p className="text-lg font-medium">
              No tasks found for this project
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <ProjectTaskCard
                key={task.id}
                task={task}
                expandedTasks={expandedTasks}
                toggleExpand={toggleExpand}
                onSelectTask={(t) => {
                  setSelectedTask(t);
                  setIsDetailOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Task Detail Modal */}
        {selectedTask && (
          <ProjectTaskDetailModal
            isOpen={isDetailOpen}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedTask(null);
            }}
            task={selectedTask}
          />
        )}
      </div>
    </div>
  );
}
