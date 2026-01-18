import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useNotifications } from "@/contexts/notification-context";
import { NotificationItem } from "@/components/notifications/notification-item";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RecentActivity() {
  const { t } = useLanguage();
  const { notifications } = useNotifications();

  // Show top 5 recent notifications
  const recentNotifications = notifications.slice(0, 5);

  return (
    <Card className="col-span-full border-none shadow-none h-full min-h-[400px] bg-transparent flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 shrink-0">
        <div className="p-2 rounded-xl bg-[#0077FF]/10 text-[#0077FF]">
          <Calendar className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg font-semibold text-[#0C426A] dark:text-slate-100">
          {t.recentActivity}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full max-h-[400px]">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                <Bell className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No recent activity to display
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <NotificationItem notification={notification} />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
