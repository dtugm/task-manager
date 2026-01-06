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
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(task)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {task.description}
            </p>
          </div>
          <div className="flex gap-2 items-start">
            <Badge
              variant="secondary"
              className={
                task.priority === "HIGH"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }
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
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>
              {task.points} {t.totalPoints.split(" ")[1]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-blue-600 font-medium">
              <TrendingUp className="h-4 w-4" />
              Progress
            </span>
            <span className="font-bold">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
