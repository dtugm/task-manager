"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { organizationApi } from "@/lib/organization-api";

interface UserSearchSelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

export function UserSearchSelect({
  value,
  onChange,
  placeholder = "Select user...",
}: UserSearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [users, setUsers] = React.useState<{ value: string; label: string }[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch initial users or when search changes
  React.useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch]);

  const getToken = () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    return match ? match[2] : null;
  };

  const fetchUsers = async (search: string) => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      let orgId = "";
      // Try to get org ID from local storage first
      if (typeof window !== "undefined") {
        const userDataStr = localStorage.getItem("user_data");
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            orgId =
              userData.user?.organizationId ||
              userData.organizations?.[0]?.id ||
              userData.data?.organizations?.[0]?.id ||
              "";
          } catch (e) {
            console.error("Error parsing user_data", e);
          }
        }
      }

      // Fallback to API if not in local storage
      if (!orgId) {
        const activeOrgResp = await organizationApi.getActiveOrganization(
          token
        );
        if (activeOrgResp.success && activeOrgResp.data) {
          orgId = activeOrgResp.data.organization?.id;
        }
      }

      if (!orgId) {
        console.error("No organization ID found");
        setLoading(false);
        return;
      }

      const usersResp = await organizationApi.getOrganizationUsers(
        token,
        orgId,
        1,
        200,
        search
      );

      if (usersResp.success && usersResp.data) {
        // Handle potentially different response structures
        const userList = usersResp.data.users || [];

        const mappedUsers = userList.map((u: any) => ({
          value: u.user ? u.user.id : u.id,
          label: u.user
            ? u.user.fullName || u.user.username
            : u.fullName || u.username,
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-white/50"
        >
          {value
            ? users.find((user) => user.value === value)?.label ||
              "Selected User"
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="flex flex-col border rounded-md bg-popover text-popover-foreground">
          {/* Search Input */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-none focus-visible:ring-0 px-0"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="max-h-[300px] overflow-y-auto p-1">
            {loading && (
              <div className="p-4 text-sm text-center text-slate-500 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
              </div>
            )}

            {!loading && users.length === 0 && (
              <div className="py-6 text-center text-sm text-slate-500">
                No user found.
              </div>
            )}

            {!loading &&
              users
                .filter(
                  (user) =>
                    !searchTerm ||
                    user.label.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === user.value && "bg-accent/50"
                    )}
                    onClick={() => {
                      onChange(user.value === value ? undefined : user.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === user.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {user.label}
                  </div>
                ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
