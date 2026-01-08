import { useState, useCallback, useEffect } from "react";
import { taskApi } from "@/lib/task-api";
import { authApi } from "@/lib/auth-api";
import { Task } from "@/types/task";

const ORGANIZATION_ID =
  process.env.NEXT_PUBLIC_ORGANIZATION_ID || "KELGsLB6canc9jAX7035G";

interface Supervisor {
  id: string;
  fullName: string;
  email: string;
}

export function useProjectTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupervisorsLoading, setIsSupervisorsLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Pass projectId to the API
      // getProjectTasks(token, projectId, page, limit)
      const response = await taskApi.getProjectTasks(token, projectId, 1, 100);

      if (response.success) {
        const fetchedTasks = response.data.tasks;
        const taskMap = new Map(fetchedTasks.map((t) => [t.id, t]));

        // Hydrate children
        const allTasksHydrated = fetchedTasks.map((task) => {
          if (!task.childTasks || task.childTasks.length === 0) {
            return task;
          }
          const enrichedChildren = task.childTasks.map((childSummary) => {
            const fullChild = taskMap.get(childSummary.id);
            return fullChild || childSummary;
          });
          return { ...task, childTasks: enrichedChildren };
        });

        setTasks(allTasksHydrated);
      }
    } catch (err) {
      console.error("Failed to fetch project tasks", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const fetchSupervisors = useCallback(async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsSupervisorsLoading(true);
    try {
      const response = await authApi.getOrganizationUsers(
        token,
        ORGANIZATION_ID,
        1,
        100
      );

      let rawData: any = response;
      if (response && (response as any).success && (response as any).data) {
        rawData = (response as any).data;
      }

      const mappedSupervisors: Supervisor[] = [];
      let usersSource: any[] = [];

      if (Array.isArray(rawData)) {
        usersSource = rawData;
      } else if (rawData && Array.isArray(rawData.data)) {
        usersSource = rawData.data;
      } else if (rawData && Array.isArray(rawData.users)) {
        usersSource = rawData.users;
      }

      usersSource.forEach((item: any) => {
        if (
          item.role === "Supervisor" ||
          item.role === "SUPERVISOR" ||
          item.role === "Manager"
        ) {
          if (item.user && item.user.id) {
            mappedSupervisors.push({
              id: item.user.id,
              fullName: item.user.fullName || item.user.username || "Unknown",
              email: item.user.email,
            });
          } else if (item.id && (item.fullName || item.username)) {
            mappedSupervisors.push({
              id: item.id,
              fullName: item.fullName || item.username || "Unknown",
              email: item.email,
            });
          }
        }
      });

      const uniqueSupervisors = Array.from(
        new Map(mappedSupervisors.map((s) => [s.id, s])).values()
      );
      setSupervisors(uniqueSupervisors);
    } catch (err) {
      console.error("Failed to fetch supervisors", err);
    } finally {
      setIsSupervisorsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchSupervisors();
  }, [fetchTasks, fetchSupervisors]);

  return {
    tasks,
    supervisors,
    isLoading,
    isSupervisorsLoading,
    fetchTasks,
  };
}
