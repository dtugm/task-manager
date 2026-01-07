"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LayoutGrid, Plus, Search, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useProjects } from "@/hooks/useProjects";
import { ProjectDialogs } from "@/components/project-management/ProjectDialogs";
import { ProjectsTable } from "@/components/project-management/ProjectsTable";
import { Project } from "@/types/project";

export default function ProjectManagementPage() {
  const { t } = useLanguage();
  const {
    projects,
    isLoading,
    error,
    saveProject,
    deleteProject,
    isSaving,
    isDeleting,
  } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Delete Confirmation State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

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
    const success = await saveProject(editingProject, formData);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    const success = await deleteProject(projectToDelete);
    if (success) {
      setIsDeleteOpen(false);
      setProjectToDelete(null);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative isolate space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in-50 duration-500 min-h-[calc(100vh-4rem)]">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob bg-[#0077FF]/30 dark:bg-[#0077FF]/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 bg-[#F1677C]/30 dark:bg-[#F1677C]/20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 bg-[#FFB200]/30 dark:bg-[#FFB200]/20"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0077FF] to-[#0C426A] shadow-lg shadow-[#0077FF]/20 text-white">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0C426A] to-[#0077FF] dark:from-white dark:to-slate-300">
                {t.projectManagementTitle}
              </h1>
              <p className="text-[#0C426A]/70 dark:text-slate-400 font-medium">
                {t.projectManagementDesc}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleOpenCreate}
          size="lg"
          className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white shadow-lg shadow-[#0077FF]/25 dark:shadow-[#0077FF]/10 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl font-medium"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t.newProject}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
          <div className="p-1 rounded-full bg-red-100">
            <Trash2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0077FF] transition-colors" />
          <Input
            placeholder={t.search || "Search projects..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus-visible:ring-[#0077FF] focus-visible:border-[#0077FF] transition-all rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Projects List Card */}
      <ProjectsTable
        projects={filteredProjects}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />

      <ProjectDialogs
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        editingProject={editingProject}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        onDelete={confirmDelete}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />
    </div>
  );
}
