"use client";

import React from "react";
import { CheckCheck, Settings, Loader2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/contexts/notification-context";
import { NotificationItem } from "./notification-item";

import { useRouter } from "next/navigation";

interface NotificationListProps {
  onClose?: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
  const { notifications, unreadCount, loading, markAllAsRead } =
    useNotifications();
  const router = useRouter();

  return (
    <div className="flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b bg-background sticky top-0 z-10">
        <div>
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              // Navigate to settings
              onClose?.();
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y relative">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="sticky bottom-0 bg-background z-10 border-t">
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                router.push("/notifications");
                onClose?.();
              }}
            >
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
