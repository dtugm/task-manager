"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, AlertCircle, Users, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useProjectMembers, Member, OrgUser } from "@/hooks/useProjectMembers";
import { MemberDialogs } from "@/components/project-management/MemberDialogs";
import { MembersTable } from "@/components/project-management/MembersTable";
import { MembersFilter } from "@/components/project-management/MembersFilter";

export default function ProjectMembersPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { t } = useLanguage();

  const {
    project,
    members,
    isLoading, // Initial loading state
    error,
    orgUsers,
    fetchOrgUsers,
    addMember,
    updateMemberRole,
    removeMember,
    isAddingMember,
    isUpdatingRole,
    isDeletingMember,
  } = useProjectMembers(projectId);

  // Filter State
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Add Member Local State
  const [searchQuery, setSearchQuery] = useState("");
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);
  const [newMemberId, setNewMemberId] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Employee");

  // Edit/Delete Selection State
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editRole, setEditRole] = useState("");
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Fetch org users when add dialog opens
  useEffect(() => {
    if (isAddOpen) {
      fetchOrgUsers();
    } else {
      setSearchQuery("");
      setNewMemberId("");
      setSelectedUser(null);
      setNewMemberRole("Employee");
      setOpenCombobox(false);
    }
  }, [isAddOpen, fetchOrgUsers]);

  const handleAddMember = async () => {
    if (!newMemberId) return;
    const success = await addMember(newMemberId, newMemberRole);
    if (success) setIsAddOpen(false);
  };

  const handleUpdateRole = async () => {
    if (!editingMember) return;
    const success = await updateMemberRole(editingMember, editRole);
    if (success) {
      setIsEditOpen(false);
      setEditingMember(null);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    const success = await removeMember(memberToDelete);
    if (success) {
      setIsDeleteOpen(false);
      setMemberToDelete(null);
    }
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setEditRole(member.role);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteOpen(true);
  };

  return (
    <div className="relative isolate space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in-50 duration-500 min-h-[calc(100vh-4rem)]">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob bg-purple-300 dark:bg-purple-900/30"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 bg-indigo-300 dark:bg-indigo-900/30"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 bg-pink-300 dark:bg-pink-900/30"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div
            className="flex items-center gap-2 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer w-fit group"
            onClick={() => router.back()}
          >
            <div className="p-1 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{t.backToProject}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 text-white">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                {project?.name || t.projectMgmt}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                <p>{t.projectManagementDesc}</p>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t.addMember}
        </Button>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Components */}
      <MembersFilter
        memberSearchQuery={memberSearchQuery}
        setMemberSearchQuery={setMemberSearchQuery}
        selectedRoleFilter={selectedRoleFilter}
        setSelectedRoleFilter={setSelectedRoleFilter}
        isRoleFilterOpen={isRoleFilterOpen}
        setIsRoleFilterOpen={setIsRoleFilterOpen}
      />

      <MembersTable
        members={members}
        isLoading={isLoading}
        selectedRoleFilter={selectedRoleFilter}
        memberSearchQuery={memberSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <MemberDialogs
        isAddOpen={isAddOpen}
        setIsAddOpen={setIsAddOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        orgUsers={orgUsers}
        onAddMember={handleAddMember}
        isAddingMember={isAddingMember}
        openCombobox={openCombobox}
        setOpenCombobox={setOpenCombobox}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setNewMemberId={setNewMemberId}
        newMemberRole={newMemberRole}
        setNewMemberRole={setNewMemberRole}
        editRole={editRole}
        setEditRole={setEditRole}
        onUpdateRole={handleUpdateRole}
        isUpdatingRole={isUpdatingRole}
        onDeleteMember={handleDeleteMember}
        isDeletingMember={isDeletingMember}
      />
    </div>
  );
}
