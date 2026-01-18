"use client";

import { useEffect, useState } from "react";
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
  Download,
  RefreshCcw,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { OvertimeRequest } from "@/types/overtime";
import { pauseOvertimeApi } from "@/lib/pause-overtime-api";
import { toast } from "sonner";
import { format } from "date-fns";
import { OvertimeApprovalTable } from "@/components/attendance/overtime/OvertimeApprovalTable";
import { OvertimeApprovalActionDialog } from "@/components/attendance/overtime/OvertimeApprovalActionDialog";
import { UserSearchSelect } from "@/components/common/UserSearchSelect";

export default function OvertimeApprovalPage() {
  const { t } = useLanguage();

  // State
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Action State
  const [actionDialogState, setActionDialogState] = useState<{
    open: boolean;
    request: OvertimeRequest | null;
    action: "APPROVE" | "REJECT" | null;
  }>({
    open: false,
    request: null,
    action: null,
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filters
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterRequesterId, setFilterRequesterId] = useState<
    string | undefined
  >(undefined);
  const [filterApproverId, setFilterApproverId] = useState<string | undefined>(
    undefined
  );

  const getToken = () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    return match ? match[2] : null;
  };

  useEffect(() => {
    fetchRequests();
  }, [
    pagination.page,
    filterStartDate,
    filterStatus,
    filterRequesterId,
    filterApproverId,
  ]);

  const fetchRequests = async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      // API Parameters mapping
      const statusParam = filterStatus === "ALL" ? undefined : filterStatus;

      const resp = await pauseOvertimeApi.getAllOvertimeRequests(
        token,
        pagination.page,
        pagination.limit,
        filterRequesterId, // requesterId
        filterApproverId, // approverId
        statusParam,
        filterStartDate || undefined // date
      );

      if (resp.success && resp.data) {
        setRequests(resp.data.data);
        setPagination({
          ...pagination,
          total: resp.data.pagination.total,
          totalPages: resp.data.pagination.pages || 1, // Fallback if pages not returned
          page: resp.data.pagination.page,
        });
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
      toast.error("Failed to load overtime requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (
    request: OvertimeRequest,
    action: "APPROVE" | "REJECT"
  ) => {
    setActionDialogState({
      open: true,
      request,
      action,
    });
  };

  const handleConfirmAction = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    note: string
  ) => {
    const token = getToken();
    if (!token) return;

    setIsActionLoading(true);
    try {
      await pauseOvertimeApi.approveOvertime(token, id, {
        status,
        approvalNote: note,
      });

      toast.success(`Overtime request ${status.toLowerCase()} successfully`);
      setActionDialogState((prev) => ({ ...prev, open: false }));

      // Refresh table
      fetchRequests();
    } catch (error: any) {
      toast.error(
        error.message ||
          `Failed to ${status === "APPROVED" ? "approve" : "reject"} request`
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleExport = async () => {
    if (requests.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const XLSX = await import("xlsx");

      const exportData = requests.map((req) => ({
        Requester: req.requester?.fullName,
        Email: req.requester?.email,
        Approver: req.approver?.fullName || "-",
        Date: format(new Date(req.clockIn), "yyyy-MM-dd"),
        "Clock In": format(new Date(req.clockIn), "HH:mm"),
        "Clock Out": format(new Date(req.clockOut), "HH:mm"),
        Activities: req.activities,
        Status: req.status,
        "Approval Note": req.approvalNote || "-",
        "Created At": format(new Date(req.createdAt), "yyyy-MM-dd HH:mm"),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Overtime Approvals");

      const fileName = `overtime_approvals_${format(
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

  const handleClearFilters = () => {
    setFilterStartDate("");
    setFilterStatus("ALL");
    setFilterRequesterId(undefined);
    setFilterApproverId(undefined);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Blobs Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Overtime Approval
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Review and manage employee overtime requests
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Tools */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl shadow-indigo-500/5 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center">
            {/* Filters */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date
                </label>
                <Input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => {
                    setFilterStartDate(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <Select
                  value={filterStatus}
                  onValueChange={(val) => {
                    setFilterStatus(val);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  <SelectTrigger className="bg-white/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Requester
                </label>
                <UserSearchSelect
                  value={filterRequesterId}
                  onChange={(val) => {
                    setFilterRequesterId(val);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  placeholder="All Employees"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Approver
                </label>
                <UserSearchSelect
                  value={filterApproverId}
                  onChange={(val) => {
                    setFilterApproverId(val);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  placeholder="All Approvers"
                />
              </div>
              <div className="flex items-end pb-0.5">
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  className="text-slate-500"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full lg:w-auto mt-4 lg:mt-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchRequests()}
                title="Refresh"
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="space-y-4">
          <OvertimeApprovalTable
            requests={requests}
            loading={isLoading}
            onApprove={(req) => handleActionClick(req, "APPROVE")}
            onReject={(req) => handleActionClick(req, "REJECT")}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1 || isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(pagination.totalPages, prev.page + 1),
                  }))
                }
                disabled={
                  pagination.page === pagination.totalPages || isLoading
                }
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <OvertimeApprovalActionDialog
        open={actionDialogState.open}
        onClose={() =>
          setActionDialogState((prev) => ({ ...prev, open: false }))
        }
        request={actionDialogState.request}
        action={actionDialogState.action}
        onConfirm={handleConfirmAction}
        isLoading={isActionLoading}
      />
    </div>
  );
}
