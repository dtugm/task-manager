import { Input } from "@/components/ui/input";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface MembersFilterProps {
  memberSearchQuery: string;
  setMemberSearchQuery: (query: string) => void;
  selectedRoleFilter: string;
  setSelectedRoleFilter: (role: string) => void;
  isRoleFilterOpen: boolean;
  setIsRoleFilterOpen: (open: boolean) => void;
}

export function MembersFilter({
  memberSearchQuery,
  setMemberSearchQuery,
  selectedRoleFilter,
  setSelectedRoleFilter,
  isRoleFilterOpen,
  setIsRoleFilterOpen,
}: MembersFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-4 relative z-20">
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <Input
          placeholder={t.search || "Search..."}
          value={memberSearchQuery}
          onChange={(e) => setMemberSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all rounded-xl hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="w-full sm:w-[200px] relative z-[100]">
        {/* Manual Dropdown Trigger */}
        <div
          onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
          className="flex items-center justify-between h-11 w-full px-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Filter className="h-4 w-4 text-indigo-500" />
            <span className="text-slate-900 dark:text-slate-100 font-medium select-none">
              {selectedRoleFilter === "All"
                ? t.all || "All Roles"
                : selectedRoleFilter}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform duration-200",
              isRoleFilterOpen && "rotate-180"
            )}
          />
        </div>

        {/* Manual Dropdown Content */}
        {isRoleFilterOpen && (
          <>
            <div
              className="fixed inset-0 z-[99]"
              onClick={() => setIsRoleFilterOpen(false)}
            ></div>
            <div className="absolute top-12 left-0 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-[100] py-1 animate-in fade-in zoom-in-95 duration-200">
              {["All", "Executive", "Manager", "Supervisor", "Employee"].map(
                (roleOption) => (
                  <div
                    key={roleOption}
                    onClick={() => {
                      setSelectedRoleFilter(roleOption);
                      setIsRoleFilterOpen(false);
                    }}
                    className={cn(
                      "px-3 py-2.5 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between",
                      selectedRoleFilter === roleOption
                        ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20"
                        : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {roleOption === "All" ? t.all || "All Roles" : roleOption}
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
