export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  progress: number;
  status?: string;
  dueDate: string;
  projectId: string;
  assigneeIds: string[];
  parentTaskId?: string;
  createdAt?: string;
  updatedAt?: string;
  creatorId?: string;
  // Nested objects from API
  creator?: {
    id: string;
    username: string;
    email: string;
    fullName: string;
  };
  project?: {
    id: string;
    name: string;
  };
  parentTask?: {
    id: string;
    title: string;
    description: string;
  } | null;
  childTasks?: Task[];
  assignees?: Array<{
    id: string;
    assignee: {
      id: string;
      username: string;
      email: string;
      fullName: string;
    };
  }>;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  points: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  projectId: string;
  assigneeIds: string[];
  parentTaskId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  points?: number;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  progress?: number;
  dueDate?: string;
  assigneeIds?: string[];
  projectId?: string;
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: {
    message: string;
  };
}

export interface CreatedTasksSummaryResponse {
  success: boolean;
  data: {
    totalTasks: number;
    totalPoints: number;
    statusBreakdown: Record<string, { count: number; points: number }>;
    tasks: Task[];
  };
  error?: {
    message: string;
  };
}
