"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  CheckCircle2,
  TrendingUp,
  Clock,
  AlertCircle,
  Check,
} from "lucide-react";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";

import { useLanguage } from "@/contexts/language-context";

export default function TaskManagerForSupervisorPage() {
  const { t } = useLanguage();

  // Stats for Manager Tasks (Upstream)
  const managerStats = [
    {
      label: t.totalTasks,
      value: 0,
      icon: Tag,
      color: "bg-blue-600",
      shadow: "shadow-blue-600/20",
    },
    {
      label: t.pending,
      value: 0,
      icon: AlertCircle,
      color: "bg-orange-500",
      shadow: "shadow-orange-500/20",
    },
    {
      label: t.inProgress,
      value: 0,
      icon: TrendingUp,
      color: "bg-purple-600",
      shadow: "shadow-purple-600/20",
    },
    {
      label: t.completed,
      value: 0,
      icon: CheckCircle2,
      color: "bg-green-500",
      shadow: "shadow-green-500/20",
    },
  ];

  // Stats for Employee Tasks (Downstream)
  const empStats = [
    {
      label: t.assignedTasks,
      value: 0,
      icon: Tag,
      color: "bg-blue-600",
      shadow: "shadow-blue-600/20",
    },
    {
      label: t.completed,
      value: 0,
      icon: CheckCircle2,
      color: "bg-green-500",
      shadow: "shadow-green-500/20",
    },
    {
      label: t.inProgress,
      value: 0,
      icon: TrendingUp,
      color: "bg-purple-600",
      shadow: "shadow-purple-600/20",
    },
    {
      label: t.todo,
      value: 0,
      icon: Clock,
      color: "bg-orange-500",
      shadow: "shadow-orange-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t.supervisorDashboard}
        </h2>
        <p className="text-muted-foreground">{t.supervisorDesc}</p>
      </div>

      {/* SECTION 1: Tasks from Managers */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">{t.tasksFromManagers}</h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {managerStats.map((stat, i) => {
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

        {/* Empty State */}
        <div className="h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
          <Tag className="h-12 w-12 mb-3 text-muted-foreground/30" />
          <p className="font-medium">{t.noTasksReceived}</p>
        </div>
      </section>

      {/* SECTION 2: Employee Task Assignment */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t.employeeTaskAssignment}</h3>
          {/* Pass 'Supervisor' role so they can see Points input (once enabled) */}
          <CreateTaskModal userRole="Supervisor" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {empStats.map((stat, i) => {
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

        {/* Filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground mb-4">
                {t.filterAssignments}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t.filterByStatus}
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-muted/30 border-none shadow-sm">
                      <SelectValue placeholder={t.allStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allStatus}</SelectItem>
                      <SelectItem value="pending">{t.pending}</SelectItem>
                      <SelectItem value="progress">{t.inProgress}</SelectItem>
                      <SelectItem value="completed">{t.completed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t.filterByProject}
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-muted/30 border-none shadow-sm">
                      <SelectValue placeholder={t.allProjects} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allProjects}</SelectItem>
                      <SelectItem value="alpha">Project Alpha</SelectItem>
                      <SelectItem value="beta">Project Beta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    {t.filterByPriority}
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-muted/30 border-none shadow-sm">
                      <SelectValue placeholder={t.allPriority} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allPriority}</SelectItem>
                      <SelectItem value="high">{t.high}</SelectItem>
                      <SelectItem value="medium">{t.medium}</SelectItem>
                      <SelectItem value="low">{t.low}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <div className="h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
          <Tag className="h-12 w-12 mb-3 text-muted-foreground/30" />
          <p className="font-medium">{t.noTasksAssignedEmployee}</p>
        </div>
      </section>
    </div>
  );
}
