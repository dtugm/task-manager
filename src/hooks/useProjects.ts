import { useState, useEffect, useCallback } from "react";
import { projectApi } from "@/lib/project-api";
import { Project } from "@/types/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const saveProject = async (
    project: Project | null,
    formData: { name: string }
  ) => {
    setError(null);
    setIsSaving(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsSaving(false);
      return false;
    }

    try {
      let response: any;
      if (project) {
        // Update
        response = await projectApi.updateProject(token, project.id, {
          name: formData.name,
        });
        if (response.success) {
          setProjects((prev) =>
            prev.map((p) => (p.id === project.id ? response.data : p))
          );
        }
      } else {
        // Create
        response = await projectApi.createProject(token, {
          name: formData.name,
        });
        if (response.success) {
          setProjects((prev) => [...prev, response.data]);
        }
      }

      if (!response.success) {
        setError(response.error?.message || "Failed to save project");
      }
      return response.success;
    } catch (err: any) {
      setError(err.message || "Failed to save project");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    setIsDeleting(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsDeleting(false);
      return false;
    }

    try {
      const response = await projectApi.deleteProject(token, id);
      if (response.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        setError(response.error?.message || "Failed to delete project");
      }
      return response.success;
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    projects,
    isLoading,
    error,
    isSaving,
    isDeleting,
    fetchProjects,
    saveProject,
    deleteProject,
  };
}
