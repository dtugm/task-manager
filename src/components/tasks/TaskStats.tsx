import { Tag, CheckCircle2, TrendingUp, Clock } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
  };
}

export function TaskStats({ stats }: TaskStatsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-600 text-white rounded-xl p-4 shadow-lg h-32 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium opacity-90">{t.totalTasks}</span>
          <Tag className="h-5 w-5 opacity-80" />
        </div>
        <div className="text-3xl font-bold">{stats.total}</div>
      </div>

      <div className="bg-green-500 text-white rounded-xl p-4 shadow-lg h-32 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium opacity-90">{t.completed}</span>
          <CheckCircle2 className="h-6 w-6 opacity-80" />
        </div>
        <div className="text-3xl font-bold">{stats.completed}</div>
      </div>

      <div className="bg-purple-600 text-white rounded-xl p-4 shadow-lg h-32 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium opacity-90">{t.inProgress}</span>
          <TrendingUp className="h-6 w-6 opacity-80" />
        </div>
        <div className="text-3xl font-bold">{stats.inProgress}</div>
      </div>

      <div className="bg-orange-500 text-white rounded-xl p-4 shadow-lg h-32 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium opacity-90">{t.todo}</span>
          <Clock className="h-6 w-6 opacity-80" />
        </div>
        <div className="text-3xl font-bold">{stats.todo}</div>
      </div>
    </div>
  );
}
