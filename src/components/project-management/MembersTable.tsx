import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed invalid Pination import
import { Users, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/language-context";
import { Member } from "@/hooks/useProjectMembers";
import { cn, getPastelColor, getPastelTextColor } from "@/lib/utils";

interface MembersTableProps {
  members: Member[];
  isLoading: boolean;
  selectedRoleFilter: string;
  memberSearchQuery: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export function MembersTable({
  members,
  isLoading,
  selectedRoleFilter,
  memberSearchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  onEdit,
  onDelete,
}: MembersTableProps) {
  const { t } = useLanguage();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Executive":
        return "bg-indigo-100/80 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800";
      case "Manager":
        return "bg-purple-100/80 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800";
      case "Supervisor":
        return "bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-slate-100/80 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const filteredMembers = members.filter((member) => {
    if (selectedRoleFilter !== "All" && member.role !== selectedRoleFilter) {
      return false;
    }

    if (!memberSearchQuery) return true;

    const query = memberSearchQuery.toLowerCase().trim();
    // Safe access to user properties
    const fullName = member.user?.fullName || "";
    const userId = member.userId || "";
    const id = member.id || "";
    const email = member.user?.email || "";

    const nameMatch =
      fullName.toLowerCase().includes(query) ||
      userId.toLowerCase().includes(query) ||
      id.toLowerCase().includes(query);
    const emailMatch = email.toLowerCase().includes(query);

    return nameMatch || emailMatch;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  // Reset to page 1 if search changes (handled in effect or just safe slice)
  // Ensure start index is valid
  const safeCurrentPage =
    Math.min(Math.max(1, currentPage), Math.max(1, totalPages)) || 1;

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  return (
    <Card className="border-0 shadow-xl shadow-slate-200/40 dark:shadow-black/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden rounded-2xl ring-1 ring-white/50 dark:ring-white/5">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur text-xs uppercase tracking-wider">
            <TableRow className="hover:bg-transparent border-b border-slate-200/60 dark:border-slate-800/60">
              <TableHead className="pl-6 py-5 font-semibold text-slate-600 dark:text-slate-300">
                {t.member || "Member"}
              </TableHead>
              <TableHead className="py-5 font-semibold text-slate-600 dark:text-slate-300">
                {t.role || "Role"}
              </TableHead>
              <TableHead className="py-5 font-semibold text-slate-600 dark:text-slate-300 text-right pr-6">
                {t.actions || "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {t.noMembersFound}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {t.tryAdjustingFilters}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {paginatedMembers.map((member) => {
              const displayName =
                member.user?.fullName || member.userId || member.id;
              const displayInitial = member.user?.fullName?.charAt(0) || "U";
              const bgColor = getPastelColor(displayName);
              const textColor = getPastelTextColor(displayName);

              return (
                <TableRow
                  key={member.id}
                  className="group hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-11 w-11 ring-4 ring-white dark:ring-slate-900 shadow-sm transition-transform group-hover:scale-105 duration-300">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}&backgroundColor=${bgColor.replace(
                              "#",
                              ""
                            )}`}
                          />
                          <AvatarFallback
                            style={{
                              backgroundColor: bgColor,
                              color: textColor,
                            }}
                            className="font-semibold"
                          >
                            {displayInitial.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"
                          title="Active"
                        ></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                          {displayName}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          {member.user?.email || t.unknown}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-lg shadow-sm backdrop-blur-sm",
                        getRoleBadgeColor(member.role)
                      )}
                    >
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(member)}
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(member)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span>{t.rowsPerPage || "Rows per page"}</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(val) => {
                setItemsPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-slate-800 z-50">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Previous</span>
              &lt;
            </Button>

            {(() => {
              // totalPages is already calculated
              const maxVisiblePages = 5;
              let startPage = Math.max(
                1,
                safeCurrentPage - Math.floor(maxVisiblePages / 2)
              );
              let endPage = Math.min(
                totalPages,
                startPage + maxVisiblePages - 1
              );

              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }
              // Adjust startPage again if needed after endPage cap? No, safe logic.
              startPage = Math.max(1, startPage); // ensure not negative

              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }

              return pages.map((page) => (
                <Button
                  key={page}
                  variant={safeCurrentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 w-8 p-0",
                    safeCurrentPage === page
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {page}
                </Button>
              ));
            })()}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Next</span>
              &gt;
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
