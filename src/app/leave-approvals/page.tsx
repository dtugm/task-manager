"use client";

import { useState } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useManagerLeaveRequests } from "@/hooks/useManagerLeaveRequests";
import { ManagerLeaveTable } from "@/components/leave-approvals/ManagerLeaveTable";
import { ApproveRejectDialog } from "@/components/leave-approvals/ApproveRejectDialog";
import { EditManagerLeaveDialog } from "@/components/leave-approvals/EditManagerLeaveDialog";
import { DeleteLeaveDialog } from "@/components/attendance/DeleteLeaveDialog";

export default function LeaveApprovalsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    leaveRequests,
    loading,
    filterStatus,
    filterType,
    startDate,
    endDate,
    requesterFilter,
    setFilterStatus,
    setFilterType,
    setStartDate,
    setEndDate,
    setRequesterFilter,
    selectedLeave,
    approvalNote,
    setApprovalNote,
    actionType,
    editingLeave,
    editRequestReason,
    editStartDate,
    editEndDate,
    editType,
    setEditRequestReason,
    setEditStartDate,
    setEditEndDate,
    setEditType,
    deleteLeaveId,
    setDeleteLeaveId,
    handleApproveReject,
    handleUpdateLeave,
    handleDeleteLeave,
    openApproveDialog,
    openRejectDialog,
    openEditDialog,
    closeDialog,
    fetchLeaveRequests,
  } = useManagerLeaveRequests();

  const handleApproveRejectAction = async () => {
    setIsLoading(true);
    try {
      await handleApproveReject();
      alert(`Leave request ${actionType?.toLowerCase()} successfully!`);
    } catch (error: any) {
      alert(error.message || "Failed to process leave request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAction = async () => {
    setIsLoading(true);
    try {
      await handleUpdateLeave();
      alert("Leave request updated successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to update leave request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAction = async () => {
    setIsLoading(true);
    try {
      await handleDeleteLeave();
      alert("Leave request deleted successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to delete leave request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = leaveRequests.map((leave) => ({
      Requester: leave.requester?.fullName || "Unknown",
      Email: leave.requester?.email || "-",
      Type: leave.type,
      Status: leave.status,
      "Start Date": leave.startDate,
      "End Date": leave.endDate,
      Reason: leave.requestReason,
      "Approval Note": leave.approvalNote || "-",
      Approver: leave.approver || "-",
      "Created At": format(new Date(leave.createdAt), "yyyy-MM-dd HH:mm:ss"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");
    const fileName = `leave_requests_${format(
      new Date(),
      "yyyyMMdd_HHmmss"
    )}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Leave Request Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Review and approve employee leave requests
              </p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          <ManagerLeaveTable
            leaveRequests={leaveRequests}
            loading={loading}
            onRefresh={fetchLeaveRequests}
            onExport={handleExport}
            onApprove={openApproveDialog}
            onReject={openRejectDialog}
            onEdit={openEditDialog}
            onDelete={setDeleteLeaveId}
            filterStatus={filterStatus}
            filterType={filterType}
            startDate={startDate}
            endDate={endDate}
            requesterFilter={requesterFilter}
            onFilterStatusChange={setFilterStatus}
            onFilterTypeChange={setFilterType}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onRequesterFilterChange={setRequesterFilter}
          />
        </div>
      </div>

      {/* Approve/Reject Dialog */}
      <ApproveRejectDialog
        leave={selectedLeave}
        open={!!selectedLeave}
        onClose={closeDialog}
        onConfirm={handleApproveRejectAction}
        isLoading={isLoading}
        actionType={actionType}
        approvalNote={approvalNote}
        setApprovalNote={setApprovalNote}
      />

      {/* Edit Dialog */}
      <EditManagerLeaveDialog
        leave={editingLeave}
        open={!!editingLeave}
        onClose={closeDialog}
        onConfirm={handleUpdateAction}
        isLoading={isLoading}
        editType={editType}
        setEditType={setEditType}
        editStartDate={editStartDate}
        setEditStartDate={setEditStartDate}
        editEndDate={editEndDate}
        setEditEndDate={setEditEndDate}
        editRequestReason={editRequestReason}
        setEditRequestReason={setEditRequestReason}
      />

      {/* Delete Dialog */}
      <DeleteLeaveDialog
        open={!!deleteLeaveId}
        onClose={closeDialog}
        onConfirm={handleDeleteAction}
        isLoading={isLoading}
      />
    </div>
  );
}
