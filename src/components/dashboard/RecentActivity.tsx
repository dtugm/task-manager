import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function RecentActivity() {
  const { t } = useLanguage();
  return (
    <Card className="col-span-full border-none shadow-sm h-full min-h-[200px]">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
          <Calendar className="h-5 w-5" />
        </div>
        <CardTitle className="text-base">{t.recentActivity}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-40">
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </CardContent>
    </Card>
  );
}
