import {
  ApiResponse,
  Notification,
  NotificationListResponse,
  UnreadCountResponse,
  NotificationPreference,
  UpdatePreferenceDto,
  GetNotificationsQuery,
  NotificationType,
  PushSubscription,
  SubscribePushDto,
} from "@/types/notification";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    console.log(data);
    throw new Error(data.error?.message || "An error occurred");
  }

  return data;
}

export const notificationApi = {
  // Notifications CRUD
  getNotifications: async (
    token: string,
    query?: GetNotificationsQuery
  ): Promise<ApiResponse<NotificationListResponse>> => {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.isRead !== undefined)
      params.append("isRead", query.isRead.toString());
    if (query?.type) params.append("type", query.type);

    const queryString = params.toString();
    const url = `/notifications${queryString ? `?${queryString}` : ""}`;

    return fetcher<ApiResponse<NotificationListResponse>>(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getUnreadCount: async (
    token: string
  ): Promise<ApiResponse<UnreadCountResponse>> => {
    return fetcher<ApiResponse<UnreadCountResponse>>(
      "/notifications/unread-count",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getNotification: async (
    token: string,
    id: string
  ): Promise<ApiResponse<Notification>> => {
    return fetcher<ApiResponse<Notification>>(`/notifications/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  markAsRead: async (
    token: string,
    id: string
  ): Promise<ApiResponse<Notification>> => {
    return fetcher<ApiResponse<Notification>>(`/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  markAllAsRead: async (
    token: string
  ): Promise<ApiResponse<{ updated: number }>> => {
    return fetcher<ApiResponse<{ updated: number }>>(
      "/notifications/read-all",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  deleteNotification: async (
    token: string,
    id: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    return fetcher<ApiResponse<{ success: boolean }>>(`/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Push Subscriptions
  subscribeToPush: async (
    token: string,
    dto: SubscribePushDto
  ): Promise<ApiResponse<PushSubscription>> => {
    return fetcher<ApiResponse<PushSubscription>>("/notifications/subscribe", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });
  },

  unsubscribeFromPush: async (
    token: string,
    endpoint: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    return fetcher<ApiResponse<{ success: boolean }>>(
      "/notifications/unsubscribe",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint }),
      }
    );
  },

  getUserSubscriptions: async (
    token: string
  ): Promise<ApiResponse<PushSubscription[]>> => {
    return fetcher<ApiResponse<PushSubscription[]>>(
      "/notifications/subscriptions/list",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Preferences
  getPreferences: async (
    token: string
  ): Promise<ApiResponse<NotificationPreference[]>> => {
    return fetcher<ApiResponse<NotificationPreference[]>>(
      "/notifications/preferences/list",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  updatePreference: async (
    token: string,
    type: NotificationType,
    dto: UpdatePreferenceDto
  ): Promise<ApiResponse<NotificationPreference>> => {
    return fetcher<ApiResponse<NotificationPreference>>(
      `/notifications/preferences/${type}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      }
    );
  },

  resetPreferencesToDefaults: async (
    token: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    return fetcher<ApiResponse<{ success: boolean }>>(
      "/notifications/preferences/defaults",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
