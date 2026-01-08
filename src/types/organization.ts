import { User } from "./auth";

export interface Organization {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface OrganizationWithRole {
  organization: Organization;
  role: string;
  isActive: boolean;
}

export interface OrganizationUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  role: string;
  isActive: boolean;
}

export interface CreateOrganizationRequest {
  name: string;
}

export interface UpdateOrganizationRequest {
  name: string;
}

export interface SetActiveOrganizationRequest {
  organizationId: string;
}

export interface AddOrganizationUserRequest {
  userId: string;
  role: string;
}

export interface UpdateOrganizationUserRoleRequest {
  role: string;
}

export interface OrganizationUsersResponse {
  users: OrganizationUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
