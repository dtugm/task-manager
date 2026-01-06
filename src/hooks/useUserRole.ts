"use client";

import { useState, useEffect } from "react";

// Helper: Normalize role string (e.g. "manager" -> "Manager", "SUPER_ADMIN" -> "Super Admin")
export function normalizeRole(role: string): string {
  if (!role) return "";

  // Handle specific cases if API returns caps/snake_case
  if (
    role.toUpperCase() === "SUPER_ADMIN" ||
    role.toUpperCase() === "SUPER ADMIN"
  ) {
    return "Super Admin";
  }

  // Capitalize first letter, rest lowercase
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      // 1. Try explicit role key set by login page
      const explicitRole = localStorage.getItem("user_role");
      if (explicitRole) {
        setRole(normalizeRole(explicitRole));
        return;
      }

      // 2. Fallback to parsing user_data
      const storedUserStr = localStorage.getItem("user_data");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        // Handle nested user structure or flat structure
        // Also check organizations array if parsing raw response
        let rawRole =
          storedUser.user?.role ||
          storedUser.role ||
          storedUser.data?.role ||
          storedUser.organizations?.[0]?.role || // Check inside organizations array
          storedUser.data?.organizations?.[0]?.role;

        if (rawRole) {
          setRole(normalizeRole(rawRole));
        }
      }
    } catch (e) {
      console.error("Failed to parse user role", e);
    }
  }, []);

  return role;
}
