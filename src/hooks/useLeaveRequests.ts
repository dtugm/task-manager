import { useState, useEffect } from "react";
import { attendanceApi } from "@/lib/attendance-api";
import type {
  LeaveRequest,
  LeaveRequestPayload,
  LeaveType,
} from "@/types/leave";

export function useLeaveRequests() {
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [leaveHistoryLoading, setLeaveHistoryLoading] = useState(false);
  const [filterLeaveStatus, setFilterLeaveStatus] = useState<string>("all");
  const [filterLeaveType, setFilterLeaveType] = useState<string>("all");
  const [leaveStartDate, setLeaveStartDate] = useState<string>("");
  const [leaveEndDate, setLeaveEndDate] = useState<string>("");

  // Edit/Delete state
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);
  const [editLeaveType, setEditLeaveType] = useState<string>("");
  const [editStartDate, setEditStartDate] = useState<string>("");
  const [editEndDate, setEditEndDate] = useState<string>("");
  const [editReason, setEditReason] = useState<string>("");
  const [deleteLeaveId, setDeleteLeaveId] = useState<string | null>(null);

  const getAuthToken = () => {
    const match = document.cookie.match(/accessToken=([^;]+)/);
    return match ? match[1] : null;
  };

  const fetchLeaveHistory = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLeaveHistoryLoading(true);
    try {
      const resp = await attendanceApi.getMyLeaveRequests(
        token,
        1,
        20,
        filterLeaveStatus,
        filterLeaveType,
        leaveStartDate,
        leaveEndDate
      );
      if (resp.success && resp.data) {
        setLeaveHistory(resp.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch leave history:", error);
    } finally {
      setLeaveHistoryLoading(false);
    }
  };

  const handleCreateLeave = async (payload: LeaveRequestPayload) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login first");
    }

    const resp = await attendanceApi.createLeaveRequest(token, payload);
    if (resp.success) {
      await fetchLeaveHistory();
      return resp.data;
    }
    throw new Error("Failed to create leave request");
  };

  const handleEditLeave = (leave: LeaveRequest) => {
    setEditingLeave(leave);
    setEditLeaveType(leave.type);
    setEditStartDate(leave.startDate);
    setEditEndDate(leave.endDate);
    setEditReason(leave.requestReason);
  };

  const handleUpdateLeave = async () => {
    const token = getAuthToken();
    if (!token || !editingLeave) {
      throw new Error("Invalid state");
    }

    if (
      !editLeaveType ||
      !editStartDate ||
      !editEndDate ||
      !editReason.trim()
    ) {
      throw new Error("Please fill in all fields");
    }

    const payload: LeaveRequestPayload = {
      type: editLeaveType as LeaveType,
      requestReason: editReason,
      startDate: editStartDate,
      endDate: editEndDate,
    };

    const resp = await attendanceApi.updateLeaveRequest(
      token,
      editingLeave.id,
      payload
    );

    if (resp.success) {
      setEditingLeave(null);
      await fetchLeaveHistory();
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
      await fetchLeaveHistory();
      return resp.data;
    }
    throw new Error("Failed to delete leave request");
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, [filterLeaveStatus, filterLeaveType, leaveStartDate, leaveEndDate]);

  return {
    leaveHistory,
    leaveHistoryLoading,
    filterLeaveStatus,
    filterLeaveType,
    leaveStartDate,
    leaveEndDate,
    setFilterLeaveStatus,
    setFilterLeaveType,
    setLeaveStartDate,
    setLeaveEndDate,
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
    handleUpdateLeave,
    handleDeleteLeave,
    fetchLeaveHistory,
  };
}
