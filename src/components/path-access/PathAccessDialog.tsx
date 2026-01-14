"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PathAccess, PathAccessPayload } from "@/types/path-access";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface PathAccessDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: PathAccessPayload) => Promise<void>;
  initialData?: PathAccess | null;
  isLoading?: boolean;
}

const AVAILABLE_ROLES = [
  "Super Admin",
  "Admin",
  "Developer",
  "Executive",
  "Manager",
  "Supervisor",
  "Employee",
];

export function PathAccessDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: PathAccessDialogProps) {
  const [path, setPath] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (initialData) {
      setPath(initialData.path);
      setSelectedRoles(initialData.roles || []);
      setProjectId(initialData.project?.id || "");
    } else {
      setPath("");
      setSelectedRoles([]);
      setProjectId("");
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!path || selectedRoles.length === 0) return;

    await onSubmit({
      path,
      roles: selectedRoles,
      projectId: projectId || undefined,
    });
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
            {initialData ? "Edit Access Rule" : "Add Access Rule"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="path">Path URL</Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="e.g. /dashboard/analytics"
              className="bg-slate-50 dark:bg-slate-800"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Allowed Roles</Label>
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              {AVAILABLE_ROLES.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <Label
                    htmlFor={`role-${role}`}
                    className="text-sm font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Project ID (Optional)</Label>
            <Input
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="proj_..."
              className="bg-slate-50 dark:bg-slate-800"
            />
            <p className="text-xs text-slate-500">
              Only needed for project-specific access rules
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !path || selectedRoles.length === 0}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Rule" : "Create Rule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
