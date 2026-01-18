"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Notification } from "@/types/notification";
import { notificationApi } from "@/lib/notification-api";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  connected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const socketInstance = io("http://localhost:8000/notifications", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Notifications WebSocket connected");
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Notifications WebSocket disconnected");
      setConnected(false);
    });

    socketInstance.on("notification", (notification: Notification) => {
      console.log("🔔 New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      toast(notification.title, {
        description: notification.message,
        action: {
          label: "View",
          onClick: () => {
            // Handle notification click
            markAsRead(notification.id);
          },
        },
      });
    });

    socketInstance.on("unreadCount", (data: { count: number }) => {
      console.log("📊 Unread count update:", data.count);
      setUnreadCount(data.count);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      setLoading(true);
      const [notificationsResponse, countResponse] = await Promise.all([
        notificationApi.getNotifications(token, { page: 1, limit: 20 }),
        notificationApi.getUnreadCount(token),
      ]);

      setNotifications(notificationsResponse.data.data);
      setUnreadCount(countResponse.data.count);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark single notification as read
  const markAsRead = useCallback(async (id: string) => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await notificationApi.markAsRead(token, id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await notificationApi.markAllAsRead(token);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (id: string) => {
      const token = Cookies.get("accessToken");
      if (!token) return;

      try {
        await notificationApi.deleteNotification(token, id);
        const notification = notifications.find((n) => n.id === id);
        if (notification && !notification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        toast.success("Notification deleted");
      } catch (error) {
        console.error("Failed to delete notification:", error);
        toast.error("Failed to delete notification");
      }
    },
    [notifications]
  );

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        connected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}
