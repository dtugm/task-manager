"use client";

import { useMemo } from "react";
import {
  Tag,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Check,
} from "lucide-react";
import { Task } from "@/types/task";
import { useLanguage } from "@/contexts/language-context";

interface ExecutiveTaskStatsProps {
  tasks: Task[];
}

export function ExecutiveTaskStats({ tasks }: ExecutiveTaskStatsProps) {
  const { t } = useLanguage();

  const stats = useMemo(
    () => [
      {
        label: t.totalTasks,
        value: tasks.length,
        icon: Tag,
        color: "bg-blue-600",
        shadow: "shadow-blue-600/20",
      },
      {
        label: t.pendingApproval,
        value: tasks.filter((t) => t.progress === 0).length,
        icon: AlertCircle,
        color: "bg-orange-500",
        shadow: "shadow-orange-500/20",
      },
      {
        label: t.accepted,
        value: tasks.filter((t) => t.progress > 0 && t.progress < 100).length,
        icon: Check,
        color: "bg-purple-600",
        shadow: "shadow-purple-600/20",
      },
      {
        label: t.completed,
        value: tasks.filter((t) => t.progress === 100).length,
        icon: CheckCircle2,
        color: "bg-green-500",
        shadow: "shadow-green-500/20",
      },
    ],
    [tasks, t]
  );

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
