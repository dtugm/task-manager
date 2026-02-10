"use client";

import { useState, useEffect, useCallback } from "react";
import { taskApi } from "@/lib/task-api";
import { authApi } from "@/lib/auth-api";
import { projectApi } from "@/lib/project-api";
import { Task } from "@/types/task";
import { Project } from "@/types/project";

export function useMyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      // Fetch current user if not already fetched
      let userId = currentUserId;
      if (!userId) {
        // Try local storage first
        const storedUserStr = localStorage.getItem("user_data");
        if (storedUserStr) {
          try {
            const storedUser = JSON.parse(storedUserStr);
            userId = storedUser.user?.id || storedUser.id;
            if (userId) setCurrentUserId(userId);
          } catch (e) {
            console.error("Failed to parse user_data", e);
          }
        }

        if (!userId) {
          const userResponse = await authApi.getCurrentUser(token);
          if (userResponse.success && userResponse.data) {
            const userData = userResponse.data as any;
            userId = userData.user?.id || userData.id;
            if (userId) setCurrentUserId(userId);
          }
        }
      }

      // Fetch tasks assigned to current user
      const response = await taskApi.getTasks(
        token,
        1,
        100,
        userId || undefined,
      );
      if (response.success) {
        setTasks(response.data.tasks);
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

  const [totalPoints, setTotalPoints] = useState<number>(0);

  const fetchPoints = useCallback(async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    try {
      const response = await taskApi.getCurrentMonthPoints(token);
      if (response.success && response.data) {
        setTotalPoints(response.data.points);
      }
    } catch (err) {
      console.error("Failed to fetch points", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchPoints();
  }, [fetchTasks, fetchProjects, fetchPoints]);

  return {
    tasks,
    projects,
    isLoading,
    totalPoints,
    fetchTasks,
    fetchPoints,
  };
}
