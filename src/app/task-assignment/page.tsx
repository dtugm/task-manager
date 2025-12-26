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
  Plus,
  Search,
  Calendar as CalendarIcon,
  Trash2,
  User,
} from "lucide-react";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { useLanguage } from "@/contexts/language-context";

export default function TaskAssignmentPage() {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date>();
  const [userRole, setUserRole] = useState("Executive"); // Default for demo

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.taskAssignmentTitle}
          </h2>
          <p className="text-muted-foreground">{t.taskAssignmentDesc}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t.deleteMode}
          </Button>
          <CreateTaskModal userRole={userRole} />
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Tasks */}
        <div className="bg-blue-600 text-white rounded-xl p-4 shadow-lg shadow-blue-600/20 relative overflow-hidden h-32 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-90">
              {t.totalTasks}
            </span>
            <Tag className="h-5 w-5 opacity-80" />
          </div>
          <div className="text-3xl font-bold">1</div>
        </div>

        {/* Completed */}
        <div className="bg-green-500 text-white rounded-xl p-4 shadow-lg shadow-green-500/20 relative overflow-hidden h-32 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-90">
              {t.completed}
            </span>
            <CheckCircle2 className="h-6 w-6 opacity-80" />
          </div>
          <div className="text-3xl font-bold">0</div>
        </div>

        {/* In Progress */}
        <div className="bg-purple-600 text-white rounded-xl p-4 shadow-lg shadow-purple-600/20 relative overflow-hidden h-32 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-90">
              {t.inProgress}
            </span>
            <TrendingUp className="h-6 w-6 opacity-80" />
          </div>
          <div className="text-3xl font-bold">0</div>
        </div>

        {/* To Do */}
        <div className="bg-orange-500 text-white rounded-xl p-4 shadow-lg shadow-orange-500/20 relative overflow-hidden h-32 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-90">{t.todo}</span>
            <Clock className="h-6 w-6 opacity-80" />
          </div>
          <div className="text-3xl font-bold">1</div>
        </div>

        {/* Pending Approval */}
        <div className="bg-amber-500 text-white rounded-xl p-4 shadow-lg shadow-amber-500/20 relative overflow-hidden h-32 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-90">
              {t.pendingApproval}
            </span>
            <AlertCircle className="h-6 w-6 opacity-80" />
          </div>
          <div className="text-3xl font-bold">0</div>
        </div>
      </div>

      {/* Filter Stats Section */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t.filterTasks}</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Filter by Status */}
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

              {/* Filter by Project */}
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

              {/* Filter by Priority */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  {t.filterByPriority}
                </label>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-muted/30 border-none shadow-sm h-10">
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

              {/* Filter by Date */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  {t.filterByDate}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-muted/30 border-none shadow-sm h-10",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>{t.pickADate}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Manager */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  {t.searchManager}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t.searchByName}
                    className="pl-9 bg-muted/30 border-none shadow-sm h-10"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground pt-2">
              {t.showingTasks} 0 of 0
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Empty State / Task List Placeholder */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">Web Task Manager</h3>
              <p className="text-muted-foreground text-sm">frontend backend</p>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-700 hover:bg-red-100"
              >
                {t.high}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-100"
              >
                {t.todo}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Sarah Connor</span>
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

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-blue-600 font-medium">
                <TrendingUp className="h-4 w-4" />
                Task Progress
              </span>
              <span className="font-bold">0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
