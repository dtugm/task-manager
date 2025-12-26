"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Search,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { CreateRelatedTaskModal } from "@/components/tasks/CreateRelatedTaskModal";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { useLanguage } from "@/contexts/language-context";

export default function TaskManagerForManagerPage() {
  const { t } = useLanguage();

  // Stats for Executive Tasks
  const execStats = [
    {
      label: t.totalTasks,
      value: 0,
      icon: Tag,
      color: "bg-blue-600",
      shadow: "shadow-blue-600/20",
    },
    {
      label: t.pendingApproval,
      value: 0,
      icon: AlertCircle,
      color: "bg-orange-500",
      shadow: "shadow-orange-500/20",
    },
    {
      label: t.accepted,
      value: 1,
      icon: Check,
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

  // Stats for Employee Tasks
  const empStats = [
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
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t.taskManagerTitle}
        </h2>
        <p className="text-muted-foreground">{t.taskManagerDesc}</p>
      </div>

      {/* SECTION 1: Tasks from Executives */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">{t.tasksFromExecutives}</h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {execStats.map((stat, i) => {
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
        {/* Task Card from Executive */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Web Task Manager</h3>
                <p className="text-muted-foreground text-sm">
                  frontend backend
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-700 hover:bg-red-100"
                >
                  High
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                >
                  In Progress
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>From: John Doe</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>GENERAL</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Dec 26, 2025</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-blue-600 font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Progress from Supervisor
                  </span>
                  <span className="font-bold">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>

              <CreateRelatedTaskModal relatedTaskTitle="Web Task Manager" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 2: All Employee Tasks */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t.allEmployeeTasks}</h3>
          {/* Pass 'Manager' role so they can see Points input if we update the modal */}
          <CreateTaskModal userRole="Manager" />
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
                {t.filterTasks}
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
        <div className="h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
          <Tag className="h-16 w-16 mb-4 text-muted-foreground/30" />
          <p className="text-lg font-medium">{t.noTasksCreated}</p>
        </div>
      </section>
    </div>
  );
}
