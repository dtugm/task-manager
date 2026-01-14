"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { pathAccessApi } from "@/lib/path-access-api";
import { Loader2 } from "lucide-react";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/auth/signin",
  "/auth/signup",
  "/settings",
];

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role: userRole, isLoading: isRoleLoading } = useUserRole();
  const [allowedPaths, setAllowedPaths] = useState<string[] | null>(null);
  const [isAccessLoading, setIsAccessLoading] = useState(false);

  // Helper to get token
  const getAuthToken = () => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const fetchAccess = async () => {
      const token = getAuthToken();
      if (!token || !userRole) return;

      setIsAccessLoading(true);
      try {
        const resp = await pathAccessApi.getMe(token);
        if (resp.success) {
          setAllowedPaths(resp.data);
        }
      } catch (e) {
        console.error("Failed to fetch path access", e);
      } finally {
        setIsAccessLoading(false);
      }
    };

    if (userRole && userRole !== "Super Admin") {
      fetchAccess();
    }
  }, [userRole]);

  useEffect(() => {
    // 1. Loading States
    if (isRoleLoading) return;

    // 2. Public Paths - Always Allowed
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
      return;
    }

    // 3. Not Logged In - Redirect
    if (!userRole) {
      router.push("/login");
      return;
    }

    // 4. Waiting for Access Data (if needed)
    if (userRole !== "Super Admin" && allowedPaths === null) {
      // If we haven't started fetching yet or are fetching
      if (!isAccessLoading) setIsAccessLoading(true); // Trigger fetch effect if mostly
      return;
    }

    // 5. Unassigned Role Restriction
    if (userRole === "Unassigned") {
      if (pathname !== "/waiting-approval") {
        router.replace("/waiting-approval");
      }
      return;
    }

    // 6. Super Admin - Full Access
    if (userRole === "Super Admin") {
      return;
    }

    // 7. Dashboard - Always Allowed
    if (pathname === "/") {
      return;
    }

    // 8. Dynamic Access Check
    // Wait for paths to be loaded
    if (isAccessLoading || allowedPaths === null) return;

    const isAllowed = allowedPaths.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!isAllowed) {
      console.warn(
        `User (${userRole}) attempted to access unauthorized path: ${pathname}`
      );
      router.push("/");
    }
  }, [
    userRole,
    isRoleLoading,
    isAccessLoading,
    allowedPaths,
    pathname,
    router,
  ]);

  const isLoading =
    isRoleLoading ||
    (userRole && userRole !== "Super Admin" && isAccessLoading) ||
    (userRole && userRole !== "Super Admin" && allowedPaths === null);

  // Render logic
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return <>{children}</>;
  }

  // Show loader while checking everything
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Once loaded, if no role, we would have redirected, but return null to be safe
  if (!userRole) return null;

  // Unassigned check for render
  if (userRole === "Unassigned" && pathname !== "/waiting-approval")
    return null;

  // Super Admin / Dashboard - Render
  if (userRole === "Super Admin" || pathname === "/") return <>{children}</>;

  // Final Allowed Check for Render to prevent flash of content
  const isAllowed = allowedPaths?.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isAllowed) return null;

  return <>{children}</>;
}
