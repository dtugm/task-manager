"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar as CalendarIcon,
  Filter,
  Briefcase,
  User,
  Building,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface AttendanceLogFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  date: DateRange | undefined;
  setDate: (value: DateRange | undefined) => void;
  recordType: string;
  setRecordType: (value: string) => void;
  workType: string;
  setWorkType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  projectId: string;
  setProjectId: (value: string) => void;
  projects: Array<{ id: string; name: string }>;
  clearFilters: () => void;
  t: any; // Language translations
}

export const AttendanceLogFilters = ({
  search,
  setSearch,
  date,
  setDate,
  recordType,
  setRecordType,
  workType,
  setWorkType,
  status,
  setStatus,
  role,
  setRole,
  projectId,
  setProjectId,
  projects,
  clearFilters,
  t,
}: AttendanceLogFiltersProps) => {
  return (
    <div className="flex flex-col xl:flex-row gap-4 justify-between mb-8 p-4 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/20">
      <div className="flex flex-col md:flex-row gap-4 flex-1 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 md:max-w-xs group min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          <Input
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/60 dark:bg-slate-900/60 border-transparent focus:border-purple-500/50 shadow-sm h-10 rounded-xl transition-all"
          />
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full md:w-[260px] justify-start text-left font-normal bg-white/60 dark:bg-slate-900/60 border-transparent shadow-sm h-10 rounded-xl hover:bg-white/80",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span className="text-slate-500">{t.pickADate}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 rounded-xl shadow-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
            align="start"
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Record Type Filter (Main Type) */}
        <Select
          value={recordType}
          onValueChange={(val) => {
            setRecordType(val);
            setWorkType("all"); // Reset subtypes
            setStatus("all");
          }}
        >
          <SelectTrigger className="w-full md:w-[160px] bg-white/60 dark:bg-slate-900/60 border-transparent shadow-sm h-10 rounded-xl">
            <Filter className="mr-2 h-4 w-4 text-slate-500" />
            <SelectValue placeholder="Record Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="Attendance">Attendance</SelectItem>
            <SelectItem value="Leave">Leave</SelectItem>
            <SelectItem value="Overtime">Overtime</SelectItem>
          </SelectContent>
        </Select>

        {/* Conditional Sub-Filters */}
        {recordType === "Attendance" && (
          <Select value={workType} onValueChange={setWorkType}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/60 dark:bg-slate-900/60 border-transparent shadow-sm h-10 rounded-xl animate-in fade-in zoom-in-95 duration-200">
              <Briefcase className="mr-2 h-4 w-4 text-slate-500" />
              <SelectValue placeholder="Work Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <SelectItem value="all">All Work Types</SelectItem>
              <SelectItem value="Work from Office">Work from Office</SelectItem>
              <SelectItem value="Work from Home">Work from Home</SelectItem>
              <SelectItem value="Field Work">Field Work</SelectItem>
            </SelectContent>
          </Select>
        )}

        {(recordType === "Leave" || recordType === "Overtime") && (
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[150px] bg-white/60 dark:bg-slate-900/60 border-transparent shadow-sm h-10 rounded-xl animate-in fade-in zoom-in-95 duration-200">
              <Filter className="mr-2 h-4 w-4 text-slate-500" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Project Filter */}
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-full md:w-[200px] bg-white/60 dark:bg-slate-900/60 border-transparent shadow-sm h-10 rounded-xl">
            <Building className="mr-2 h-4 w-4 text-slate-500" />
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full md:w-[150px] bg-white/60 dark:bg-slate-900/60 border-transparent shadow-sm h-10 rounded-xl">
            <User className="mr-2 h-4 w-4 text-slate-500" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Super Admin">Super Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Employee">Employee</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="h-10 bg-white/60 dark:bg-slate-900/60 border-transparent text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors shadow-sm rounded-xl px-4"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
};
