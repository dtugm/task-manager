"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./Sidebar";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authApi } from "@/lib/auth-api";
import { UserContext } from "@/types/auth";
import { clearTokens } from "@/lib/token-utils";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function Header() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [userData, setUserData] = useState<UserContext | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Try to get from localStorage first
      const cachedData = localStorage.getItem("user_data");
      if (cachedData) {
        try {
          setUserData(JSON.parse(cachedData));
        } catch (e) {
          console.error("Failed to parse cached user data", e);
        }
      }

      // Basic cookie parsing
      const match = document.cookie.match(
        new RegExp("(^| )accessToken=([^;]+)")
      );
      const token = match ? match[2] : null;

      if (!token) return;

      // If we have cached data, we might skip fetching, or fetch in background to update
      // For this request, we'll fetch only if no cached data or maybe just once to ensure freshness?
      // User said "fetched once when we login... so all needs to get current user can get from it without fetching again"
      // So if cachedData exists, we return.
      if (cachedData) return;

      try {
        const response = await authApi.getMe(token);
        if (response.success) {
          setUserData(response.data);
          localStorage.setItem("user_data", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch user data for header", error);
      }
    };

    fetchUser();
  }, []);

  const userInitials = userData?.user?.fullName
    ? userData.user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  const userRole = userData?.organizations?.[0]?.role || "User";

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4">
      <div className="flex items-center gap-4">
        <MobileSidebar />

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted text-muted-foreground"
            onClick={() => setLanguage(language === "en" ? "id" : "en")}
          >
            <div className="flex items-center justify-center font-bold text-[10px] h-6 w-6 border-2 border-current rounded-full">
              {language.toUpperCase()}
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted text-muted-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 pl-2 ml-2 hover:bg-muted/50 p-2 h-auto rounded-full"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold leading-none">
                    {userData?.user?.fullName || "Loading..."}
                  </p>
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-md">
                  <AvatarImage src="/avatars/john-doe.png" />
                  <AvatarFallback className="bg-gradient-to-tr from-violet-500 to-indigo-500 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => (window.location.href = "/settings")}
                className="cursor-pointer"
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => {
                  clearTokens();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
