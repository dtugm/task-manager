export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  role?: string;
  organizationId?: string;
  phoneNumber?: string;
  // Add other user fields as needed based on API response
}

export interface Organization {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  name: string;
  role: string;
}

export interface UserContext {
  user: User;
  organizations: Organization[];
  projects: Project[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number; // Token expiration time in seconds
  user: User;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
  organizationId: string;
}

export interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    code: string;
  };
}
