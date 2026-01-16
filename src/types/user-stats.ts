export interface StatCount {
  count: number;
  points: number;
}

export interface TaskTypeBreakdown {
  total: StatCount;
  approved: StatCount;
  pending: StatCount;
}

export interface UserStats {
  userId: string;
  username: string;
  fullName: string;
  role: string;
  totalTasks: number;
  totalPoints: number;
  approved: StatCount;
  pending: StatCount;
  breakdown: {
    main: TaskTypeBreakdown;
    side: TaskTypeBreakdown;
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: {
    users: UserStats[];
  };
}

export interface UserStatsFilters {
  startDate?: string;
  endDate?: string;
}
