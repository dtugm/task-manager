"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "hover:border-blue-500/50",
    },
    {
      id: "wfh",
      label: t.wfh,
      icon: Home,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "hover:border-purple-500/50",
    },
    {
      id: "field",
      label: t.fieldWork,
      icon: MapPin,
      color: "text-green-500",
      bg: "bg-green-500/10",
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "hover:border-green-500/50",
    },
    {
      id: "sick",
      label: t.sick,
      icon: HeartPulse,
      color: "text-red-500",
      bg: "bg-red-500/10",
      gradient: "from-red-500/20 to-orange-500/20",
      border: "hover:border-red-500/50",
    },
    {
      id: "absent",
      label: t.absent,
      icon: Ban,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      gradient: "from-orange-500/20 to-yellow-500/20",
      border: "hover:border-orange-500/50",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Blobs Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob bg-purple-500/30 dark:bg-purple-500/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-blue-500/30 dark:bg-blue-500/20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bg-pink-500/30 dark:bg-pink-500/20"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Section: Status & Types */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-white/20 dark:ring-slate-900/20">
                  <Clock className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t.status}
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 ring-1 ring-inset ring-red-500/20">
                    {t.absent}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-5xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 font-mono">
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-lg font-medium text-slate-400 dark:text-slate-500 mt-2">
                {time.toLocaleDateString([], {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 pl-1 border-l-4 border-indigo-500">
              {t.selectAttendanceType}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {attendanceTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "relative group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 h-32 overflow-hidden",
                      isSelected
                        ? "border-blue-500/50 shadow-lg shadow-blue-500/20"
                        : "bg-white/40 dark:bg-slate-800/40 border-white/20 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-800/60"
                    )}
                  >
                    {isSelected && (
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br opacity-20",
                          type.gradient
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        "p-3 rounded-xl transition-colors duration-300",
                        isSelected
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110"
                          : cn(
                              "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-110",
                              type.color
                            )
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium text-center z-10 transition-colors",
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-300"
                      )}
                    >
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedType === "absent" && (
              <div className="mt-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50/50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/20">
                <Label
                  htmlFor="reason"
                  className="text-sm font-medium text-red-600 dark:text-red-400 after:content-['*'] after:ml-0.5"
                >
                  {t.reason}
                </Label>
                <Textarea
                  id="reason"
                  placeholder={t.reasonPlaceholder}
                  className="resize-none h-32 bg-white/60 dark:bg-slate-900/60 border-red-200 dark:border-red-900/30 focus-visible:ring-red-500/30"
                />
              </div>
            )}

            <Button
              className={cn(
                "w-full h-14 text-lg font-bold text-white mt-8 shadow-xl rounded-2xl transition-all duration-300 transform active:scale-[0.98]",
                selectedType === "absent"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-red-500/25 ring-4 ring-red-500/10"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 ring-4 ring-blue-500/10"
              )}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t.clockIn}
              </div>
            </Button>
          </div>
        </div>

        {/* Bottom Section: History Header */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-xl shadow-indigo-500/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                {t.attendanceHistory}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.yourPastRecords}
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-800 hover:border-green-300 transition-all bg-white/50 dark:bg-slate-900/50"
            >
              <Download className="mr-2 h-4 w-4" />
              {t.exportLogbook}
            </Button>
          </div>

          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-9 gap-2 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100"
            >
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm">{t.weekly}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-9 gap-2 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100"
            >
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm">{t.allWorkType}</span>
            </Button>
          </div>

          {/* Placeholder for table content */}
          <div className="min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {t.noRecords}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
