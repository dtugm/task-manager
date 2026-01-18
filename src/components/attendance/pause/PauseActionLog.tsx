import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { AttendancePause } from "@/types/attendance-pause";

interface PauseActionLogProps {
  pauses: AttendancePause[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function PauseActionLog({
  pauses,
  loading,
  onDelete,
}: PauseActionLogProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pauses.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        No pause history found for this session.
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
          <TableRow>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pauses.map((pause) => {
            const start = new Date(pause.pauseStart);
            const end = pause.pauseEnd ? new Date(pause.pauseEnd) : null;

            // Calculate duration if both exist
            let durationStr = "-";
            if (end) {
              const diffMs = end.getTime() - start.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const hrs = Math.floor(diffMins / 60);
              const mins = diffMins % 60;
              durationStr = `${hrs}h ${mins}m`;
            } else {
              durationStr = "Ongoing";
            }

            return (
              <TableRow key={pause.id}>
                <TableCell className="font-medium">
                  {format(start, "HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {end ? (
                    format(end, "HH:mm:ss")
                  ) : (
                    <span className="text-amber-500 italic">Active</span>
                  )}
                </TableCell>
                <TableCell>{durationStr}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => onDelete(pause.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
