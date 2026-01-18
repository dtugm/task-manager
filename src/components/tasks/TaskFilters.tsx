import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";
import { useLanguage } from "@/contexts/language-context";

interface TaskFiltersProps {
  filterDateFrom: string;
  setFilterDateFrom: (value: string) => void;
  filterDateTo: string;
  setFilterDateTo: (value: string) => void;
  filterProject: string;
  setFilterProject: (value: string) => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterQuest?: string;
  setFilterQuest?: (value: string) => void;
  filterAssignee: string;
  setFilterAssignee: (value: string) => void;
  projects: Project[];
  onClear: () => void;
}

export function TaskFilters({
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
  filterProject,
  setFilterProject,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  filterQuest,
  setFilterQuest,
  filterAssignee,
  setFilterAssignee,
  projects,
  onClear,
}: TaskFiltersProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-none shadow-sm bg-muted/20">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground">
            {t.filter}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date From */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t.filterByDate} (From)
              </Label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="h-8 bg-background"
              />
            </div>
            {/* Date To */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t.filterByDate} (To)
              </Label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="h-8 bg-background"
              />
            </div>
            {/* Project */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t.filterByProject}
              </Label>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder={t.allProjects} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allProjects}</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Priority */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t.filterByPriority}
              </Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder={t.allPriority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allPriority}</SelectItem>
                  <SelectItem value="low">{t.low.toUpperCase()}</SelectItem>
                  <SelectItem value="medium">
                    {t.medium.toUpperCase()}
                  </SelectItem>
                  <SelectItem value="high">{t.high.toUpperCase()}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Status */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t.filterByStatus}
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder={t.allStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatus}</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING_APPROVAL">
                    Pending Approval
                  </SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Quest */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Quest</Label>
              <Select value={filterQuest} onValueChange={setFilterQuest}>
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder="All Quests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quests</SelectItem>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="side">Side</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Assignee */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Filter by Assignee
              </Label>
              <Input
                placeholder="Search assignee..."
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="h-8 bg-background"
              />
            </div>
            {/* Clear Filters Button */}
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-xs"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
