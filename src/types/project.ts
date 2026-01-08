import { Organization } from "./auth";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  organization: Organization;
  relatedTask?: number;
}

export interface ProjectUser {
  id: string; // This might be the user ID or a mapping ID, let's assume it returns user details or similar.
  // Based on the request: /projects/:id/users req body has userId.
  // The GET /projects/:id/users response structure isn't fully defined in the user prompt,
  // but usually it includes user info and role.
  // For now I'll define what I can infer.
  userId: string;
  role: string;
  // potentially other user fields
}

export interface CreateProjectRequest {
  name: string;
}

export interface UpdateProjectRequest {
  name: string;
}

export interface AddProjectUserRequest {
  userId: string;
  role: string;
}

export interface UpdateProjectUserRoleRequest {
  role: string;
}
