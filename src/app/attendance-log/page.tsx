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
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Briefcase,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { useLanguage } from "@/contexts/language-context";
import { AttendanceLog } from "@/types/attendance";
import { useDebounce } from "@/hooks/use-debounce";
import jsCookie from "js-cookie";
import { attendanceApi } from "@/lib/attendance-api";
import * as XLSX from "xlsx";

export default function AttendanceLogPage() {
  const { t } = useLanguage();
  // const [logs, setLogs] = useState<AttendanceLog[]>([]); // Replaced by allFetchedLogs
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [workType, setWorkType] = useState("all");
  const [role, setRole] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  // const [totalPages, setTotalPages] = useState(1); // Derived
  // const [totalItems, setTotalItems] = useState(0); // Derived

  // State for logs to display
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = jsCookie.get("accessToken");

      const authToken =
        token ||
        document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"))?.[2] ||
        "";

      if (!authToken) {
        console.log("No access token found");
        return;
      }

      const startDate = date?.from
        ? format(date.from, "yyyy-MM-dd")
        : undefined;
      const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

      const isSearching = debouncedSearch.length > 0;

      const fetchPage = isSearching ? 1 : currentPage;
      const fetchLimit = isSearching ? 3000 : itemsPerPage;

      const response = await attendanceApi.getAllAttendanceLogs(
        authToken,
        fetchPage,
        fetchLimit,
        undefined,
        workType === "all" ? undefined : workType,
        role === "all" ? undefined : role,
        startDate,
        endDate
      );

      if (response.success && response.data) {
        if (isSearching) {
          // CLIENT-SIDE FILTERING & PAGINATION
          const allData = response.data.data;
          const searchLower = debouncedSearch.toLowerCase();
          const filtered = allData.filter(
            (log) =>
              log.user.fullName.toLowerCase().includes(searchLower) ||
              log.user.email.toLowerCase().includes(searchLower)
          );

          setTotalItems(filtered.length);

          // Slice for current page
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedLogs = filtered.slice(
            startIndex,
            startIndex + itemsPerPage
          );
          setLogs(paginatedLogs);
        } else {
          // SERVER-SIDE PAGINATION
          setLogs(response.data.data);
          setTotalItems(response.data.pagination.total);
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, workType, role, date]);

  // Effect to fetch when any dependency changes
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset page when filters change (except pagination controls)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, workType, role, date, itemsPerPage]);

  const handleExport = async () => {
    try {
      const token = jsCookie.get("accessToken");
      if (!token) return;

      const startDate = date?.from
        ? format(date.from, "yyyy-MM-dd")
        : undefined;
      const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

      const response = await attendanceApi.getAllAttendanceLogs(
        token,
        1,
        1000,
        debouncedSearch,
        workType === "all" ? undefined : workType,
        role === "all" ? undefined : role,
        startDate,
        endDate
      );

      if (response.success && response.data?.data) {
        const dataToExport = response.data.data.map((log) => ({
          Employee: log.user.fullName,
          Date: format(new Date(log.date), "dd MMM yyyy"),
          "Clock In": format(new Date(log.clockIn), "HH:mm"),
          "Clock Out": log.clockOut
            ? format(new Date(log.clockOut), "HH:mm")
            : "-",
          "Work Type": log.workType,
          Location: `(${log.latClockIn}, ${log.lngClockIn})`,
          Role: log.user.organizationRoles?.[0]?.role || "-",
          Email: log.user.email,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, "Attendance Logs");
        XLSX.writeFile(wb, "Attendance_Logs.xlsx");

        alert("Attendance logs exported successfully");
      }
    } catch (error) {
      console.error("Failed to export:", error);
      alert("Failed to export data");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDate({ from: undefined, to: undefined });
    setWorkType("all");
    setRole("all");
    setCurrentPage(1);
  };

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
              onClick={clearFilters}
              className="bg-white/50 dark:bg-slate-900/50 border-white/20 hover:bg-white/80 rounded-xl gap-2 text-indigo-600 dark:text-indigo-400 shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
              {t.refresh}
            </Button>
            <Button
              onClick={handleExport}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl shadow-indigo-500/5">
          {/* Filters Bar */}
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

              {/* Work Type Filter */}
              <Select value={workType} onValueChange={setWorkType}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/60 dark:bg-slate-900/60 border-transparent shadow-sm h-10 rounded-xl">
                  <Briefcase className="mr-2 h-4 w-4 text-slate-500" />
                  <SelectValue placeholder="Work Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Work from Office">
                    Work from Office
                  </SelectItem>
                  <SelectItem value="Work from Home">Work from Home</SelectItem>
                  <SelectItem value="Field Work">Field Work</SelectItem>
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
                    {t.role}
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
                    {t.activities}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.location}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="border-none">
                    <TableCell colSpan={8} className="h-64 text-center">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  /* Empty State */
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell colSpan={8} className="h-64 text-center">
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
                ) : (
                  logs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="hover:bg-white/40 dark:hover:bg-slate-800/40 border-white/10 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {log.user.fullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {log.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {format(new Date(log.date), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {log.user.organizationRoles?.[0]?.role || "Employee"}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-green-600 dark:text-green-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {format(new Date(log.clockIn), "HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-amber-600 dark:text-amber-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {log.clockOut
                            ? format(new Date(log.clockOut), "HH:mm")
                            : "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            log.workType === "Work from Home" &&
                              "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
                            log.workType === "Work from Office" &&
                              "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
                            log.workType === "Field Work" &&
                              "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                          )}
                        >
                          {log.workType}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-slate-600 dark:text-slate-400">
                        {log.activities || "-"}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        <div
                          className="flex items-center gap-1 text-xs"
                          title={`In: ${log.latClockIn}, ${log.lngClockIn}`}
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          View
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-500 text-nowrap">
                    Rows per page
                  </p>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-white/50 dark:bg-slate-900/50 border-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center px-4 font-medium text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 border border-white/20 rounded-md">
                  Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(totalItems / itemsPerPage), p + 1)
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(totalItems / itemsPerPage)
                  }
                  className="bg-white/50 dark:bg-slate-900/50 border-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
