"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  scheduleTokenRefresh,
  clearTokens,
  getAccessToken,
} from "@/lib/token-utils";

export function TokenRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Don't run on login page
    if (pathname === "/login" || pathname === "/signup") {
      return;
    }

    // Check if user has a token
    const token = getAccessToken();
    if (!token) {
      return;
    }

    // Handle refresh failure by redirecting to login
    const handleRefreshFailure = () => {
      console.error("Token refresh failed, redirecting to login");
      clearTokens();
      router.push("/login");
    };

    // Schedule automatic token refresh
    cleanupRef.current = scheduleTokenRefresh(handleRefreshFailure);

    // Cleanup on unmount
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [pathname, router]);

  return <>{children}</>;
}
