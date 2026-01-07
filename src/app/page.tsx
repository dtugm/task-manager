"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  Briefcase,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Folder,
  Loader2,
  LayoutDashboard,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";

export default function Home() {
  const { t } = useLanguage();
  const { stats, isLoading, user } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0077FF]" />
      </div>
    );
  }

  return (
    <div className="relative isolate space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in-50 duration-500 ">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob bg-[#0077FF]/30 dark:bg-[#0077FF]/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 bg-[#F1677C]/30 dark:bg-[#F1677C]/20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 bg-[#FFB200]/30 dark:bg-[#FFB200]/20"></div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0077FF] to-[#0C426A] shadow-lg shadow-[#0077FF]/20 text-white">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0C426A] to-[#0077FF] dark:from-white dark:to-slate-300">
            Dashboard Overview
          </h1>
          <p className="text-[#0C426A]/70 dark:text-slate-400 font-medium">
            Welcome back, here's what's happening today.
          </p>
        </div>
      </div>

      <WelcomeBanner user={user} stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t.totalTasks}
          value={stats.totalTasks.toString()}
          subtitle={t.inProgress}
          icon={Briefcase}
          iconClassName="bg-[#0077FF]/10 text-[#0077FF]"
          trendUp={true}
          trend="↗"
        />
        <StatsCard
          title={t.myTask}
          value={stats.myTasksCount.toString()}
          icon={CheckSquare}
          iconClassName="bg-[#F1677C]/10 text-[#F1677C]"
        />
        <StatsCard
          title={t.projectMgmt}
          value={stats.totalProjects.toString()}
          icon={Folder}
          iconClassName="bg-[#FFB200]/10 text-[#FFB200]"
        />
        <div className="bg-gradient-to-br from-[#0C426A] to-[#0077FF] rounded-xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-24 w-24" />
          </div>
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="p-2 bg-white/20 w-fit rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90 mt-4 text-blue-100">
                {t.totalPoints}
              </p>
              <div className="text-3xl font-bold mt-1">{stats.totalPoints}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-1 shadow-xl shadow-slate-200/40 dark:shadow-black/40 ring-1 ring-white/50 dark:ring-white/5">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
