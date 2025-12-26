"use client";

import { Bell, Search, Globe, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileSidebar } from "./Sidebar";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/language-context";

export function Header() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4">
      <div className="flex items-center gap-4">
        <MobileSidebar />

        {/* Search Bar - styled as a pill */}
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, projects..."
            className="pl-10 rounded-full bg-muted/50 border-transparent focus:bg-background transition-all duration-300"
          />
        </div>

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

          <div className="flex items-center gap-3 pl-2 ml-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold leading-none">John Doe</p>
              <p className="text-xs text-muted-foreground">Product Designer</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-md">
              <AvatarImage src="/avatars/john-doe.png" />
              <AvatarFallback className="bg-gradient-to-tr from-violet-500 to-indigo-500 text-white">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
