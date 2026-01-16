"use client";

import { UserStats } from "@/types/user-stats";
import {
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  User,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UserStatsCardProps {
  user: UserStats;
}

export function UserStatsCard({ user }: UserStatsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {user.fullName}
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                  {user.role}
                </span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                @{user.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                  Total Tasks
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {user.totalTasks}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                  Total Points
                </div>
                <div className="text-xl font-bold text-amber-500 flex items-center gap-1 justify-center">
                  <Star className="h-4 w-4 fill-current" /> {user.totalPoints}
                </div>
              </div>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-3 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Approved
                  <div className="text-xs text-emerald-600 font-medium bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    {user.approved.points} pts
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-2xl font-bold text-slate-800 dark:text-slate-200">
                {user.approved.count}
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-3 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Pending
                  <div className="text-xs text-orange-600 font-medium bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                    {user.pending.points} pts
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-2xl font-bold text-slate-800 dark:text-slate-200">
                {user.pending.count}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center p-2 bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/40 transition-colors border-t border-white/20 text-xs font-medium text-slate-500"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" /> Hide Breakdown
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" /> Show Breakdown
          </>
        )}
      </button>

      {/* Expanded Breakdown */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out bg-slate-50/50 dark:bg-slate-900/30",
          isExpanded
            ? "grid-rows-[1fr] opacity-100 border-t border-white/20"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Job Breakdown */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                Main Job
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Total</span>
                  <div className="flex gap-4">
                    <span className="font-semibold">
                      {user.breakdown.main.total.count} Tasks
                    </span>
                    <span className="font-semibold text-amber-500">
                      {user.breakdown.main.total.points} Pts
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10">
                  <span className="text-slate-500">Approved</span>
                  <div className="flex gap-4">
                    <span className="font-semibold text-emerald-600">
                      {user.breakdown.main.approved.count} Tasks
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {user.breakdown.main.approved.points} Pts
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-orange-50/50 dark:bg-orange-900/10">
                  <span className="text-slate-500">Pending</span>
                  <div className="flex gap-4">
                    <span className="font-semibold text-orange-600">
                      {user.breakdown.main.pending.count} Tasks
                    </span>
                    <span className="font-semibold text-orange-600">
                      {user.breakdown.main.pending.points} Pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Job Breakdown */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                Side Job
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Total</span>
                  <div className="flex gap-4">
                    <span className="font-semibold">
                      {user.breakdown.side.total.count} Tasks
                    </span>
                    <span className="font-semibold text-amber-500">
                      {user.breakdown.side.total.points} Pts
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10">
                  <span className="text-slate-500">Approved</span>
                  <div className="flex gap-4">
                    <span className="font-semibold text-emerald-600">
                      {user.breakdown.side.approved.count} Tasks
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {user.breakdown.side.approved.points} Pts
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-orange-50/50 dark:bg-orange-900/10">
                  <span className="text-slate-500">Pending</span>
                  <div className="flex gap-4">
                    <span className="font-semibold text-orange-600">
                      {user.breakdown.side.pending.count} Tasks
                    </span>
                    <span className="font-semibold text-orange-600">
                      {user.breakdown.side.pending.points} Pts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
