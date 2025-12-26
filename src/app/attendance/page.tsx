"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Building2,
  Home,
  MapPin,
  HeartPulse,
  Ban,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";

const attendanceTypes = [
  {
    id: "wfo",
    label: "Work from Office",
    icon: Building2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "wfh",
    label: "Work from Home",
    icon: Home,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "field",
    label: "Field Work",
    icon: MapPin,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: "sick",
    label: "Sick",
    icon: HeartPulse,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "absent",
    label: "Absent",
    icon: Ban,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export default function AttendancePage() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState("wfo");
  const [time, setTime] = useState(new Date());

  const attendanceTypes = [
    {
      id: "wfo",
      label: t.wfo,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: "wfh",
      label: t.wfh,
      icon: Home,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      id: "field",
      label: t.fieldWork,
      icon: MapPin,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      id: "sick",
      label: t.sick,
      icon: HeartPulse,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      id: "absent",
      label: t.absent,
      icon: Ban,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Section: Status & Types */}
      <Card className="border-none shadow-sm p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-16 w-16 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {t.status}: {t.absent}
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {time.toLocaleTimeString([], { hour12: true })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t.selectAttendanceType}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {attendanceTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200 h-32",
                    isSelected
                      ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-background border-border hover:border-blue-500/50 hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isSelected
                        ? "bg-white/20 text-white"
                        : cn(type.bg, type.color)
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedType === "absent" && (
            <div className="mt-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label
                htmlFor="reason"
                className="text-sm font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                {t.reason}
              </Label>
              <Textarea
                id="reason"
                placeholder={t.reasonPlaceholder}
                className="resize-none h-32"
              />
            </div>
          )}

          <Button
            className={cn(
              "w-full h-12 text-lg font-semibold text-white mt-6 shadow-md transition-all",
              selectedType === "absent"
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                : "bg-green-500 hover:bg-green-600 shadow-green-500/20"
            )}
          >
            {t.clockIn}
          </Button>
        </div>
      </Card>

      {/* Bottom Section: History Header */}
      <Card className="border-none shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">{t.attendanceHistory}</h3>
            <p className="text-sm text-muted-foreground">{t.yourPastRecords}</p>
          </div>
          <Button
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            {t.exportLogbook}
          </Button>
        </div>

        <div className="flex gap-3 mb-6">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{t.weekly}</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{t.allWorkType}</span>
          </Button>
        </div>

        {/* Placeholder for table content */}
        <div className="min-h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
          <p className="text-muted-foreground text-sm">{t.noRecords}</p>
        </div>
      </Card>
    </div>
  );
}
