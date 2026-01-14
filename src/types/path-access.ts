export interface PathAccess {
  id: string;
  path: string;
  roles: string[];
  organization?: {
    id: string;
    name: string;
  };
  project?: any;
  createdAt: string;
  updatedAt: string;
}

export interface PathAccessPayload {
  path: string;
  roles: string[];
  projectId?: string;
}

export interface GroupedPathAccess {
  role: string;
  availablePaths: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: number;
    message: string;
  };
}
