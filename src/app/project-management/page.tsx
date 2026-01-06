"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  Plus,
  Folder,
  MoreHorizontal,
  Loader2,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { projectApi } from "@/lib/project-api";
import { Project } from "@/types/project";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLanguage } from "@/contexts/language-context";

export default function ProjectManagementPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Delete Confirmation State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await projectApi.getAllProjects(token);
      if (response.success) {
        setProjects(response.data);
      } else {
        setError(response.error?.message || "Failed to fetch projects");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: "" });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;
    setError(null);

    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) return;

    try {
      if (editingProject) {
        // Update
        const response = await projectApi.updateProject(
          token,
          editingProject.id,
          { name: formData.name }
        );
        if (response.success) {
          setProjects(
            projects.map((p) =>
              p.id === editingProject.id ? response.data : p
            )
          );
          setIsDialogOpen(false);
        } else {
          setError(response.error?.message || "Failed to update project");
        }
      } else {
        // Create
        const response = await projectApi.createProject(token, {
          name: formData.name,
        });
        if (response.success) {
          setProjects([...projects, response.data]);
          setIsDialogOpen(false);
        } else {
          setError(response.error?.message || "Failed to create project");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    }
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) return;

    try {
      const response = await projectApi.deleteProject(token, projectToDelete);
      if (response.success) {
        setProjects(projects.filter((p) => p.id !== projectToDelete));
        setIsDeleteOpen(false);
        setProjectToDelete(null);
      } else {
        setError(response.error?.message || "Failed to delete project");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.projectManagementTitle}
          </h2>
          <p className="text-muted-foreground">{t.projectManagementDesc}</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t.newProject}
        </Button>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : t.createNewProject}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the project details below."
                : "Create a new project to start tracking tasks."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="p-name">{t.projectName}</Label>
              <Input
                id="p-name"
                placeholder={t.projectNamePlaceholder}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t.cancel || "Cancel"}
            </Button>
            <Button onClick={handleSave} disabled={!formData.name}>
              {editingProject ? "Update" : t.saveProject}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {t.cancel || "Cancel"}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Projects List */}
      <Card>
        <CardContent className="p-0 mx-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.projectName}</TableHead>
                <TableHead>{t.activeTasks}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Folder className="h-4 w-4" />
                      </div>
                      {project.name}
                    </div>
                  </TableCell>

                  <TableCell>0</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      {t.active || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href = `/project-management/${project.id}/members`)
                        }
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(project)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(project.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
