"use client";

import { useLanguage } from "@/contexts/language-context";
import { Task } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Tag,
  Calendar as CalendarIcon,
  Award,
  TrendingUp,
} from "lucide-react";

interface MyTaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function MyTaskCard({ task, onClick }: MyTaskCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(task)}
    >
      <CardContent className="p-6">
        {/* Title and Badges */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
            <p className="text-muted-foreground text-sm">{task.description}</p>
          </div>

          <div className="flex gap-2 ml-4">
            <Badge
              variant="secondary"
              className={
                task.priority === "HIGH"
                  ? "bg-red-100 text-red-700 hover:bg-red-100"
                  : task.priority === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                  : "bg-green-100 text-green-700 hover:bg-green-100"
              }
            >
              {task.priority === "HIGH"
                ? t.high
                : task.priority === "MEDIUM"
                ? t.medium
                : t.low}
            </Badge>
            <Badge
              variant="secondary"
              className={
                task.progress === 100
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : task.progress > 0
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
              }
            >
              {task.progress === 100
                ? t.completed
                : task.progress > 0
                ? t.inProgress
                : t.pending}
            </Badge>
          </div>
        </div>

        {/* From, Project, Due Date */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              {t.from}: {task.creator?.fullName || "Manager"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{task.project?.name || t.project}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          {task.points && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>
                {task.points} {t.points}
              </span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              <TrendingUp className="h-4 w-4" />
              {t.progress}
            </span>
            <span className="font-bold">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
