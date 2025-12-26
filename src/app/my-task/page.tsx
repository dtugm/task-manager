"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag, CheckCircle2, TrendingUp, Clock, Award } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";

export default function MyTasksPage() {
  const { t } = useLanguage();

  const stats = [
    {
      label: t.totalTasks,
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
    {
      label: t.totalPoints,
      value: 0,
      icon: Award,
      color: "bg-yellow-500",
      shadow: "shadow-yellow-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.myTasksTitle}</h2>
        <p className="text-muted-foreground">{t.myTasksDesc}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t.filterByStatus}
              </label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-muted/30 border-none shadow-sm h-10">
                  <SelectValue placeholder={t.allStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatus}</SelectItem>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                  <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                  <SelectItem value="completed">{t.completed}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t.filterByProject}
              </label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-muted/30 border-none shadow-sm h-10">
                  <SelectValue placeholder={t.allProjects} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allProjects}</SelectItem>
                  <SelectItem value="alpha">Project Alpha</SelectItem>
                  <SelectItem value="beta">Project Beta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <div className="h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
        <Tag className="h-16 w-16 mb-4 text-muted-foreground/30" />
        <p className="text-lg font-medium">{t.noTasksAssigned}</p>
      </div>
    </div>
  );
}
