"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  RotateCcw,
  Download,
  History,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { useLanguage } from "@/contexts/language-context";

export default function AttendanceLogPage() {
  const { t } = useLanguage();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Blobs Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob bg-purple-500/30 dark:bg-purple-500/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-blue-500/30 dark:bg-blue-500/20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bg-pink-500/30 dark:bg-pink-500/20"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 flex items-center gap-3">
              <History className="h-8 w-8 text-indigo-500" />
              {t.attendanceLog}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              View and manage attendance records.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-white/50 dark:bg-slate-900/50 border-white/20 hover:bg-white/80 rounded-xl gap-2 text-indigo-600 dark:text-indigo-400 shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
              {t.refresh}
            </Button>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl gap-2 shadow-lg shadow-indigo-500/20">
              <Download className="h-4 w-4" />
              {t.exportCsv}
            </Button>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl shadow-indigo-500/5">
          {/* Filters Bar */}
          <div className="flex flex-col xl:flex-row gap-4 justify-between mb-8 p-4 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/20">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 md:max-w-xs group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                <Input
                  placeholder={t.search}
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
                      !date && "text-muted-foreground"
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

              {/* Filter Dropdown */}
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px] bg-white/60 dark:bg-slate-900/60 border-transparent shadow-sm h-10 rounded-xl">
                  <Filter className="mr-2 h-4 w-4 text-slate-500" />
                  <SelectValue placeholder={t.filter} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="present">{t.present}</SelectItem>
                  <SelectItem value="absent">{t.absent}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/20 overflow-hidden bg-white/30 dark:bg-slate-900/30">
            <Table>
              <TableHeader className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.employee}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.date}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.clockIn}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.clockOut}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.allWorkType}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.status}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.reason}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.activities}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.location}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Empty State */}
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={9} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4">
                        <History className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="font-medium text-lg">{t.noRecords}</p>
                      <p className="text-sm opacity-70 mt-1">
                        Try adjusting your filters to see more results
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
