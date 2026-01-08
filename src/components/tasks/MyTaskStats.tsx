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
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
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
    {
      label: t.inProgress,
      value: tasks.filter((t) => t.progress > 0 && t.progress < 100).length,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
    },
    {
      label: t.totalPoints,
      // Only sum points if status is ACCEPTED
      value: tasks
        .filter((t) => t.status === "ACCEPTED")
        .reduce((sum, t) => sum + (t.points || 0), 0),
      icon: Award,
      gradient: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-600 dark:text-yellow-400",
    },
  ];

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
