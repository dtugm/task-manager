"use client";

import React from "react";
import { useNotifications } from "@/contexts/notification-context";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Loader2, CheckCheck, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function NotificationsPage() {
  const { notifications, loading, markAllAsRead, unreadCount } =
    useNotifications();

  return (
    <div className="container max-w-4xl py-6 space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Manage your notifications and alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Separator />

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
              <Bell className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">No notifications</h3>
              <p>You're all caught up! Check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <NotificationItem notification={notification} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
