"use client";

import { useLanguage } from "@/contexts/language-context";
import { Task } from "@/types/task";
import { Tag, CheckCircle2, TrendingUp, Award } from "lucide-react";

interface MyTaskStatsProps {
  tasks: Task[];
}

export function MyTaskStats({ tasks }: MyTaskStatsProps) {
  const { t } = useLanguage();

  const stats = [
    {
      label: t.totalAssigned,
      value: tasks.length,
      icon: Tag,
      color: "bg-blue-600",
      shadow: "shadow-blue-600/20",
    },
    {
      label: t.completed,
      value: tasks.filter((t) => t.progress === 100).length,
      icon: CheckCircle2,
      color: "bg-green-500",
      shadow: "shadow-green-500/20",
    },
    {
      label: t.inProgress,
      value: tasks.filter((t) => t.progress > 0 && t.progress < 100).length,
      icon: TrendingUp,
      color: "bg-purple-600",
      shadow: "shadow-purple-600/20",
    },
    {
      label: t.totalPoints,
      // Only sum points if progress is 100 (completed)
      value: tasks
        .filter((t) => t.progress === 100)
        .reduce((sum, t) => sum + (t.points || 0), 0),
      icon: Award,
      color: "bg-yellow-500",
      shadow: "shadow-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`${stat.color} text-white rounded-xl p-4 shadow-lg ${stat.shadow} relative overflow-hidden h-32 flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium opacity-90">
                {stat.label}
              </span>
              <Icon className="h-6 w-6 opacity-80" />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
