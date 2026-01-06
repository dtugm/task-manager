"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <main className="h-screen w-full bg-background">{children}</main>;
  }

  return (
    <div className="flex h-screen bg-muted/20 text-foreground overflow-hidden">
      {/* Sidebar is self-contained with margins */}
      <Sidebar className="flex-shrink-0" />

      {/* Main Content Area - rounded corners to match the floating theme */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden m-4 ml-0 rounded-2xl bg-background shadow-sm border border-border/50 relative">
        <Header />
        <main className="flex-1 overflow-auto p-6 md:p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
