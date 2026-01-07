import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Project } from "@/types/project";
import { useLanguage } from "@/contexts/language-context";

interface ProjectDialogsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  editingProject: Project | null;
  formData: { name: string; description: string };
  setFormData: (data: { name: string; description: string }) => void;
  onSave: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function ProjectDialogs({
  isDialogOpen,
  setIsDialogOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  editingProject,
  formData,
  setFormData,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: ProjectDialogsProps) {
  const { t } = useLanguage();

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="overflow-visible sm:max-w-md rounded-2xl border-0 shadow-2xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader className="pb-4 border-b dark:border-slate-800">
            <DialogTitle className="text-xl dark:text-slate-100 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#0077FF]/10 text-[#0077FF]">
                {editingProject ? (
                  <Pencil className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </div>
              {editingProject ? "Edit Project" : t.createNewProject}
            </DialogTitle>
            <DialogDescription className="dark:text-slate-400 pt-2">
              {editingProject
                ? "Update the project details below."
                : "Create a new project to start tracking tasks."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="p-name" className="dark:text-slate-200">
                {t.projectName}
              </Label>
              <Input
                id="p-name"
                placeholder={t.projectNamePlaceholder}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 focus-visible:ring-[#0077FF] h-11"
              />
            </div>
          </div>
          <DialogFooter className="border-t pt-4 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              onClick={onSave}
              disabled={!formData.name || isSaving}
              className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white rounded-xl shadow-lg shadow-[#0077FF]/25"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : editingProject ? (
                "Update"
              ) : (
                t.saveProject
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-2xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <div className="mx-auto p-4 rounded-full bg-[#F1677C]/10 text-[#F1677C] mb-4 w-fit">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-center text-xl dark:text-slate-100">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-center dark:text-slate-400 pt-2">
              Are you sure you want to delete this project? <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl w-full sm:w-auto dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
              className="bg-[#F1677C] hover:bg-[#F1677C]/90 text-white rounded-xl w-full sm:w-auto shadow-lg shadow-[#F1677C]/25"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Delete Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
