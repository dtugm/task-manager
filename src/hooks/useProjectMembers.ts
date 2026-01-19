import { useState, useEffect, useCallback } from "react";
import { projectApi } from "@/lib/project-api";
import { authApi } from "@/lib/auth-api";
import { Project } from "@/types/project";

export interface Member {
  id: string;
  userId: string;
  role: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface OrgUser {
  id: string;
  fullName: string;
  email: string;
}

const ORGANIZATION_ID =
  process.env.NEXT_PUBLIC_ORGANIZATION_ID || "KELGsLB6canc9jAX7035G";

export function useProjectMembers(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);

  // Operation states
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const projRes = await projectApi.getProjectById(token, projectId);
      if (projRes.success) setProject(projRes.data);
      else setError(projRes.error?.message || "Failed to fetch project");

      const memRes = await projectApi.getProjectUsers(token, projectId);
      if (memRes.success) {
        let rawMembers: any[] = [];
        const data = memRes.data;
        if (Array.isArray(data)) rawMembers = data;
        else if (data.data && Array.isArray(data.data)) rawMembers = data.data;
        else if (data.users && Array.isArray(data.users))
          rawMembers = data.users;

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
  }, [projectId]);

  const fetchOrgUsers = useCallback(async () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;
    if (!token) return;

    try {
      const response = await authApi.getOrganizationUsers(
        token,
        ORGANIZATION_ID,
        1,
        200
      );
      let rawData: any = response;
      if (response && (response as any).success && (response as any).data) {
        rawData = (response as any).data;
      }

      const mappedUsers: OrgUser[] = [];
      let usersSource: any[] = [];
      if (Array.isArray(rawData)) usersSource = rawData;
      else if (rawData && Array.isArray(rawData.data))
        usersSource = rawData.data;
      else if (rawData && Array.isArray(rawData.users))
        usersSource = rawData.users;

      usersSource.forEach((item: any) => {
        if (item.user && item.user.id) {
          mappedUsers.push({
            id: item.user.id,
            fullName: item.user.fullName || item.user.username || "Unknown",
            email: item.user.email,
          });
        } else if (item.id && (item.fullName || item.username)) {
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
  }, []);

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId, fetchData]);

  const addMember = async (userId: string, role: string) => {
    setIsAddingMember(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsAddingMember(false);
      return false;
    }

    try {
      const response = await projectApi.addProjectUser(token, projectId, {
        userId,
        role,
      });
      if (response.success) {
        await fetchData();
        return true;
      } else {
        setError(response.error?.message || "Failed to add member");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to add member");
      return false;
    } finally {
      setIsAddingMember(false);
    }
  };

  const updateMemberRole = async (member: Member, newRole: string) => {
    setIsUpdatingRole(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsUpdatingRole(false);
      return false;
    }

    try {
      const response = await projectApi.updateProjectUserRole(
        token,
        projectId,
        member.userId || member.id,
        { role: newRole }
      );
      if (response.success) {
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
        );
        return true;
      } else {
        setError(response.error?.message || "Failed to update role");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update role");
      return false;
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const removeMember = async (member: Member) => {
    setIsDeletingMember(true);
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    const token = match ? match[2] : null;

    if (!token) {
      setIsDeletingMember(false);
      return false;
    }

    try {
      const response = await projectApi.removeProjectUser(
        token,
        projectId,
        member.userId || member.id // Fallback just in case
      );
      const isSuccess =
        !response ||
        response.success === true ||
        Object.keys(response).length === 0;
      if (isSuccess) {
        setMembers((prev) => prev.filter((m) => m.id !== member.id));
        return true;
      } else {
        setError(response.error?.message || "Failed to remove member");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to remove member");
      return false;
    } finally {
      setIsDeletingMember(false);
    }
  };

  return {
    project,
    members,
    isLoading,
    error,
    orgUsers,
    fetchOrgUsers,
    addMember,
    updateMemberRole,
    removeMember,
    isAddingMember,
    isUpdatingRole,
    isDeletingMember,
  };
}
