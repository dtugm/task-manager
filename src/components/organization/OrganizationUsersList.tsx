"use client";

import { useState } from "react";
import { OrganizationUser } from "@/types/organization";
import { useLanguage } from "@/contexts/language-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Trash2, UserCog, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPastelColor } from "@/lib/utils";

interface OrganizationUsersListProps {
  users: OrganizationUser[];
  onRemoveUser: (userId: string) => void;
  onChangeRole: (userId: string, currentRole: string) => void;
}

export function OrganizationUsersList({
  users,
  onRemoveUser,
  onChangeRole,
}: OrganizationUsersListProps) {
  const { t } = useLanguage();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="rounded-xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden px-2">
      <Table>
        <TableHeader className="bg-white/50 dark:bg-slate-900/50 ">
          <TableRow>
            <TableHead>{t.user}</TableHead>
            <TableHead>{t.role}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead className="w-[80px] text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {t.noMembersFound}
              </TableCell>
            </TableRow>
          ) : (
            users.map((member) => (
              <TableRow
                key={member.id}
                className="hover:bg-white/30 dark:hover:bg-slate-800/30"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800">
                      <AvatarFallback
                        style={{
                          backgroundColor: getPastelColor(member.user.username),
                        }}
                        className="text-slate-700 font-medium text-xs"
                      >
                        {getInitials(
                          member.user.fullName || member.user.username
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {member.user.fullName || member.user.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-slate-100/50 dark:bg-slate-800/50 rounded-md font-normal"
                  >
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        member.isActive ? "bg-green-500" : "bg-slate-300"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {member.isActive ? t.isActive : t.pending}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onChangeRole(member.user.id, member.role)
                        }
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        {t.changeRole}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onRemoveUser(member.user.id)}
                        className="text-red-500 focus:text-red-600"
                      >
                        <UserMinus className="mr-2 h-4 w-4" />
                        {t.removeMember}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
