"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { UserStats } from "@/types/user-stats";
import { userStatsApi } from "@/lib/user-stats-api";
import { UserStatsFilters } from "@/components/user-stats/UserStatsFilters";
import { UserStatsCard } from "@/components/user-stats/UserStatsCard";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function UserStatsPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter State
  const [filterSearch, setFilterSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [sortBy, setSortBy] = useState("totalTasks-desc");

  const fetchUserStats = async () => {
    setIsLoading(true);
    try {
      const match = document.cookie.match(
        new RegExp("(^| )accessToken=([^;]+)")
      );
      const token = match ? match[2] : null;

      if (!token) {
        console.error("No access token found");
        return;
      }

      const filters = {
        startDate: filterDateFrom || undefined,
        endDate: filterDateTo || undefined,
      };

      const response = await userStatsApi.getUserStats(token, filters);
      if (response.success && response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when date filters change or on mount
  useEffect(() => {
    fetchUserStats();
  }, [filterDateFrom, filterDateTo]);

  // Client-side filtering and sorting
  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      // Search Filter
      if (filterSearch) {
        const searchLower = filterSearch.toLowerCase();
        const matchesName = user.fullName.toLowerCase().includes(searchLower);
        const matchesUsername = user.username
          .toLowerCase()
          .includes(searchLower);
        if (!matchesName && !matchesUsername) return false;
      }

      // Role Filter
      if (filterRole !== "all") {
        if (user.role !== filterRole) return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "totalTasks-desc":
          return b.totalTasks - a.totalTasks;
        case "totalTasks-asc":
          return a.totalTasks - b.totalTasks;
        case "totalPoints-desc":
          return b.totalPoints - a.totalPoints;
        case "totalPoints-asc":
          return a.totalPoints - b.totalPoints;
        default:
          return 0;
      }
    });
  }, [users, filterSearch, filterRole, sortBy]);

  return (
    <div className="relative isolate min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      {/* Blobs Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob bg-purple-500/30 dark:bg-purple-500/20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-blue-500/30 dark:bg-blue-500/20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bg-pink-500/30 dark:bg-pink-500/20"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/20 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 flex items-center gap-3">
              <Users className="h-8 w-8 text-indigo-500" />
              User Statistics
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              View and analyze user performance and tasks
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchUserStats}
              className="bg-white/50 dark:bg-slate-900/50 border-white/20 hover:bg-white/80 rounded-xl"
              title="Refresh"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <UserStatsFilters
          filterSearch={filterSearch}
          setFilterSearch={setFilterSearch}
          filterDateFrom={filterDateFrom}
          setFilterDateFrom={setFilterDateFrom}
          filterDateTo={filterDateTo}
          setFilterDateTo={setFilterDateTo}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Users Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-2">
            <span>Showing {filteredUsers.length} users</span>
          </div>

          {isLoading ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-12 flex items-center justify-center border border-white/10 min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10 min-h-[400px] flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
                No users found
              </h3>
              <p className="text-slate-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {filteredUsers.map((user) => (
                <UserStatsCard key={user.userId} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
