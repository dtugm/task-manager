"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";
import { useLanguage } from "@/contexts/language-context";

interface ManagerTaskFiltersProps {
  filterSearch: string;
  setFilterSearch: (value: string) => void;
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
  projects: Project[];
}

export function ManagerTaskFilters({
  filterSearch,
  setFilterSearch,
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
  projects,
}: ManagerTaskFiltersProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground mb-4">
            {t.filterTasks}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t.searchByName}
              </label>
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="bg-muted/30 border-none shadow-sm"
              />
            </div>

            {/* Date From Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t.fromDate}
              </label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="bg-muted/30 border-none shadow-sm"
              />
            </div>

            {/* Date To Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t.toDate}
              </label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="bg-muted/30 border-none shadow-sm"
              />
            </div>

            {/* Project Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t.project}
              </label>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="bg-muted/30 border-none shadow-sm">
                  <SelectValue placeholder={t.allProjects} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allProjects}</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project?.id} value={project?.id || ""}>
                      {project?.name || t.unknown}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t.priority}
              </label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="bg-muted/30 border-none shadow-sm">
                  <SelectValue placeholder={t.allPriority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allPriority}</SelectItem>
                  <SelectItem value="high">{t.high}</SelectItem>
                  <SelectItem value="medium">{t.medium}</SelectItem>
                  <SelectItem value="low">{t.low}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t.status}
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-muted/30 border-none shadow-sm">
                  <SelectValue placeholder={t.allStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatus}</SelectItem>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                  <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                  <SelectItem value="completed">{t.completed}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
