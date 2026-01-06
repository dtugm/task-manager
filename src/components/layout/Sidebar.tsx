"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useUserRole } from "@/hooks/useUserRole";
import { getNavigation, roleAccess } from "./sidebar-config";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const rawNavigation = getNavigation(t);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const userRole = useUserRole();

  const isExpanded = !isCollapsed || isHovered;

  const navigation = rawNavigation.filter((item) => {
    if (item.href === "/") return true;
    if (!userRole) return false;
    if (userRole === "Super Admin") return true;
    const allowedRoutes = roleAccess[userRole] || [];
    return allowedRoutes.includes(item.href);
  });

  return (
    <div
      className={cn(
        "h-[calc(100vh-2rem)] my-4 ml-4 rounded-3xl border bg-sidebar shadow-xl md:flex hidden flex-col transition-all duration-500 ease-out relative z-50",
        isExpanded ? "w-72" : "w-20",
        className
      )}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -right-3 top-8 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full shadow-lg bg-background border-none hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            setIsHovered(false);
          }}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-4 py-8 w-full flex flex-col h-full">
        <div className="px-4">
          <div
            className={cn(
              "flex items-center gap-3 mb-10 px-2 transition-all duration-500",
              !isExpanded && "justify-center"
            )}
          >
            <div className="w-10 h-10 min-w-[40px] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/30">
              GA
            </div>
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 flex flex-col justify-center",
                isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
              )}
            >
              <h2 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
                Geo AIT
              </h2>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {userRole || "Task Manager"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div className="relative group">
                    {isActive && (
                      <div
                        className={cn(
                          "absolute inset-0 bg-primary/10 rounded-2xl transition-all duration-300",
                          !isExpanded ? "w-12 mx-auto" : "w-full"
                        )}
                      />
                    )}

                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-4 relative overflow-hidden transition-all duration-300 py-6 hover:bg-transparent z-10",
                        isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted/50 rounded-2xl",
                        !isExpanded && "justify-center px-0"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all duration-300",
                          isActive && "scale-110 drop-shadow-sm",
                          !isExpanded && "h-6 w-6"
                        )}
                      />
                      <span
                        className={cn(
                          "whitespace-nowrap transition-all duration-500 text-sm font-medium",
                          isExpanded
                            ? "opacity-100 ml-1 translate-x-0"
                            : "opacity-0 w-0 hidden -translate-x-4"
                        )}
                      >
                        {item.name}
                      </span>
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const rawNavigation = getNavigation(t);
  const [open, setOpen] = useState(false);
  const userRole = useUserRole();

  const navigation = rawNavigation.filter((item) => {
    if (item.href === "/") return true;
    if (!userRole) return false;
    if (userRole === "Super Admin") return true;
    const allowedRoutes = roleAccess[userRole] || [];
    return allowedRoutes.includes(item.href);
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <div className="space-y-4 py-4 h-full bg-sidebar">
          <div className="px-3 py-2">
            <h2 className="mb-6 px-4 text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                G
              </div>
              Geo AIT
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
