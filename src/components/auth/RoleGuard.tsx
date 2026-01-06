"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { roleAccess } from "@/components/layout/sidebar-config";
import { Loader2 } from "lucide-react";

const PUBLIC_PATHS = ["/login", "/signup", "/auth/signin", "/auth/signup"];

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role: userRole, isLoading } = useUserRole();

  useEffect(() => {
    if (isLoading) return;

    // 1. Allow public paths
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
      return;
    }

    // 2. If no role (not logged in), redirect to login
    if (!userRole) {
      router.push("/login");
      return;
    }

    // 3. Super Admin has full access
    if (userRole === "Super Admin") {
      return;
    }

    // 4. Dashboard (/) is always allowed for logged-in users
    if (pathname === "/") {
      return;
    }

    // 5. Check Role-Based Access
    const allowedRoutes = roleAccess[userRole] || [];

    // Check if current path matches any allowed route (exact or sub-path)
    const isAllowed = allowedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!isAllowed) {
      console.warn(
        `User (${userRole}) attempted to access unauthorized path: ${pathname}`
      );
      router.push("/"); // Redirect to dashboard
    }
  }, [userRole, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Optional: Don't render children until we're sure (prevents flash of content)
  // However, useEffect runs after render.
  // Ideally, if redirecting, we return null.

  if (
    !isLoading &&
    !userRole &&
    !PUBLIC_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return null;
  }

  // Logic check again for rendering to avoid flash
  if (
    !isLoading &&
    userRole &&
    userRole !== "Super Admin" &&
    pathname !== "/"
  ) {
    const allowedRoutes = roleAccess[userRole] || [];
    const isAllowed = allowedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    if (!isAllowed) return null;
  }

  return <>{children}</>;
}
