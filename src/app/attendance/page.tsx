"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Building2,
  Home,
  MapPin,
  HeartPulse,
  Ban,
  Download,
  Calendar,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useLanguage } from "@/contexts/language-context";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAttendance } from "@/hooks/useAttendance";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { attendanceApi } from "@/lib/attendance-api";
import type { ClockInPayload } from "@/types/attendance";
import {
  LeaveType,
  type LeaveRequestPayload,
  type LeaveRequest,
} from "@/types/leave";

// Extracted components
import { AttendanceTypeCard } from "@/components/attendance/AttendanceTypeCard";
import { LeaveRequestForm } from "@/components/attendance/LeaveRequestForm";
import { ClockOutForm } from "@/components/attendance/ClockOutForm";
import { EditLeaveDialog } from "@/components/attendance/EditLeaveDialog";
import { DeleteLeaveDialog } from "@/components/attendance/DeleteLeaveDialog";
import { AttendanceHistoryTable } from "@/components/attendance/AttendanceHistoryTable";
import { LeaveHistoryTable } from "@/components/attendance/LeaveHistoryTable";

export default function AttendancePage() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState("WFO");
  const [time, setTime] = useState(new Date());
  const [activities, setActivities] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Leave request form state
  const [leaveStartDate, setLeaveStartDate] = useState<string>("");
  const [leaveEndDate, setLeaveEndDate] = useState<string>("");
  const [leaveReason, setLeaveReason] = useState<string>("");

  // Custom hooks
  const {
    location,
    locationError,
    distance,
    isWithinRange,
    isLoading: locationLoading,
    MAX_DISTANCE_METERS,
  } = useGeolocation();

  // Use the new hook logic for attendance (which now handles availability)
  const {
    isClockedIn,
    clockInTime,
    history,
    historyLoading,
    startDate,
    endDate,
    filterWorkType,
    setStartDate,
    setEndDate,
    setFilterWorkType,
    handleClockIn: clockIn,
    handleClockOut: clockOut,
    fetchHistory,
  } = useAttendance();

  // Calculate working hours
  const getWorkingHours = () => {
    if (!isClockedIn || !clockInTime) return "0h 0m";

    const now = new Date();
    const diff = now.getTime() - clockInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const {
    leaveHistory,
    leaveHistoryLoading,
    filterLeaveStatus,
    filterLeaveType,
    leaveStartDate: leaveFilterStartDate,
    leaveEndDate: leaveFilterEndDate,
    setFilterLeaveStatus,
    setFilterLeaveType,
    setLeaveStartDate: setLeaveFilterStartDate,
    setLeaveEndDate: setLeaveFilterEndDate,
    editingLeave,
    setEditingLeave,
    editLeaveType,
    setEditLeaveType,
    editStartDate,
    setEditStartDate,
    editEndDate,
    setEditEndDate,
    editReason,
    setEditReason,
    deleteLeaveId,
    setDeleteLeaveId,
    handleCreateLeave,
    handleEditLeave,
    handleUpdateLeave: updateLeave,
    handleDeleteLeave: deleteLeave,
    openDeleteDialog,
    closeDialogs,
    fetchLeaveHistory,
  } = useLeaveRequests();

  const ATTENDANCE_TYPES = [
    {
      id: "WFO",
      label: "Work from Office",
      displayLabel: t.wfo,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      gradient: "from-blue-500 to-indigo-500",
      border: "hover:border-blue-200 dark:hover:border-blue-800",
      disabled: !location || !isWithinRange,
    },
    {
      id: "WFH",
      label: "Work From Home",
      displayLabel: t.wfh,
      icon: Home,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/10",
      gradient: "from-purple-500 to-pink-500",
      border: "hover:border-purple-200 dark:hover:border-purple-800",
      disabled: !location,
    },
    {
      id: "FIELD",
      label: "Field Work",
      displayLabel: t.fieldWork,
      icon: MapPin,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/10",
      gradient: "from-amber-500 to-orange-500",
      border: "hover:border-amber-200 dark:hover:border-amber-800",
      disabled: !location,
    },
    {
      id: "SICK",
      label: "Sick Leave",
      displayLabel: t.sick,
      icon: HeartPulse,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/10",
      gradient: "from-rose-500 to-red-500",
      border: "hover:border-rose-200 dark:hover:border-rose-800",
      disabled: false,
    },
    {
      id: "VACATION",
      label: "Vacation Leave",
      displayLabel: "Vacation",
      icon: Calendar,
      color: "text-teal-500",
      bg: "bg-teal-50 dark:bg-teal-900/10",
      gradient: "from-teal-500 to-emerald-500",
      border: "hover:border-teal-200 dark:hover:border-teal-800",
      disabled: false,
    },
    {
      id: "ABSENT",
      label: "Absent",
      displayLabel: t.absent,
      icon: Ban,
      color: "text-slate-500",
      bg: "bg-slate-50 dark:bg-slate-900/10",
      gradient: "from-slate-500 to-gray-500",
      border: "hover:border-slate-200 dark:hover:border-slate-800",
      disabled: false,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-select WFH if out of range - keeping this from backup logic
  useEffect(() => {
    if (!isWithinRange && selectedType === "WFO" && location) {
      setSelectedType("WFH");
    }
  }, [isWithinRange, location, selectedType]);

  const getAuthToken = () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    return match ? match[2] : null;
  };

  const handleClockInAction = async () => {
    if (!location) {
      alert("Please enable location services to clock in.");
      return;
    }

    setIsLoading(true);
    try {
      // Helper to map ID to Display Name required by Backend
      const getWorkTypeString = (
        id: string
      ): "Work from Office" | "Work from Home" | "Field Work" => {
        switch (id) {
          case "WFO":
            return "Work from Office";
          case "WFH":
            return "Work from Home";
          case "FIELD":
            return "Field Work";
          default:
            return "Work from Office";
        }
      };

      const payload: ClockInPayload = {
        workType: getWorkTypeString(selectedType),
        clockIn: new Date().toISOString(),
        latClockIn: location.lat,
        longClockIn: location.lng,
      };

      await clockIn(payload);
      fetchHistory();
      fetchLeaveHistory();
    } catch (error: any) {
      alert(error.message || "Failed to clock in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOutAction = async (activities: string) => {
    if (!location) {
      alert("Location is required to clock out.");
      return;
    }
    setIsLoading(true);
    try {
      await clockOut(activities, location.lat, location.lng);
      setActivities("");
      fetchHistory();
    } catch (error: any) {
      alert(error.message || "Failed to clock out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveRequestAction = async () => {
    setIsLoading(true);
    try {
      await handleCreateLeave({
        type: selectedType as LeaveType,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        requestReason: leaveReason,
      });
      setLeaveStartDate("");
      setLeaveEndDate("");
      setLeaveReason("");
      alert("Leave request submitted successfully!");
      fetchLeaveHistory();
    } catch (error: any) {
      alert(error.message || "Failed to submit leave request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAttendance = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      // Fetch 1000 items to ensure we get most filtered data
      const resp = await attendanceApi.getAllCurrentUser(
        token,
        1,
        1000,
        startDate || undefined,
        endDate || undefined,
        filterWorkType
      );

      if (resp.success && resp.data?.data) {
        const exportData = resp.data.data.map((log) => ({
          Date: log.clockIn ? format(new Date(log.clockIn), "yyyy-MM-dd") : "-",
          "Work Type": log.workType || "-",
          "Clock In": log.clockIn
            ? format(new Date(log.clockIn), "HH:mm:ss")
            : "-",
          "Clock Out": log.clockOut
            ? format(new Date(log.clockOut), "HH:mm:ss")
            : "-",
          Activities: log.activities || "-",
          Status: log.clockOut ? "Completed" : "Active",
          "Lat Clock In": log.latClockIn ?? "-",
          "Lng Clock In": log.longClockIn ?? "-",
          "Lat Clock Out": log.latClockOut ?? "-",
          "Lng Clock Out": log.longClockOut ?? "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

        const fileName = `attendance_export_${format(
          new Date(),
          "yyyyMMdd_HHmmss"
        )}.xlsx`;
        XLSX.writeFile(workbook, fileName);
      } else {
        alert("No data to export");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export attendance data");
    }
  };

  const handleExportLeave = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      // Fetch 1000 items
      const resp = await attendanceApi.getMyLeaveRequests(
        token,
        1,
        1000,
        filterLeaveStatus,
        filterLeaveType
      );

      if (resp.success && resp.data?.data) {
        const exportData = resp.data.data.map((log) => ({
          Type: log.type,
          Status: log.status,
          "Start Date": log.startDate,
          "End Date": log.endDate,
          Reason: log.requestReason,
          Approver: log.approver || "-",
          "Approval Note": log.approvalNote || "-",
          "Created At": format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss"),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");

        const fileName = `leave_export_${format(
          new Date(),
          "yyyyMMdd_HHmmss"
        )}.xlsx`;
        XLSX.writeFile(workbook, fileName);
      } else {
        alert("No leave data to export");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export leave data");
    }
  };

  const isLeaveType = (type: string) =>
    ["SICK", "VACATION", "ABSENT"].includes(type);

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Blobs Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Section: Status & Types */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div
                  className={cn(
                    "absolute inset-0 blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full",
                    isClockedIn ? "bg-green-500" : "bg-blue-500"
                  )}
                ></div>
                <div
                  className={cn(
                    "relative h-20 w-20 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white/20 dark:ring-slate-900/20",
                    isClockedIn
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30"
                  )}
                >
                  <Clock className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t.status}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset",
                      isClockedIn
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20"
                        : "bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-500/20"
                    )}
                  >
                    {isClockedIn ? "Clocked In" : "Not Started"}
                  </span>
                  {locationError && (
                    <span
                      className="text-xs text-red-500 flex items-center gap-1"
                      title={locationError}
                    >
                      <AlertCircle className="w-3 h-3" /> Location Error
                    </span>
                  )}
                </div>
                {isClockedIn && (
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Working hours: </span>
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {getWorkingHours()}
                    </span>
                  </div>
                )}
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

          {/* Location Request / Warning */}
          {(!location || locationLoading) && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400 mb-6">
              {locationLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Searching for location...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span>
                    Location permission is required to perform actions.
                  </span>
                </>
              )}
            </div>
          )}

          {/* Attendance Types Grid - Always Visible */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {ATTENDANCE_TYPES.map((type) => (
              <AttendanceTypeCard
                key={type.id}
                {...type}
                isSelected={selectedType === type.id}
                onSelect={() => setSelectedType(type.id)}
              />
            ))}
          </div>

          {/* Dynamic Action Area */}
          <div className="mt-8 transition-all">
            {isLeaveType(selectedType) ? (
              <div className="bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl border border-white/20 dark:border-slate-700/30 animate-in fade-in slide-in-from-top-2">
                <LeaveRequestForm
                  startDate={leaveStartDate}
                  endDate={leaveEndDate}
                  reason={leaveReason}
                  onStartDateChange={setLeaveStartDate}
                  onEndDateChange={setLeaveEndDate}
                  onReasonChange={setLeaveReason}
                  onSubmit={handleLeaveRequestAction}
                  isLoading={isLoading}
                />
              </div>
            ) : isClockedIn ? (
              <div className="bg-white/40 dark:bg-slate-800/40 p-6 rounded-2xl border border-white/20 dark:border-slate-700/30 animate-in fade-in slide-in-from-top-2">
                <ClockOutForm
                  activities={activities}
                  onActivitiesChange={setActivities}
                  isLoading={isLoading}
                  onClockOut={() => handleClockOutAction(activities)}
                />
              </div>
            ) : (
              <Button
                size="lg"
                onClick={handleClockInAction}
                disabled={
                  isLoading ||
                  !location ||
                  (selectedType === "WFO" && !isWithinRange)
                }
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20 rounded-2xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-6 w-6" />
                    {t.clockIn}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* History Tabs */}
        <div className="space-y-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger
                value="attendance"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                Attendance Log
              </TabsTrigger>
              <TabsTrigger
                value="leave"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                Leave History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="attendance">
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl shadow-indigo-500/5">
                <AttendanceHistoryTable
                  history={history}
                  loading={historyLoading}
                  filterWorkType={filterWorkType}
                  startDate={startDate}
                  endDate={endDate}
                  onFilterWorkTypeChange={setFilterWorkType}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onRefresh={fetchHistory}
                  onExport={handleExportAttendance}
                  t={t}
                />
              </div>
            </TabsContent>

            <TabsContent value="leave">
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl shadow-indigo-500/5">
                <LeaveHistoryTable
                  leaveHistory={leaveHistory}
                  loading={leaveHistoryLoading}
                  filterStatus={filterLeaveStatus}
                  filterType={filterLeaveType}
                  startDate={leaveFilterStartDate}
                  endDate={leaveFilterEndDate}
                  onFilterStatusChange={setFilterLeaveStatus}
                  onFilterTypeChange={setFilterLeaveType}
                  onStartDateChange={setLeaveFilterStartDate}
                  onEndDateChange={setLeaveFilterEndDate}
                  onRefresh={fetchLeaveHistory}
                  onEdit={handleEditLeave}
                  onDelete={openDeleteDialog}
                  onExport={handleExportLeave}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <EditLeaveDialog
        leave={editingLeave}
        open={!!editingLeave}
        onClose={closeDialogs}
        onUpdate={updateLeave}
        isLoading={isLoading}
        leaveType={editLeaveType}
        setLeaveType={setEditLeaveType}
        startDate={editStartDate}
        setStartDate={setEditStartDate}
        endDate={editEndDate}
        setEndDate={setEditEndDate}
        reason={editReason}
        setReason={setEditReason}
      />

      <DeleteLeaveDialog
        open={!!deleteLeaveId}
        onClose={closeDialogs}
        onConfirm={deleteLeave}
        isLoading={isLoading}
      />
    </div>
  );
}
