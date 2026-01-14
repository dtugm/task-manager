"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Building2,
  Home,
  MapPin,
  HeartPulse,
  Ban,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useLanguage } from "@/contexts/language-context";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAttendance } from "@/hooks/useAttendance";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import type { ClockInPayload } from "@/types/attendance";
import { LeaveType, type LeaveRequestPayload } from "@/types/leave";

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
  const [selectedType, setSelectedType] = useState("wfo");
  const [time, setTime] = useState(new Date());
  const [activities, setActivities] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Leave request state
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
    fetchLeaveHistory,
  } = useLeaveRequests();

  // Attendance types configuration
  const attendanceTypes = [
    {
      id: "wfo",
      label: "Work from Office",
      displayLabel: t.wfo,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "hover:border-blue-500/50",
      disabled: !isWithinRange,
    },
    {
      id: "wfh",
      label: "Work from Home",
      displayLabel: t.wfh,
      icon: Home,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "hover:border-purple-500/50",
      disabled: false,
    },
    {
      id: "field",
      label: "Field Work",
      displayLabel: t.fieldWork,
      icon: MapPin,
      color: "text-green-500",
      bg: "bg-green-500/10",
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "hover:border-green-500/50",
      disabled: false,
    },
    {
      id: "sick",
      label: LeaveType.SICK,
      displayLabel: t.sick,
      icon: HeartPulse,
      color: "text-red-500",
      bg: "bg-red-500/10",
      gradient: "from-red-500/20 to-orange-500/20",
      border: "hover:border-red-500/50",
      disabled: false,
      isLeave: true,
    },
    {
      id: "vacation",
      label: LeaveType.VACATION,
      displayLabel: "Vacation",
      icon: Calendar,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      gradient: "from-amber-500/20 to-yellow-500/20",
      border: "hover:border-amber-500/50",
      disabled: false,
      isLeave: true,
    },
    {
      id: "absent",
      label: LeaveType.ABSENT,
      displayLabel: t.absent,
      icon: Ban,
      color: "text-gray-500",
      bg: "bg-gray-500/10",
      gradient: "from-gray-500/20 to-slate-500/20",
      border: "hover:border-gray-500/50",
      disabled: false,
      isLeave: true,
    },
  ];

  // Clock update effect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Main action handler
  const handleMainAction = async () => {
    if (!location) {
      alert("Waiting for location...");
      return;
    }

    const selectedTypeObj = attendanceTypes.find((t) => t.id === selectedType);
    if (!selectedTypeObj) return;

    setIsLoading(true);
    try {
      // Handle leave request
      if (selectedTypeObj.isLeave) {
        if (!leaveStartDate || !leaveEndDate || !leaveReason.trim()) {
          alert("Please fill in all fields: Start Date, End Date, and Reason");
          return;
        }

        const payload: LeaveRequestPayload = {
          type: selectedTypeObj.label as LeaveType,
          requestReason: leaveReason,
          startDate: leaveStartDate,
          endDate: leaveEndDate,
        };

        await handleCreateLeave(payload);
        alert("Leave request submitted successfully!");
        setLeaveStartDate("");
        setLeaveEndDate("");
        setLeaveReason("");
      } else {
        // Handle clock in
        const payload: ClockInPayload = {
          clockIn: new Date().toISOString(),
          latClockIn: location.lat,
          longClockIn: location.lng,
          workType: selectedTypeObj.label as
            | "Work from Office"
            | "Work from Home"
            | "Field Work",
        };

        await clockIn(payload);
        alert("Clocked in successfully!");
        fetchLeaveHistory();
      }
    } catch (error: any) {
      alert(error.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOutAction = async () => {
    if (!location || !activities.trim()) return;

    setIsLoading(true);
    try {
      await clockOut(activities, location.lat, location.lng);
      alert("Clocked out successfully!");
      setActivities("");
    } catch (error: any) {
      alert(error.message || "Failed to clock out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLeave = async () => {
    setIsLoading(true);
    try {
      await updateLeave();
      alert("Leave request updated successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to update leave request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLeave = async () => {
    setIsLoading(true);
    try {
      await deleteLeave();
      alert("Leave request deleted successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to delete leave request");
    } finally {
      setIsLoading(false);
    }
  };

  // Export handlers
  const handleExport = () => {
    const exportData = history.map((log) => ({
      Date: log.clockIn ? format(new Date(log.clockIn), "yyyy-MM-dd") : "-",
      "Work Type": log.workType,
      "Clock In": log.clockIn ? format(new Date(log.clockIn), "HH:mm:ss") : "-",
      "Clock Out": log.clockOut
        ? format(new Date(log.clockOut), "HH:mm:ss")
        : "-",
      Activities: log.activities || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const fileName = `attendance_export_${format(
      new Date(),
      "yyyyMMdd_HHmmss"
    )}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleLeaveExport = () => {
    const exportData = leaveHistory.map((log) => ({
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
  };

  const selectedTypeObj = attendanceTypes.find((t) => t.id === selectedType);
  const isLeaveRequest = selectedTypeObj?.isLeave || false;

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Section: Clock In/Out */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {t.attendance}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {format(time, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-slate-800 dark:text-white font-mono">
                {format(time, "HH:mm:ss")}
              </div>
              {isClockedIn && clockInTime && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Clocked in at {format(clockInTime, "HH:mm")}
                </p>
              )}
            </div>
          </div>

          {/* Location Status */}
          {locationError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Location Error
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {locationError}
                </p>
              </div>
            </div>
          )}

          {location && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {isWithinRange
                      ? "Within office range"
                      : "Outside office range"}
                  </span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {distance}m from office
                </span>
              </div>
            </div>
          )}

          {/* Only show type selection and forms when NOT clocked in */}
          {!isClockedIn && (
            <>
              {/* Attendance Type Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                  Select Type
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {attendanceTypes.map((type) => (
                    <AttendanceTypeCard
                      key={type.id}
                      {...type}
                      isSelected={selectedType === type.id}
                      onSelect={() => setSelectedType(type.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Leave Request Form */}
              {isLeaveRequest && (
                <LeaveRequestForm
                  startDate={leaveStartDate}
                  endDate={leaveEndDate}
                  reason={leaveReason}
                  onStartDateChange={setLeaveStartDate}
                  onEndDateChange={setLeaveEndDate}
                  onReasonChange={setLeaveReason}
                  onSubmit={handleMainAction}
                  isLoading={isLoading}
                />
              )}

              {/* Clock In Button */}
              <Button
                onClick={handleMainAction}
                disabled={isLoading || locationLoading || !location}
                className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isLeaveRequest ? "Submitting..." : "Clocking In..."}
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-5 w-5" />
                    {isLeaveRequest ? "Submit Leave Request" : "Clock In"}
                  </>
                )}
              </Button>
            </>
          )}

          {/* Clock Out Form - Only show when clocked in */}
          {isClockedIn && (
            <ClockOutForm
              activities={activities}
              onActivitiesChange={setActivities}
              onClockOut={handleClockOutAction}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Bottom Section: History with Tabs */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="attendance">Attendance History</TabsTrigger>
              <TabsTrigger value="leave">Leave History</TabsTrigger>
            </TabsList>

            <TabsContent value="attendance">
              <AttendanceHistoryTable
                history={history}
                loading={historyLoading}
                onRefresh={fetchHistory}
                onExport={handleExport}
                startDate={startDate}
                endDate={endDate}
                filterWorkType={filterWorkType}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onFilterWorkTypeChange={setFilterWorkType}
                t={t}
              />
            </TabsContent>

            <TabsContent value="leave">
              <LeaveHistoryTable
                leaveHistory={leaveHistory}
                loading={leaveHistoryLoading}
                onRefresh={fetchLeaveHistory}
                onExport={handleLeaveExport}
                onEdit={handleEditLeave}
                onDelete={setDeleteLeaveId}
                filterStatus={filterLeaveStatus}
                filterType={filterLeaveType}
                startDate={leaveFilterStartDate}
                endDate={leaveFilterEndDate}
                onFilterStatusChange={setFilterLeaveStatus}
                onFilterTypeChange={setFilterLeaveType}
                onStartDateChange={setLeaveFilterStartDate}
                onEndDateChange={setLeaveFilterEndDate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <EditLeaveDialog
        leave={editingLeave}
        open={!!editingLeave}
        onClose={() => setEditingLeave(null)}
        onUpdate={handleUpdateLeave}
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
        onClose={() => setDeleteLeaveId(null)}
        onConfirm={handleDeleteLeave}
        isLoading={isLoading}
      />
    </div>
  );
}
