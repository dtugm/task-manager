export enum NotificationType {
  TASK_ASSIGNED = "task.assigned",
  TASK_UNASSIGNED = "task.unassigned",
  TASK_UPDATED = "task.updated",
  TASK_COMPLETED = "task.completed",
  TASK_APPROVED = "task.approved",
  TASK_REJECTED = "task.rejected",
  TASK_COMMENTED = "task.commented",
}

export enum ResourceType {
  TASK = "task",
}

export interface NotificationUser {
  id: string;
  username: string;
  email: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  recipient: NotificationUser;
  actor: NotificationUser | null;
  resourceId: string;
  resourceType: ResourceType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  organization: {
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationPreference {
  id: string;
  notificationType: NotificationType;
  inAppEnabled: boolean;
  pushEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePreferenceDto {
  inAppEnabled?: boolean;
  pushEnabled?: boolean;
}

export interface GetNotificationsQuery {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}

export interface PushSubscription {
  id: string;
  endpoint: string;
  deviceName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscribePushDto {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  deviceName?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
