"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Clock, PauseCircle, Timer, Download, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { AttendanceLog } from "@/types/attendance";
import { AttendancePause } from "@/types/attendance-pause";
import {
  OvertimeRequest,
  CreateOvertimePayload,
  UpdateOvertimePayload,
} from "@/types/overtime";
import { attendanceApi } from "@/lib/attendance-api";
import { pauseOvertimeApi } from "@/lib/pause-overtime-api";
import { toast } from "sonner";

// Components
import { PauseControls } from "@/components/attendance/pause/PauseControls";
import { PauseActionLog } from "@/components/attendance/pause/PauseActionLog";
import { OvertimeRequestForm } from "@/components/attendance/overtime/OvertimeRequestForm";
import { OvertimeHistoryTable } from "@/components/attendance/overtime/OvertimeHistoryTable";
import { EditOvertimeDialog } from "@/components/attendance/overtime/EditOvertimeDialog";
import { DeleteOvertimeDialog } from "@/components/attendance/overtime/DeleteOvertimeDialog";

export default function PauseAndOvertimePage() {
  const { t } = useLanguage();
  const [time, setTime] = useState(new Date());

  // State for Attendance Pause
  const [currentLog, setCurrentLog] = useState<AttendanceLog | null>(null);
  const [pauses, setPauses] = useState<AttendancePause[]>([]);
  const [isPauseLoading, setIsPauseLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // State for Overtime
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(
    []
  );
  const [isOvertimeLoading, setIsOvertimeLoading] = useState(false);
  const [editRequest, setEditRequest] = useState<OvertimeRequest | null>(null);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);

  // Overtime Filters
  const [overtimeDate, setOvertimeDate] = useState("");
  const [overtimeStatus, setOvertimeStatus] = useState("ALL");

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getToken = () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    return match ? match[2] : null;
  };

  // Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // 1. Fetch Today's Attendance to get ID
      const attendanceResp = await attendanceApi.getTodayAttendance(token);
      if (attendanceResp.success && attendanceResp.data) {
        setCurrentLog(attendanceResp.data);
        fetchPauses(attendanceResp.data.id);
      }

      // 2. Fetch Overtime Requests triggered by useEffect dependency
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    }
  };

  // Fetch Overtime Requests when filters change
  useEffect(() => {
    fetchOvertimeRequests();
  }, [overtimeDate, overtimeStatus]);

  // --- Pause Functions ---

  const fetchPauses = async (logId: string) => {
    const token = getToken();
    if (!token) return;
    setIsPauseLoading(true);
    try {
      const resp = await pauseOvertimeApi.getPausesByLogId(token, logId);
      if (resp.success && resp.data) {
        setPauses(resp.data);
        // Check if currently paused (last pause has no end time)
        const lastPause = resp.data[resp.data.length - 1];
        setIsPaused(lastPause && !lastPause.pauseEnd);
      }
    } catch (error) {
      console.error("Failed to fetch pauses", error);
    } finally {
      setIsPauseLoading(false);
    }
  };

  const handleStartPause = async () => {
    if (!currentLog) return;
    const token = getToken();
    if (!token) return;

    setIsPauseLoading(true);
    try {
      await pauseOvertimeApi.startPause(token, {
        pauseStart: new Date().toISOString(),
        attendanceLogId: currentLog.id,
      });
      toast.success("Pause started");
      fetchPauses(currentLog.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to start pause");
    } finally {
      setIsPauseLoading(false);
    }
  };

  const handleResumePause = async () => {
    if (!currentLog) return;
    const token = getToken();
    if (!token) return;

    setIsPauseLoading(true);
    try {
      await pauseOvertimeApi.resumePause(token, {
        pauseEnd: new Date().toISOString(),
        attendanceLogId: currentLog.id,
      });
      toast.success("Resumed work");
      fetchPauses(currentLog.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to resume work");
    } finally {
      setIsPauseLoading(false);
    }
  };

  const handleDeletePause = async (pauseId: string) => {
    if (!currentLog) return;
    const token = getToken();
    if (!token) return;

    // Optional: Add confirmation? standard is usually direct for simple log items, but let's confirm
    if (!confirm("Are you sure you want to delete this pause record?")) return;

    setIsPauseLoading(true);
    try {
      await pauseOvertimeApi.deletePause(token, pauseId);
      toast.success("Pause record deleted");
      fetchPauses(currentLog.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete pause");
    } finally {
      setIsPauseLoading(false);
    }
  };

  // --- Overtime Functions ---

  const fetchOvertimeRequests = async () => {
    const token = getToken();
    if (!token) return;
    setIsOvertimeLoading(true);
    try {
      const resp = await pauseOvertimeApi.getMyOvertimeRequests(
        token,
        1,
        1000,
        overtimeStatus === "ALL" ? undefined : overtimeStatus,
        overtimeDate || undefined
      );
      if (resp.success && resp.data) {
        setOvertimeRequests(resp.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch overtime requests", error);
      toast.error("Failed to fetch overtime history");
    } finally {
      setIsOvertimeLoading(false);
    }
  };

  const handleExportOvertime = async () => {
    if (overtimeRequests.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const XLSX = await import("xlsx");

      const exportData = overtimeRequests.map((req) => ({
        "Clock In": format(new Date(req.clockIn), "yyyy-MM-dd HH:mm"),
        "Clock Out": format(new Date(req.clockOut), "yyyy-MM-dd HH:mm"),
        Activities: req.activities,
        Status: req.status,
        "Created At": format(new Date(req.createdAt), "yyyy-MM-dd HH:mm"),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Overtime Requests");

      const fileName = `overtime_export_${format(
        new Date(),
        "yyyyMMdd_HHmmss"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      toast.success("Export successful");
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export data");
    }
  };

  const handleCreateOvertime = async (payload: CreateOvertimePayload) => {
    const token = getToken();
    if (!token) return;
    setIsOvertimeLoading(true);
    try {
      await pauseOvertimeApi.createOvertime(token, payload);
      toast.success("Overtime request submitted");
      fetchOvertimeRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit overtime request");
    } finally {
      setIsOvertimeLoading(false);
    }
  };

  const handleUpdateOvertime = async (
    id: string,
    payload: UpdateOvertimePayload
  ) => {
    const token = getToken();
    if (!token) return;
    setIsOvertimeLoading(true);
    try {
      await pauseOvertimeApi.updateOvertime(token, id, payload);
      toast.success("Overtime request updated");
      fetchOvertimeRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to update overtime request");
    } finally {
      setIsOvertimeLoading(false);
    }
  };

  const handleDeleteOvertime = async () => {
    if (!deleteRequestId) return;
    const token = getToken();
    if (!token) return;
    setIsOvertimeLoading(true);
    try {
      await pauseOvertimeApi.deleteOvertime(token, deleteRequestId);
      toast.success("Overtime request deleted");
      setDeleteRequestId(null);
      fetchOvertimeRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete overtime request");
    } finally {
      setIsOvertimeLoading(false);
    }
  };

  const handleClearFilters = () => {
    setOvertimeDate("");
    setOvertimeStatus("ALL");
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Blobs Background - Consistent with Attendance Page */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <div className="relative h-20 w-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 ring-4 ring-white/20">
                <Timer className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Pause & Overtime
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Manage your breaks and additional work hours
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-5xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 font-mono">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-lg font-medium text-slate-400 dark:text-slate-500 mt-2">
              {time.toLocaleDateString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          <Tabs defaultValue="pause" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 mx-auto md:mx-0">
              <TabsTrigger value="pause" className="gap-2">
                <PauseCircle className="w-4 h-4" /> Attendance Pause
              </TabsTrigger>
              <TabsTrigger value="overtime" className="gap-2">
                <Clock className="w-4 h-4" /> Overtime Request
              </TabsTrigger>
            </TabsList>

            {/* PAUSE CONTENT */}
            <TabsContent value="pause" className="space-y-6">
              {!currentLog ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-2">
                    Not Clocked In
                  </h3>
                  <p className="text-amber-700 dark:text-amber-500">
                    You need to clock in on the Attendance page before you can
                    start pauses.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left: Controls */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                      Actions
                    </h3>
                    <PauseControls
                      isLoading={isPauseLoading}
                      isPaused={isPaused}
                      onStartPause={handleStartPause}
                      onResumePause={handleResumePause}
                      disabled={false}
                    />
                  </div>

                  {/* Right: History */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                      Today's Pauses
                    </h3>
                    <PauseActionLog
                      pauses={pauses}
                      loading={isPauseLoading && pauses.length === 0}
                      onDelete={handleDeletePause}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* OVERTIME CONTENT */}
            <TabsContent value="overtime" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Form */}
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                    New Request
                  </h3>
                  <div className="bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl border border-white/20 dark:border-slate-700/30">
                    <OvertimeRequestForm
                      isLoading={isOvertimeLoading}
                      onSubmit={handleCreateOvertime}
                    />
                  </div>
                </div>

                {/* Right: Table */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                      Request History
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fetchOvertimeRequests()}
                      title="Refresh"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Filters & Export */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={overtimeDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setOvertimeDate(e.target.value)
                        }
                        className="w-full sm:w-auto bg-white/50"
                      />
                    </div>

                    <Select
                      value={overtimeStatus}
                      onValueChange={setOvertimeStatus}
                    >
                      <SelectTrigger className="w-[180px] bg-white/50">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      onClick={handleClearFilters}
                      className="text-slate-500"
                    >
                      Clear
                    </Button>

                    <Button
                      onClick={handleExportOvertime}
                      variant="outline"
                      size="sm"
                      className="ml-auto gap-2"
                      disabled={overtimeRequests.length === 0}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                  <OvertimeHistoryTable
                    requests={overtimeRequests}
                    loading={isOvertimeLoading && overtimeRequests.length === 0}
                    onEdit={setEditRequest}
                    onDelete={setDeleteRequestId}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <EditOvertimeDialog
        open={!!editRequest}
        onClose={() => setEditRequest(null)}
        request={editRequest}
        onUpdate={handleUpdateOvertime}
        isLoading={isOvertimeLoading}
      />

      <DeleteOvertimeDialog
        open={!!deleteRequestId}
        onClose={() => setDeleteRequestId(null)}
        onConfirm={handleDeleteOvertime}
        isLoading={isOvertimeLoading}
      />
    </div>
  );
}
