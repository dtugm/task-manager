"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";
import { useLanguage } from "@/contexts/language-context";
import { Search, Calendar, Filter } from "lucide-react";

interface ManagerTaskFiltersProps {
  filterSearch: string;
  setFilterSearch: (value: string) => void;
  filterDateFrom: string;
  setFilterDateFrom: (value: string) => void;
  filterDateTo: string;
  setFilterDateTo: (value: string) => void;
  filterProject: string;
  setFilterProject: (value: string) => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterQuest?: string;
  setFilterQuest?: (value: string) => void;
  projects: Project[];
}

export function ManagerTaskFilters({
  filterSearch,
  setFilterSearch,
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
  filterProject,
  setFilterProject,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  filterQuest,
  setFilterQuest,
  projects,
}: ManagerTaskFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl shadow-indigo-500/5">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-slate-500" />
        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {t.filterTasks}
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Filter */}
        <div className="space-y-1.5 group">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 group-focus-within:text-purple-600 transition-colors">
            {t.searchByName}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="pl-9 bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm"
            />
          </div>
        </div>

        {/* Date From Filter */}
        <div className="space-y-1.5 group">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 group-focus-within:text-purple-600 transition-colors">
            {t.fromDate}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="pl-9 bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm text-slate-600 dark:text-slate-300"
            />
          </div>
        </div>

        {/* Date To Filter */}
        <div className="space-y-1.5 group">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 group-focus-within:text-purple-600 transition-colors">
            {t.toDate}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="pl-9 bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm text-slate-600 dark:text-slate-300"
            />
          </div>
        </div>

        {/* Project Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">
            {t.project}
          </label>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm">
              <SelectValue placeholder={t.allProjects} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <SelectItem value="all">{t.allProjects}</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project?.id} value={project?.id || ""}>
                  {project?.name || t.unknown}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">
            {t.priority}
          </label>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm">
              <SelectValue placeholder={t.allPriority} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <SelectItem value="all">{t.allPriority}</SelectItem>
              <SelectItem value="high">{t.high}</SelectItem>
              <SelectItem value="medium">{t.medium}</SelectItem>
              <SelectItem value="low">{t.low}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">
            {t.status}
          </label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm">
              <SelectValue placeholder={t.allStatus} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <SelectItem value="all">{t.allStatus}</SelectItem>
              <SelectItem value="pending">{t.pending}</SelectItem>
              <SelectItem value="in-progress">{t.inProgress}</SelectItem>
              <SelectItem value="completed">{t.completed}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quest Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">
            Quest
          </label>
          <Select value={filterQuest} onValueChange={setFilterQuest}>
            <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm">
              <SelectValue placeholder="All Quests" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <SelectItem value="all">All Quests</SelectItem>
              <SelectItem value="main">Main</SelectItem>
              <SelectItem value="side">Side</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
