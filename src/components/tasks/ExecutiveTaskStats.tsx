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
        gradient: "from-blue-500 to-cyan-500",
        bg: "bg-blue-500/10",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-600 dark:text-blue-400",
      },
      {
        label: t.pendingApproval,
        value: tasks.filter((t) => t.progress === 0).length,
        icon: AlertCircle,
        gradient: "from-orange-500 to-red-500",
        bg: "bg-orange-500/10",
        border: "border-orange-200 dark:border-orange-800",
        text: "text-orange-600 dark:text-orange-400",
      },
      {
        label: t.accepted,
        value: tasks.filter((t) => t.progress > 0 && t.progress < 100).length,
        icon: Check,
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-500/10",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-600 dark:text-purple-400",
      },
      {
        label: t.completed,
        value: tasks.filter((t) => t.progress === 100).length,
        icon: CheckCircle2,
        gradient: "from-green-500 to-emerald-500",
        bg: "bg-green-500/10",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-600 dark:text-green-400",
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
            className={`
              relative overflow-hidden rounded-2xl p-6 h-32 flex flex-col justify-between transition-all duration-300 hover:shadow-lg
              bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border ${stat.border}
              group cursor-default
            `}
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
            />

            <div className="flex justify-between items-start z-10">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.text}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-end gap-2 z-10">
              <span
                className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${stat.gradient}`}
              >
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
