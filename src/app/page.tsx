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
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";

export default function Home() {
  const { t } = useLanguage();
  const { stats, isLoading, user } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner user={user} stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t.totalTasks}
          value={stats.totalTasks.toString()}
          subtitle={t.inProgress}
          icon={Briefcase}
          iconClassName="bg-blue-500/10 text-blue-500"
          trendUp={true}
          trend="↗"
        />
        <StatsCard
          title={t.myTask}
          value={stats.myTasksCount.toString()}
          icon={CheckSquare}
          iconClassName="bg-violet-500/10 text-violet-500"
        />
        {/* Changed Reimbursement to Projects since API is available */}
        <StatsCard
          title={t.projectMgmt}
          value={stats.totalProjects.toString()}
          icon={Folder}
          iconClassName="bg-orange-500/10 text-orange-500"
        />
        <div className="bg-green-500 rounded-lg p-6 text-white shadow-sm">
          <div className="flex flex-col justify-between h-full">
            <div className="p-2 bg-white/20 w-fit rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90 mt-4">
                {t.totalPoints}
              </p>
              <div className="text-2xl font-bold">{stats.totalPoints}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <RecentActivity />
      </div>
    </div>
  );
}
