import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Edit,
  Trash2,
  Tag,
  Calendar as CalendarIcon,
  TrendingUp,
} from "lucide-react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";

interface TaskCardProps {
  task: Task;
  deleteMode: boolean;
  onClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onConfirmDelete: (taskId: string) => void;
}

export function TaskCard({
  task,
  deleteMode,
  onClick,
  onEdit,
  onConfirmDelete,
}: TaskCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 shadow-md shadow-slate-200/40 dark:shadow-black/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md ring-1 ring-white/50 dark:ring-white/5 rounded-2xl overflow-hidden"
      onClick={() => onClick(task)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h3 className="font-bold text-lg text-[#0C426A] dark:text-slate-100 group-hover:text-[#0077FF] transition-colors line-clamp-1">
              {task.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
          <div className="flex gap-2 items-start shrink-0">
            <Badge
              variant="secondary"
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                task.priority === "HIGH"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  : task.priority === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {task.priority}
            </Badge>
            {!deleteMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="h-8 w-8 hover:bg-[#0077FF]/10 hover:text-[#0077FF] transition-colors rounded-full"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {deleteMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmDelete(task.id);
                }}
                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-5">
          <div className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">
            <Tag className="h-3.5 w-3.5 text-[#0077FF]" />
            <span className="font-medium">
              {task.points} {t.totalPoints.split(" ")[1]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">
            <CalendarIcon className="h-3.5 w-3.5 text-[#F1677C]" />
            <span className="font-medium">
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Progress
            </span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0077FF] to-[#00C6FF] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
