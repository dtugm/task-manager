import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Download,
  ImageOff,
  Loader2,
  RefreshCcw,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { attendanceApi } from "@/lib/attendance-api";
import type { AttendanceLog } from "@/types/attendance";
import { ActivityCell } from "../attendance-log/ActivityCell";

interface AttendanceHistoryTableProps {
  history: AttendanceLog[];
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
  startDate: string;
  endDate: string;
  filterWorkType: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onFilterWorkTypeChange: (value: string) => void;
  t: any; // Translation object
}

interface PreviewState {
  url: string;
  label: string;
  logId: string;
  side: "in" | "out";
}

function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^| )accessToken=([^;]+)/);
  return match ? match[1] : null;
}

export function AttendanceHistoryTable({
  history,
  loading,
  onRefresh,
  onExport,
  startDate,
  endDate,
  filterWorkType,
  onStartDateChange,
  onEndDateChange,
  onFilterWorkTypeChange,
  t,
}: AttendanceHistoryTableProps) {
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [replacing, setReplacing] = useState(false);
  const [bustParam, setBustParam] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cacheBustedUrl = (url: string | null | undefined, logId: string) => {
    if (!url) return url ?? null;
    const bust = bustParam[logId];
    if (!bust) return url;
    return url.includes("?") ? `${url}&v=${bust}` : `${url}?v=${bust}`;
  };

  const openPreview = (
    url: string | null | undefined,
    label: string,
    logId: string,
    side: "in" | "out"
  ) => {
    if (!url) return;
    setPreview({
      url: cacheBustedUrl(url, logId) ?? url,
      label,
      logId,
      side,
    });
  };

  const renderThumb = (
    url: string | null | undefined,
    label: string,
    logId: string,
    side: "in" | "out"
  ) => {
    if (!url) {
      return (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
          <ImageOff className="h-4 w-4" />
        </span>
      );
    }
    const displayUrl = cacheBustedUrl(url, logId) ?? url;
    return (
      <button
        type="button"
        onClick={() => openPreview(url, label, logId, side)}
        className="inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayUrl}
          alt={label}
          className="h-10 w-10 rounded-md object-cover border border-slate-200 dark:border-slate-700/50"
        />
      </button>
    );
  };

  const handleReplaceClick = () => {
    if (!preview || replacing) return;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file || !preview) return;

    const token = getAuthToken();
    if (!token) {
      alert("Please log in again.");
      return;
    }

    setReplacing(true);
    try {
      const resp = await attendanceApi.replaceAttendancePhoto(
        token,
        preview.logId,
        preview.side,
        file
      );
      if (!resp.success || !resp.data) {
        throw new Error(resp.error?.message || "Failed to replace photo");
      }
      const newUrl =
        preview.side === "in"
          ? resp.data.clockInPhotoUrl
          : resp.data.clockOutPhotoUrl;
      if (newUrl) {
        const bust = Date.now();
        setBustParam((prev) => ({ ...prev, [preview.logId]: bust }));
        const busted = newUrl.includes("?")
          ? `${newUrl}&v=${bust}`
          : `${newUrl}?v=${bust}`;
        setPreview({ ...preview, url: busted });
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to replace photo");
    } finally {
      setReplacing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
            {t.attendanceHistory}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.yourPastRecords}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="rounded-xl"
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", loading && "animate-spin")}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={onExport}
            className="rounded-xl border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-800 hover:border-green-300 transition-all bg-white/50 dark:bg-slate-900/50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50"
          />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50"
          />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Work Type</Label>
          <Select value={filterWorkType} onValueChange={onFilterWorkTypeChange}>
            <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Work from Office">Work from Office</SelectItem>
              <SelectItem value="Work from Home">Work from Home</SelectItem>
              <SelectItem value="Field Work">Field Work</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onStartDateChange("");
              onEndDateChange("");
              onFilterWorkTypeChange("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/20">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead className="hidden sm:table-cell">Photos</TableHead>
              <TableHead className="hidden md:table-cell">Activities</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading history...
                  </div>
                </TableCell>
              </TableRow>
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-slate-500"
                >
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              history.map((log) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">
                    {log.clockIn
                      ? format(new Date(log.clockIn), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {log.workType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.clockIn ? format(new Date(log.clockIn), "HH:mm") : "-"}
                  </TableCell>
                  <TableCell>
                    {log.clockOut
                      ? format(new Date(log.clockOut), "HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      {renderThumb(
                        log.clockInPhotoUrl,
                        "Clock-in photo",
                        log.id,
                        "in"
                      )}
                      {renderThumb(
                        log.clockOutPhotoUrl,
                        "Clock-out photo",
                        log.id,
                        "out"
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px]">
                    <ActivityCell
                      text={log.activities || ""}
                      title="Activities"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        log.clockOut
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100",
                      )}
                    >
                      {log.clockOut ? "Completed" : "Active"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!preview}
        onOpenChange={(open) => {
          if (!open && !replacing) {
            setPreview(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4">
              <span>{preview?.label}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReplaceClick}
                disabled={replacing}
                className="rounded-lg"
              >
                {replacing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retake / Replace
                  </>
                )}
              </Button>
            </DialogTitle>
          </DialogHeader>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelected}
          />
          {preview && (
            <div className="flex items-center justify-center bg-black/5 dark:bg-black/30 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={preview.label}
                className="max-h-[75vh] w-auto max-w-full rounded-lg"
              />
            </div>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Replacing the photo will overwrite the previous one and keep the
            original timestamp in the watermark.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
