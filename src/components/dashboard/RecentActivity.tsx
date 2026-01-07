import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function RecentActivity() {
  const { t } = useLanguage();
  return (
    <Card className="col-span-full border-none shadow-none h-full min-h-[200px] bg-transparent">
      <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div className="p-2 rounded-xl bg-[#0077FF]/10 text-[#0077FF]">
          <Calendar className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg font-semibold text-[#0C426A] dark:text-slate-100">
          {t.recentActivity}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-48">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-full">
          No recent activity to display
        </p>
      </CardContent>
    </Card>
  );
}
