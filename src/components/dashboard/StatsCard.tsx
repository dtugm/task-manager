import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <Card className="rounded-xl border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/50 dark:bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div
          className={cn(
            "p-3 rounded-2xl transition-colors duration-300",
            iconClassName ||
              "bg-primary/10 text-primary group-hover:bg-primary/20"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              trendUp
                ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                : "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {trend}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <CardTitle className="text-sm font-medium text-muted-foreground mt-1">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2 opacity-80">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
