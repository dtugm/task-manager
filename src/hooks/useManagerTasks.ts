"use client";

import { useState, useCallback, useEffect } from "react";
import { taskApi } from "@/lib/task-api";
import { authApi } from "@/lib/auth-api";
import { projectApi } from "@/lib/project-api";
import { Task } from "@/types/task";
import { Project } from "@/types/project";

const ORGANIZATION_ID =
  process.env.NEXT_PUBLIC_ORGANIZATION_ID || "KELGsLB6canc9jAX7035G";

interface Supervisor {
  id: string;
  fullName: string;
  email: string;
}

export function useManagerTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [executiveTasks, setExecutiveTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupervisorsLoading, setIsSupervisorsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      let userId = currentUserId;
      if (!userId) {
        // 1. Try Local Storage
        const storedUserStr = localStorage.getItem("user_data");
        if (storedUserStr) {
          try {
            const storedUser = JSON.parse(storedUserStr);
            // Handle { user: { id: ... } } (UserContext) OR { id: ... } (User)
            userId = storedUser.user?.id || storedUser.id;

            if (userId) {
              setCurrentUserId(userId);
            }
          } catch (e) {
            console.error("Failed to parse user_data from localStorage", e);
          }
        }

        // 2. Try API if still missing
        if (!userId) {
          const userResponse = await authApi.getCurrentUser(token);
          if (userResponse.success && userResponse.data) {
            // endpoint /users/me returns UserContext { user: User, ... }
            const userData = userResponse.data as any;
            userId = userData.user?.id || userData.id;

            if (userId) {
              setCurrentUserId(userId);
            }
          }
        }
      }

      if (!userId) {
        setIsLoading(false);
        return;
      }

      // Fetch tasks created by me AND tasks assigned to me in parallel to achieve "OR" logic
      // API defaults to "AND" when both params are present
      const [createdResponse, assignedResponse] = await Promise.all([
        taskApi.getTasks(
          token,
          1,
          100,
          undefined, // assigneeId
          userId || undefined, // creatorId
          undefined, // search
          undefined, // projectId
        ),
        taskApi.getTasks(
          token,
          1,
          100,
          userId || undefined, // assigneeId
          undefined, // creatorId
          undefined, // search
          undefined, // projectId
        ),
      ]);

      if (createdResponse.success && assignedResponse.success) {
        const createdTasks = createdResponse.data.tasks;
        const assignedTasks = assignedResponse.data.tasks;

        // Merge and deduplicate
        const allFetchedTasks = [...createdTasks, ...assignedTasks];
        const uniqueTasksMap = new Map(allFetchedTasks.map((t) => [t.id, t]));
        const uniqueTasks = Array.from(uniqueTasksMap.values());

        const taskMap = new Map(uniqueTasks.map((t) => [t.id, t]));

        // Hydrate children
        const allTasksHydrated = uniqueTasks.map((task) => {
          if (!task.childTasks || task.childTasks.length === 0) {
            return task;
          }
          const enrichedChildren = task.childTasks.map((childSummary) => {
            const fullChild = taskMap.get(childSummary.id);
            return fullChild || childSummary;
          });
          return { ...task, childTasks: enrichedChildren };
        });

        // 3. Since we explicitly fetched "Created By Me" and "Assigned To Me",
        // all tasks in this list are relevant.
        const myRelevantTasksMap = new Map<string, Task>();
        allTasksHydrated.forEach((t) => myRelevantTasksMap.set(t.id, t));

        const relevantTasksList = Array.from(myRelevantTasksMap.values());

        // 4. View Logic: Top Level Tasks
        // Show if (A) Root task OR (B) Parent is NOT relevant (e.g. assigned to Manager)
        const topLevelRelevantTasks = relevantTasksList.filter((t) => {
          if (!t.parentTask) return true;

          const parentIsRelevant = myRelevantTasksMap.has(t.parentTask.id);
          return !parentIsRelevant;
        });

        setAllTasks(allFetchedTasks);
        setExecutiveTasks(topLevelRelevantTasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  const fetchProjects = useCallback(async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    try {
      const response = await projectApi.getAllProjects(token);
      if (response.success && Array.isArray(response.data)) {
        setProjects(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  }, []);

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
        100,
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
        new Map(mappedSupervisors.map((s) => [s.id, s])).values(),
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
    fetchProjects();
    fetchSupervisors();
  }, [fetchTasks, fetchProjects, fetchSupervisors]);

  return {
    allTasks,
    executiveTasks,
    projects,
    supervisors,
    isLoading,
    isSupervisorsLoading,
    fetchTasks,
  };
}
