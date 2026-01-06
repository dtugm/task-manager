"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { projectApi } from "@/lib/project-api";
import { authApi } from "@/lib/auth-api";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

// Define a type for the member based on expected API response
interface Member {
  id: string; // mapping id or user id
  userId: string;
  role: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface OrgUser {
  id: string;
  fullName: string;
  email: string;
}

const ORGANIZATION_ID =
  process.env.NEXT_PUBLIC_ORGANIZATION_ID || "KELGsLB6canc9jAX7035G"; // Hardcoded as requested

export default function ProjectMembersPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Member State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Employee");
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Combobox State
  const [openCombobox, setOpenCombobox] = useState(false);
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Member Search State
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Edit Role State
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editRole, setEditRole] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Delete Confirmation
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch Project Details
      const projRes = await projectApi.getProjectById(token, projectId);
      if (projRes.success) {
        setProject(projRes.data);
      } else {
        setError(projRes.error?.message || "Failed to fetch project");
      }

      // Fetch Members
      const memRes = await projectApi.getProjectUsers(token, projectId);
      if (memRes.success) {
        // Check structure and map user.id to userId
        const data = memRes.data;
        let rawMembers: any[] = [];

        if (Array.isArray(data)) {
          rawMembers = data;
        } else if (data.data && Array.isArray(data.data)) {
          rawMembers = data.data;
        } else if (data.users && Array.isArray(data.users)) {
          rawMembers = data.users;
        }

        // Map the data to ensure userId is extracted from user.id
        const mappedMembers = rawMembers.map((member: any) => ({
          ...member,
          userId: member.user?.id || member.userId || member.id,
        }));

        setMembers(mappedMembers);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrgUsers = async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) return;

    try {
      // Fetch logic for org users
      const response = await authApi.getOrganizationUsers(
        token,
        ORGANIZATION_ID,
        1,
        50
      ); // Fetch top 50

      let rawData: any = response;
      // If it's wrapped in ApiResponse structure
      if (response && (response as any).success && (response as any).data) {
        rawData = (response as any).data;
      }

      const mappedUsers: OrgUser[] = [];
      let usersSource: any[] = [];

      if (Array.isArray(rawData)) {
        usersSource = rawData;
      } else if (rawData && Array.isArray(rawData.data)) {
        usersSource = rawData.data;
      } else if (rawData && Array.isArray(rawData.users)) {
        usersSource = rawData.users;
      }

      usersSource.forEach((item: any) => {
        // Handle if item contains nested user object (as per screenshot)
        if (item.user && item.user.id) {
          mappedUsers.push({
            id: item.user.id,
            fullName: item.user.fullName || item.user.username || "Unknown",
            email: item.user.email,
          });
        }
        // Handle if item is the user object itself
        else if (item.id && (item.fullName || item.username)) {
          mappedUsers.push({
            id: item.id,
            fullName: item.fullName || item.username || "Unknown",
            email: item.email,
          });
        }
      });

      setOrgUsers(mappedUsers);
    } catch (err) {
      console.error("Failed to fetch org users", err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  // Fetch users when add dialog opens and reset form when it closes
  useEffect(() => {
    if (isAddOpen) {
      fetchOrgUsers();
    } else {
      // Reset form when dialog closes
      setSearchQuery("");
      setNewMemberId("");
      setSelectedUser(null);
      setNewMemberRole("Employee");
      setOpenCombobox(false);
    }
  }, [isAddOpen]);

  const handleAddMember = async () => {
    if (!newMemberId) return;

    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsAddingMember(true);
    try {
      const response = await projectApi.addProjectUser(token, projectId, {
        userId: newMemberId,
        role: newMemberRole,
      });

      if (response.success) {
        await fetchData();
        setIsAddOpen(false);
        setNewMemberId("");
        setSelectedUser(null);
        setNewMemberRole("Employee");
        setSearchQuery("");
        setOpenCombobox(false);
      } else {
        setError(response.error?.message || "Failed to add member");
      }
    } catch (err: any) {
      setError(err.message || "Failed to add member");
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingMember) return;

    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsUpdatingRole(true);
    try {
      const response = await projectApi.updateProjectUserRole(
        token,
        projectId,
        editingMember.userId || editingMember.id,
        { role: editRole }
      );

      if (response.success) {
        setMembers(
          members.map((m) =>
            m.id === editingMember.id ? { ...m, role: editRole } : m
          )
        );
        setIsEditOpen(false);
        setEditingMember(null);
      } else {
        setError(response.error?.message || "Failed to update role");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update role");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    setIsDeletingMember(true);
    try {
      // Use userId field from member object
      const userIdToDelete = memberToDelete.userId;

      console.log("Deleting member:", {
        projectId,
        userId: userIdToDelete,
        memberData: memberToDelete,
      });

      const response = await projectApi.removeProjectUser(
        token,
        projectId,
        userIdToDelete
      );

      console.log("Delete response:", response);

      // Handle success:
      // - response.success === true
      // - Empty object {} (from 204 No Content)
      // - null/undefined
      const isEmptyObject =
        response &&
        typeof response === "object" &&
        Object.keys(response).length === 0;
      const isSuccess = !response || response.success === true || isEmptyObject;

      if (isSuccess) {
        setMembers(members.filter((m) => m.id !== memberToDelete.id));
        setIsDeleteOpen(false);
        setMemberToDelete(null);
        setError(null);
      } else {
        setError(response.error?.message || "Failed to remove member");
      }
    } catch (err: any) {
      console.error("Delete member error:", err);
      setError(err.message || "Failed to remove member");
    } finally {
      setIsDeletingMember(false);
    }
  };

  const openEditRole = (member: Member) => {
    setEditingMember(member);
    setEditRole(member.role);
    setIsEditOpen(true);
  };

  const openDeleteConfirm = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {project?.name || "Project Members"}
          </h2>
          <p className="text-muted-foreground">
            Manage members and their roles.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Input
            placeholder="Search members..."
            value={memberSearchQuery}
            onChange={(e) => setMemberSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0 mx-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID / Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              )}
              {(() => {
                const filteredMembers = members.filter((member) => {
                  if (!memberSearchQuery) return true;
                  const query = memberSearchQuery.toLowerCase();
                  const name = (
                    member.user?.fullName ||
                    member.userId ||
                    member.id
                  ).toLowerCase();
                  return name.includes(query);
                });

                const totalPages = Math.ceil(
                  filteredMembers.length / itemsPerPage
                );
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedMembers = filteredMembers.slice(
                  startIndex,
                  endIndex
                );

                return paginatedMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.user?.fullName || member.userId || member.id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditRole(member)}
                        >
                          Edit Role
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteConfirm(member)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Items per page:
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {(() => {
                const filteredCount = members.filter((member) => {
                  if (!memberSearchQuery) return true;
                  const query = memberSearchQuery.toLowerCase();
                  const name = (
                    member.user?.fullName ||
                    member.userId ||
                    member.id
                  ).toLowerCase();
                  return name.includes(query);
                }).length;
                const totalPages = Math.ceil(filteredCount / itemsPerPage);

                return (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage >= totalPages}
                      >
                        Last
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent
          className="overflow-visible"
          onInteractOutside={(e) => {
            // Prevent closing when clicking on Popover
            const target = e.target as HTMLElement;
            if (target.closest("[data-radix-popper-content-wrapper]")) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Search and add a user to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>User</Label>
              <div className="relative">
                <Input
                  placeholder="Type to search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOpenCombobox(true);
                  }}
                  onFocus={() => setOpenCombobox(true)}
                  className="w-full"
                />
                {openCombobox && orgUsers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[300px] overflow-auto">
                    {orgUsers
                      .filter((user) => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return (
                          user.fullName.toLowerCase().includes(query) ||
                          user.email.toLowerCase().includes(query)
                        );
                      })
                      .map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewMemberId(user.id);
                            setSearchQuery(user.fullName);
                            setOpenCombobox(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      ))}
                    {orgUsers.filter((user) => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        user.fullName.toLowerCase().includes(query) ||
                        user.email.toLowerCase().includes(query)
                      );
                    }).length === 0 && (
                      <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Executive">Executive</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              disabled={isAddingMember}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={!newMemberId || isAddingMember}
            >
              {isAddingMember ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Executive">Executive</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isUpdatingRole}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={isUpdatingRole}>
              {isUpdatingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from the project?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeletingMember}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMember}
              disabled={isDeletingMember}
            >
              {isDeletingMember ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
