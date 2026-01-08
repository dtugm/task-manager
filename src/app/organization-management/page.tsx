"use client";

import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import { organizationApi } from "@/lib/organization-api";
import { OrganizationWithRole, OrganizationUser } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Building2,
  UserPlus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { CreateOrganizationDialog } from "@/components/organization/CreateOrganizationDialog";
import { OrganizationUsersList } from "@/components/organization/OrganizationUsersList";
import { AddUserDialog } from "@/components/organization/AddUserDialog";
import { EditUserRoleDialog } from "@/components/organization/EditUserRoleDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrganizationManagementPage() {
  const { t } = useLanguage();
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // Selected Org for details
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [orgUsers, setOrgUsers] = useState<OrganizationUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Filters
  const [roleFilter, setRoleFilter] = useState("All"); // All, Executive, Manager, Supervisor, Employee, Unassigned
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);

  // Action Targets
  const [userToDelete, setUserToDelete] = useState<OrganizationUser | null>(
    null
  );
  const [userToEdit, setUserToEdit] = useState<OrganizationUser | null>(null);

  // Fetch Orgs
  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const match = document.cookie.match(
        new RegExp("(^| )accessToken=([^;]+)")
      );
      const token = match ? match[2] : null;
      if (!token) return;

      const response = await organizationApi.getAllOrganizations(token);
      if (response.success && response.data) {
        setOrganizations(response.data);
        // If no selected org, select the first one or active one
        if (!selectedOrgId && response.data.length > 0) {
          const active = response.data.find((o) => o.isActive);
          setSelectedOrgId(
            active ? active.organization.id : response.data[0].organization.id
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch organizations", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch Users when Selected Org Changes
  useEffect(() => {
    if (selectedOrgId) {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchOrgUsers(selectedOrgId, 1);
    } else {
      setOrgUsers([]);
    }
  }, [selectedOrgId]);

  const fetchOrgUsers = async (
    orgId: string,
    page: number = 1,
    limit: number = pagination.limit
  ) => {
    setIsUsersLoading(true);
    try {
      const match = document.cookie.match(
        new RegExp("(^| )accessToken=([^;]+)")
      );
      const token = match ? match[2] : null;
      if (!token) return;

      const response = await organizationApi.getOrganizationUsers(
        token,
        orgId,
        page,
        limit
      );
      if (response.success && response.data) {
        setOrgUsers(response.data.users);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && selectedOrgId) {
      fetchOrgUsers(selectedOrgId, newPage);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    let result = orgUsers;

    // 1. Role Filter
    if (roleFilter !== "All") {
      if (roleFilter === "Unassigned") {
        result = result.filter((u) => !u.role || u.role === "Unassigned");
      } else {
        result = result.filter((u) => u.role === roleFilter);
      }
    }

    // 2. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.user.fullName?.toLowerCase().includes(query) ||
          u.user.username.toLowerCase().includes(query) ||
          u.user.email.toLowerCase().includes(query)
      );
    }

    return result;
  }, [orgUsers, roleFilter, searchQuery]);

  // Remove User
  const handleRemoveUser = async () => {
    if (!userToDelete || !selectedOrgId) return;
    try {
      const match = document.cookie.match(
        new RegExp("(^| )accessToken=([^;]+)")
      );
      const token = match ? match[2] : null;
      if (!token) return;

      await organizationApi.removeOrganizationUser(
        token,
        selectedOrgId,
        userToDelete.user.id
      );
      setOrgUsers((prev) =>
        prev.filter((u) => u.user.id !== userToDelete.user.id)
      );
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to remove user", error);
    }
  };

  const handleEditRole = (userId: string, currentRole: string) => {
    const user = orgUsers.find((u) => u.user.id === userId);
    if (user) {
      setUserToEdit(user);
      setIsEditRoleOpen(true);
    }
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob bg-purple-500/30 dark:bg-purple-500/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-blue-500/30 dark:bg-blue-500/20"></div>
      </div>

      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300">
              {t.organizationMgmt}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t.createOrgDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Organization Selector */}
            <div className="w-full sm:w-[250px]">
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-white/20 h-10 rounded-xl transition-all hover:bg-white/60 dark:hover:bg-slate-900/60 focus:ring-2 focus:ring-purple-500/20">
                  <SelectValue placeholder="Select Organization" />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-xl rounded-xl">
                  {organizations.map((org) => (
                    <SelectItem
                      key={org.organization.id}
                      value={org.organization.id}
                      className="cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20"
                    >
                      {org.organization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setIsCreateOpen(true)}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 rounded-xl h-10"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t.createOrganization}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {!selectedOrgId ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              No Organization Selected
            </h3>
            <p className="text-slate-500 max-w-sm mt-2">
              Select an organization from the dropdown above to manage its
              users, or create a new one.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                {/* Role Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    Filter Role:
                  </span>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[140px] bg-white/60 dark:bg-slate-800/60 border-none h-9 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                      <SelectItem value="All">All Roles</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-[250px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search member..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/60 dark:bg-slate-800/60 border-none h-9 rounded-lg focus-visible:ring-1 focus-visible:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddUserOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-xl h-9 whitespace-nowrap"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t.addUser}
                </Button>
              </div>
            </div>

            {/* Users Table */}
            {isUsersLoading ? (
              <div className="flex justify-center p-12 ">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <OrganizationUsersList
                  users={filteredUsers}
                  onRemoveUser={(userId) => {
                    const user = orgUsers.find((u) => u.user.id === userId);
                    if (user) setUserToDelete(user);
                  }}
                  onChangeRole={handleEditRole}
                />

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>{t.rowsPerPage}</span>
                    <Select
                      value={String(pagination.limit)}
                      onValueChange={(value) => {
                        const newLimit = Number(value);
                        setPagination((prev) => ({
                          ...prev,
                          limit: newLimit,
                          page: 1,
                        }));
                        if (selectedOrgId)
                          fetchOrgUsers(selectedOrgId, 1, newLimit);
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px] bg-white/50 dark:bg-slate-900/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {pagination.totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="h-8 w-8 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {/* Numbered Pagination */}
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      )
                        .filter(
                          (p) =>
                            p === 1 ||
                            p === pagination.totalPages ||
                            Math.abs(p - pagination.page) <= 1
                        )
                        .map((p, i, arr) => {
                          // Add ellipses
                          const prev = arr[i - 1];
                          const showEllipsis = prev && p - prev > 1;

                          return (
                            <div key={p} className="flex items-center">
                              {showEllipsis && (
                                <span className="px-2 text-slate-400">...</span>
                              )}
                              <Button
                                variant={
                                  pagination.page === p ? "default" : "outline"
                                }
                                size="icon"
                                onClick={() => handlePageChange(p)}
                                className={`h-8 w-8 rounded-lg ${
                                  pagination.page === p
                                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                                    : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                }`}
                              >
                                {p}
                              </Button>
                            </div>
                          );
                        })}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="h-8 w-8 rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <CreateOrganizationDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={fetchOrganizations}
      />

      {selectedOrgId && (
        <AddUserDialog
          open={isAddUserOpen}
          onOpenChange={setIsAddUserOpen}
          orgId={selectedOrgId}
          onSuccess={() => fetchOrgUsers(selectedOrgId, pagination.page)}
        />
      )}

      {selectedOrgId && userToEdit && (
        <EditUserRoleDialog
          open={isEditRoleOpen}
          onOpenChange={setIsEditRoleOpen}
          orgId={selectedOrgId}
          userId={userToEdit.user.id}
          currentRole={userToEdit.role}
          onSuccess={() => fetchOrgUsers(selectedOrgId, pagination.page)}
        />
      )}

      {/* Remove User Confirmation */}
      <Dialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.removeMemberConfirmTitle}</DialogTitle>
            <DialogDescription>
              {t.removeMemberConfirmDesc}
              {userToDelete && (
                <span className="font-semibold block mt-2">
                  {userToDelete.user.fullName || userToDelete.user.username}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserToDelete(null)}
              className="rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveUser}
              className="rounded-xl"
            >
              {t.removeMember}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
