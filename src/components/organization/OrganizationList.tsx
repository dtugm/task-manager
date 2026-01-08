"use client";

import { OrganizationWithRole } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  CheckCircle2,
  Users,
  Building2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface OrganizationListProps {
  organizations: OrganizationWithRole[];
  isLoading: boolean;
  onSetActive: (orgId: string) => void;
  onDelete: (orgId: string) => void;
  onManageUsers: (org: OrganizationWithRole) => void;
  activeOrgId?: string;
}

export function OrganizationList({
  organizations,
  isLoading,
  onSetActive,
  onDelete,
  onManageUsers,
}: OrganizationListProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-white/20 dark:bg-slate-800/20 animate-pulse backdrop-blur-sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {organizations.map((item) => (
        <Card
          key={item.organization.id}
          className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-white/20",
            "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md",
            item.isActive && "ring-2 ring-primary/50 shadow-primary/10"
          )}
        >
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onSetActive(item.organization.id)}
                  disabled={item.isActive}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  {t.setActive}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManageUsers(item)}>
                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                  {t.manageUsers}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(item.organization.id)}
                  className="text-red-500 hover:text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t.deleteOrganization}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
              {item.isActive && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  {t.isActive}
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-bold mb-1 truncate text-slate-800 dark:text-slate-100">
              {item.organization.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-slate-800/50 inline-block px-2 py-1 rounded-md">
              {item.role}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex gap-2">
               <Button 
                variant="outline" 
                size="sm" 
                className="w-full rounded-xl"
                onClick={() => onManageUsers(item)}
               >
                 {t.manageUsers}
               </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
