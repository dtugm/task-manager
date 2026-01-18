"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { X, FileCheck, FileX, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Notification, NotificationType } from "@/types/notification";
import { useNotifications } from "@/contexts/notification-context";

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

const notificationIcons = {
  [NotificationType.TASK_ASSIGNED]: FileCheck,
  [NotificationType.TASK_UPDATED]: FileCheck,
  [NotificationType.TASK_COMPLETED]: FileCheck,
  [NotificationType.TASK_APPROVED]: FileCheck,
  [NotificationType.TASK_REJECTED]: FileX,
  [NotificationType.TASK_UNASSIGNED]: FileX,
  [NotificationType.TASK_COMMENTED]: MessageSquare,
  [NotificationType.TASK_DUE_SOON]: Clock,
};

export function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotifications();
  const Icon = notificationIcons[notification.type] || FileCheck;

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // Navigate to resource
    if (notification.resourceType === "TASK") {
      // Navigate to task detail page
      window.location.href = `/task-manager?taskId=${notification.resourceId}`;
    }
    onClose?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div
      className={cn(
        "p-4 hover:bg-muted/50 cursor-pointer transition-colors relative group",
        !notification.isRead && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
      )}

      <div className="flex gap-3 pl-4">
        {/* Icon */}
        <div
          className={cn(
            "mt-1 p-2 rounded-full w-fit h-fit",
            notification.isRead ? "bg-muted" : "bg-blue-100 dark:bg-blue-900"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium leading-none mb-1">
              {notification.title}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={handleDelete}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
            {notification.actor && (
              <p className="text-xs text-muted-foreground">
                by {notification.actor.username}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
