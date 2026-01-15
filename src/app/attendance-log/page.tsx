"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw, Download, History } from "lucide-react";
import { useState, useEffect } from "react";

import { useLanguage } from "@/contexts/language-context";
import { useDebounce } from "@/hooks/use-debounce";
import { useProjects } from "@/hooks/useProjects";
import { useAttendanceLogFilters } from "@/hooks/useAttendanceLogFilters";
import { useAttendanceLogData } from "@/hooks/useAttendanceLogData";
import { exportAttendanceLogs } from "@/lib/attendanceLogExport";
import { AttendanceLogFilters } from "@/components/attendance-log/AttendanceLogFilters";
import { AttendanceLogTable } from "@/components/attendance-log/AttendanceLogTable";
import { AttendanceLogPagination } from "@/components/attendance-log/AttendanceLogPagination";

export default function AttendanceLogPage() {
  const { t } = useLanguage();
  const { projects } = useProjects();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filters
  const filters = useAttendanceLogFilters();
  const debouncedSearch = useDebounce(filters.search, 500);

  // Data fetching
  const { logs, loading, totalItems } = useAttendanceLogData({
    debouncedSearch,
    date: filters.date,
    recordType: filters.recordType,
    workType: filters.workType,
    status: filters.status,
    role: filters.role,
    projectId: filters.projectId,
    currentPage,
    itemsPerPage,
  });

  // Reset page when filters change (except pagination controls)
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    filters.workType,
    filters.status,
    filters.recordType,
    filters.role,
    filters.date,
    itemsPerPage,
    filters.projectId,
  ]);

  const handleExport = () => {
    exportAttendanceLogs({
      search: filters.search,
      date: filters.date,
      recordType: filters.recordType,
      workType: filters.workType,
      status: filters.status,
      role: filters.role,
      projectId: filters.projectId,
    });
  };

  const handleClearFilters = () => {
    filters.clearFilters();
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
        {/* Header */}
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
              onClick={handleClearFilters}
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

        {/* Main Content */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl shadow-indigo-500/5">
          {/* Filters */}
          <AttendanceLogFilters
            search={filters.search}
            setSearch={filters.setSearch}
            date={filters.date}
            setDate={filters.setDate}
            recordType={filters.recordType}
            setRecordType={filters.setRecordType}
            workType={filters.workType}
            setWorkType={filters.setWorkType}
            status={filters.status}
            setStatus={filters.setStatus}
            role={filters.role}
            setRole={filters.setRole}
            projectId={filters.projectId}
            setProjectId={filters.setProjectId}
            projects={projects}
            clearFilters={handleClearFilters}
            t={t}
          />

          {/* Table */}
          <AttendanceLogTable logs={logs} loading={loading} t={t} />

          {/* Pagination */}
          {!loading && totalItems > 0 && (
            <AttendanceLogPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
