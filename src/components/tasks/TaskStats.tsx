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
      <div className="bg-gradient-to-br from-[#0077FF] to-[#0055AA] text-white rounded-2xl p-4 shadow-lg shadow-[#0077FF]/25 h-32 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium opacity-90">{t.totalTasks}</span>
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Tag className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold">{stats.total}</div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-4 shadow-lg shadow-green-500/25 h-32 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium opacity-90">Accepted</span>
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold">{stats.completed}</div>
      </div>

      <div className="bg-gradient-to-br from-[#F1677C] to-[#D1475C] text-white rounded-2xl p-4 shadow-lg shadow-[#F1677C]/25 h-32 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium opacity-90">{t.inProgress}</span>
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold">{stats.inProgress}</div>
      </div>

      <div className="bg-gradient-to-br from-[#FFB200] to-[#DF9200] text-white rounded-2xl p-4 shadow-lg shadow-[#FFB200]/25 h-32 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium opacity-90">
            Pending Approval
          </span>
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Clock className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold">{stats.todo}</div>
      </div>
    </div>
  );
}
