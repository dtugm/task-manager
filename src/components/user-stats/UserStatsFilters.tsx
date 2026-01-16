"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import {
  Search,
  Calendar,
  Filter,
  UserCog,
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Check,
} from "lucide-react";

interface UserStatsFiltersProps {
  filterSearch: string;
  setFilterSearch: (value: string) => void;
  filterDateFrom: string;
  setFilterDateFrom: (value: string) => void;
  filterDateTo: string;
  setFilterDateTo: (value: string) => void;
  filterRole: string;
  setFilterRole: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export function UserStatsFilters({
  filterSearch,
  setFilterSearch,
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
  filterRole,
  setFilterRole,
  sortBy,
  setSortBy,
}: UserStatsFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl shadow-indigo-500/5">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-slate-500" />
        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {t.filter || "Filter"}
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Filter */}
        <div className="space-y-1.5 group">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 group-focus-within:text-purple-600 transition-colors">
            {t.searchByName || "Search by Name"}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              type="text"
              placeholder={t.search || "Search..."}
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="pl-10 bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="space-y-1.5 group">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 group-focus-within:text-purple-600 transition-colors">
            {t.role || "Role"}
          </label>
          <div className="relative">
            <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="pl-10 bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm text-slate-600 dark:text-slate-300">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date From Filter */}
        <div className="space-y-1.5 group">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 group-focus-within:text-purple-600 transition-colors">
            {t.fromDate || "From Date"}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="pl-10 bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm text-slate-600 dark:text-slate-300"
            />
          </div>
        </div>

        {/* Date To Filter */}
        <div className="space-y-1.5 group">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 group-focus-within:text-purple-600 transition-colors">
            {t.toDate || "To Date"}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="pl-10 bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm text-slate-600 dark:text-slate-300"
            />
          </div>
        </div>

        {/* Sort By Filter */}
        <div className="space-y-1.5 group">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 group-focus-within:text-purple-600 transition-colors">
            Sort By
          </label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start pl-10 bg-white/60 dark:bg-slate-800/60 border-transparent focus:border-purple-500/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm rounded-xl h-10 transition-all font-medium text-sm text-slate-600 dark:text-slate-300 relative text-left font-normal"
                >
                  <span className="truncate">
                    {sortBy === "totalTasks-desc"
                      ? "Tasks (Highest First)"
                      : sortBy === "totalTasks-asc"
                      ? "Tasks (Lowest First)"
                      : sortBy === "totalPoints-desc"
                      ? "Points (Highest First)"
                      : sortBy === "totalPoints-asc"
                      ? "Points (Lowest First)"
                      : "Sort by"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-2 rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl"
                align="end"
              >
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h5 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Tasks
                    </h5>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        onClick={() => setSortBy("totalTasks-desc")}
                        className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ${
                          sortBy === "totalTasks-desc"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ArrowDownWideNarrow className="h-4 w-4" />
                          <span>Highest First</span>
                        </div>
                        {sortBy === "totalTasks-desc" && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setSortBy("totalTasks-asc")}
                        className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ${
                          sortBy === "totalTasks-asc"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ArrowUpNarrowWide className="h-4 w-4" />
                          <span>Lowest First</span>
                        </div>
                        {sortBy === "totalTasks-asc" && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2" />

                  <div className="space-y-1">
                    <h5 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Points
                    </h5>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        onClick={() => setSortBy("totalPoints-desc")}
                        className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ${
                          sortBy === "totalPoints-desc"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ArrowDownWideNarrow className="h-4 w-4" />
                          <span>Highest First</span>
                        </div>
                        {sortBy === "totalPoints-desc" && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setSortBy("totalPoints-asc")}
                        className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ${
                          sortBy === "totalPoints-asc"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ArrowUpNarrowWide className="h-4 w-4" />
                          <span>Lowest First</span>
                        </div>
                        {sortBy === "totalPoints-asc" && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
