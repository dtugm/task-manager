import { useState, useEffect } from "react";
import { attendanceApi } from "@/lib/attendance-api";
import type { LeaveRequest } from "@/types/leave";

export function useManagerLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [requesterFilter, setRequesterFilter] = useState<string>("");

  // Approve/Reject dialog state
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [approvalNote, setApprovalNote] = useState<string>("");
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(
    null
  );

  // Edit/Delete state
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);
  const [editRequestReason, setEditRequestReason] = useState<string>("");
  const [editStartDate, setEditStartDate] = useState<string>("");
  const [editEndDate, setEditEndDate] = useState<string>("");
  const [editType, setEditType] = useState<string>("");
  const [deleteLeaveId, setDeleteLeaveId] = useState<string | null>(null);

  const getAuthToken = () => {
    const match = document.cookie.match(/accessToken=([^;]+)/);
    return match ? match[1] : null;
  };

  const fetchLeaveRequests = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const resp = await attendanceApi.getAllLeaveRequests(
        token,
        1,
        100, // Get more records for managers
        filterStatus,
        filterType,
        startDate,
        endDate
      );
      if (resp.success && resp.data) {
        let leaves = resp.data.data;

        // Client-side filtering for requester name
        // This acts as a reliable fallback if the backend filtering is not working for partial names
        if (requesterFilter) {
          const lowerFilter = requesterFilter.toLowerCase();
          leaves = leaves.filter((leave) =>
            leave.requester?.fullName?.toLowerCase().includes(lowerFilter)
          );
        }

        setLeaveRequests(leaves);
      }
    } catch (error: any) {
      console.error("Failed to fetch leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async () => {
    const token = getAuthToken();
    if (!token || !selectedLeave || !actionType) {
      throw new Error("Invalid state");
    }

    const resp = await attendanceApi.approveLeaveRequest(
      token,
      selectedLeave.id,
      {
        status: actionType,
        approvalNote:
          approvalNote.trim() || `Leave request ${actionType.toLowerCase()}`,
      }
    );

    if (resp.success) {
      setSelectedLeave(null);
      setApprovalNote("");
      setActionType(null);
      await fetchLeaveRequests();
      return resp.data;
    }
    throw new Error(`Failed to ${actionType.toLowerCase()} leave request`);
  };

  const handleUpdateLeave = async () => {
    const token = getAuthToken();
    if (!token || !editingLeave) {
      throw new Error("Invalid state");
    }

    const resp = await attendanceApi.updateLeaveRequest(
      token,
      editingLeave.id,
      {
        type: editType as any,
        requestReason: editRequestReason,
        startDate: editStartDate,
        endDate: editEndDate,
      }
    );

    if (resp.success) {
      setEditingLeave(null);
      await fetchLeaveRequests();
      return resp.data;
    }
    throw new Error("Failed to update leave request");
  };

  const handleDeleteLeave = async () => {
    const token = getAuthToken();
    if (!token || !deleteLeaveId) {
      throw new Error("Invalid state");
    }

    const resp = await attendanceApi.deleteLeaveRequest(token, deleteLeaveId);

    if (resp.success) {
      setDeleteLeaveId(null);
      await fetchLeaveRequests();
      return resp.data;
    }
    throw new Error("Failed to delete leave request");
  };

  const openApproveDialog = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setActionType("APPROVED");
    setApprovalNote("");
  };

  const openRejectDialog = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setActionType("REJECTED");
    setApprovalNote("");
  };

  const openEditDialog = (leave: LeaveRequest) => {
    setEditingLeave(leave);
    setEditType(leave.type);
    setEditRequestReason(leave.requestReason);
    setEditStartDate(leave.startDate);
    setEditEndDate(leave.endDate);
  };

  const closeDialog = () => {
    setSelectedLeave(null);
    setApprovalNote("");
    setActionType(null);
    setEditingLeave(null);
    setDeleteLeaveId(null);
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, [filterStatus, filterType, startDate, endDate, requesterFilter]);

  return {
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
  };
}
