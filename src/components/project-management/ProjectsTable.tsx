import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Folder, Loader2, Pencil, Trash2 } from "lucide-react";
import { Project } from "@/types/project";
import { useLanguage } from "@/contexts/language-context";

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectsTable({
  projects,
  isLoading,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-0 shadow-xl shadow-slate-200/40 dark:shadow-black/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden rounded-2xl ring-1 ring-white/50 dark:ring-white/5">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur text-xs uppercase tracking-wider">
            <TableRow className="hover:bg-transparent border-b border-slate-200/60 dark:border-slate-800/60">
              <TableHead className="pl-6 py-5 font-semibold text-[#0C426A]/80 dark:text-slate-300">
                {t.projectName}
              </TableHead>
              <TableHead className="py-5 font-semibold text-[#0C426A]/80 dark:text-slate-300">
                {t.activeTasks}
              </TableHead>
              <TableHead className="py-5 font-semibold text-[#0C426A]/80 dark:text-slate-300">
                {t.status}
              </TableHead>
              <TableHead className="py-5 font-semibold text-[#0C426A]/80 dark:text-slate-300 text-right pr-6">
                {t.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#0077FF]" />
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <Folder className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      No projects found
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Create a new project to get started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="group hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#FFB200]/10 text-[#FFB200] rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Folder className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                          {project.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                      <span className="text-lg text-[#0C426A] dark:text-slate-200">
                        0
                      </span>
                      <span className="text-xs uppercase tracking-wide opacity-70">
                        Tasks
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 px-3 py-1 rounded-lg font-medium"
                    >
                      {t.active || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href = `/project-management/${project.id}/members`)
                        }
                        className="h-9 w-9 text-[#0C426A]/60 hover:text-[#0C426A] hover:bg-[#0077FF]/10 dark:text-slate-400 dark:hover:text-[#0077FF] dark:hover:bg-[#0077FF]/20 rounded-xl transition-all"
                        title="View Members"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(project)}
                        className="h-9 w-9 text-[#0077FF]/60 hover:text-[#0077FF] hover:bg-[#0077FF]/10 dark:text-slate-400 dark:hover:text-[#0077FF] dark:hover:bg-[#0077FF]/20 rounded-xl transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(project.id)}
                        className="h-9 w-9 text-[#F1677C]/60 hover:text-[#F1677C] hover:bg-[#F1677C]/10 dark:text-slate-400 dark:hover:text-[#F1677C] dark:hover:bg-[#F1677C]/20 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
