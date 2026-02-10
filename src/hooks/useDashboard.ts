"use client";

import { useState, useEffect, useCallback } from "react";
import { taskApi } from "@/lib/task-api";
import { authApi } from "@/lib/auth-api";
import { projectApi } from "@/lib/project-api"; // Assuming we have this based on previous context
import { Task } from "@/types/task";

export interface DashboardStats {
  totalTasks: number;
  myTasksCount: number;
  totalPoints: number;
  totalProjects: number;
  recentActivity: any[]; // Placeholder for now
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    myTasksCount: 0,
    totalPoints: 0,
    totalProjects: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // Store current user info

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch User to get ID
      let userId: string | undefined;
      let userData: any;

      // Try local storage first
      const storedUserStr = localStorage.getItem("user_data");
      if (storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          userId = storedUser.user?.id || storedUser.id;
          userData = storedUser.user || storedUser;
          // Normalize role
        } catch (e) {
          console.error(e);
        }
      }

      if (!userId) {
        const userResponse = await authApi.getCurrentUser(token);
        if (userResponse.success && userResponse.data) {
          const uData = userResponse.data as any;
          userId = uData.user?.id || uData.id;
          userData = uData.user || uData;
        }
      }

      setUser(userData);

      if (!userId) {
        setIsLoading(false);
        return;
      }

      // 2. Parallel Fetching
      const [allTasksRes, myTasksRes, projectsRes, pointsRes] =
        await Promise.all([
          // Total Tasks (Fetch minimal page to get total count)
          taskApi.getTasks(token, 1, 1),
          // My Tasks (Fetch more to calculate points)
          taskApi.getTasks(token, 1, 100, userId),
          // Projects
          projectApi.getAllProjects(token),
          // Points
          taskApi.getCurrentMonthPoints(token),
        ]);

      let totalTasks = 0;
      let myTasksCount = 0;
      let totalPoints = 0;
      let totalProjects = 0;

      if (allTasksRes.success) {
        totalTasks = allTasksRes.data.pagination.total;
      }

      if (myTasksRes.success) {
        myTasksCount = myTasksRes.data.pagination.total;
      }

      if (projectsRes.success && Array.isArray(projectsRes.data)) {
        totalProjects = projectsRes.data.length;
      }

      if (pointsRes && pointsRes.success) {
        totalPoints = pointsRes.data.points;
      }

      setStats({
        totalTasks,
        myTasksCount,
        totalPoints,
        totalProjects,
        recentActivity: [], // Logic for activity requires logs endpoint or inferred from tasks
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    isLoading,
    user,
    refreshDashboard: fetchData,
  };
}
