import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Member, OrgUser } from "@/hooks/useProjectMembers";
import { getPastelColor, getPastelTextColor } from "@/lib/utils";

interface MemberDialogsProps {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;

  // Add Member Props
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  orgUsers: OrgUser[];
  onAddMember: () => void;
  isAddingMember: boolean;
  openCombobox: boolean;
  setOpenCombobox: (open: boolean) => void;
  selectedUser: OrgUser | null;
  setSelectedUser: (user: OrgUser | null) => void;
  setNewMemberId: (id: string) => void;
  newMemberRole: string;
  setNewMemberRole: (role: string) => void;

  // Edit Props
  editRole: string;
  setEditRole: (role: string) => void;
  onUpdateRole: () => void;
  isUpdatingRole: boolean;

  // Delete Props
  onDeleteMember: () => void;
  isDeletingMember: boolean;
}

export function MemberDialogs({
  isAddOpen,
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  searchQuery,
  setSearchQuery,
  orgUsers,
  onAddMember,
  isAddingMember,
  openCombobox,
  setOpenCombobox,
  selectedUser,
  setSelectedUser,
  setNewMemberId,
  newMemberRole,
  setNewMemberRole,
  editRole,
  setEditRole,
  onUpdateRole,
  isUpdatingRole,
  onDeleteMember,
  isDeletingMember,
}: MemberDialogsProps) {
  const { t } = useLanguage();

  return (
    <>
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="overflow-visible sm:max-w-md rounded-2xl border-0 shadow-2xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader className="pb-4 border-b dark:border-slate-800">
            <DialogTitle className="text-xl dark:text-slate-100">
              {t.addMember}
            </DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              {t.searchUserHelp}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-200">{t.user}</Label>
              <Input
                placeholder={t.typeToSearchUsers}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenCombobox(true);
                }}
                onFocus={() => setOpenCombobox(true)}
                className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 focus-visible:ring-indigo-500"
              />
              {openCombobox && orgUsers.length > 0 && (
                <div className="absolute z-50 w-[calc(100%-3rem)] mt-1 ml-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl max-h-[300px] overflow-auto p-1 text-slate-900 dark:text-slate-100">
                  {orgUsers
                    .filter(
                      (u) =>
                        u.fullName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        u.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map((user) => {
                      const bgColor = getPastelColor(user.fullName);
                      const textColor = getPastelTextColor(user.fullName);

                      return (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-lg transition-colors group"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewMemberId(user.id);
                            setSearchQuery(user.fullName);
                            setOpenCombobox(false);
                          }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                                user.fullName
                              }&backgroundColor=${bgColor.replace("#", "")}`}
                            />
                            <AvatarFallback
                              style={{
                                backgroundColor: bgColor,
                                color: textColor,
                              }}
                            >
                              {user.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                              {user.fullName}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="dark:text-slate-200">{t.role}</Label>
              <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 focus:ring-indigo-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl dark:bg-slate-900 z-50">
                  <SelectItem value="Executive">Executive</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              className="rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              onClick={onAddMember}
              disabled={!selectedUser || isAddingMember}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50"
            >
              {isAddingMember ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                t.addMember
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader className="pb-4 border-b dark:border-slate-800">
            <DialogTitle className="text-xl dark:text-slate-100">
              {t.editRole}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-200">{t.role}</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 focus:ring-indigo-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl dark:bg-slate-900 z-50">
                  <SelectItem value="Executive">Executive</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="rounded-xl dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              onClick={onUpdateRole}
              disabled={isUpdatingRole}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              {isUpdatingRole ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Update Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-2xl dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <div className="mx-auto p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 mb-4 w-fit">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-center text-xl dark:text-slate-100">
              {t.removeMemberConfirmTitle}
            </DialogTitle>
            <DialogDescription className="text-center dark:text-slate-400 pt-2">
              {t.removeMemberConfirmDesc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl w-full sm:w-auto dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteMember}
              disabled={isDeletingMember}
              className="rounded-xl w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {isDeletingMember ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                t.removeMember
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
