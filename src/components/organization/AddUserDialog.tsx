"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { organizationApi } from "@/lib/organization-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/lib/auth-api";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
  onSuccess: () => void;
}

export function AddUserDialog({
  open,
  onOpenChange,
  orgId,
  onSuccess,
}: AddUserDialogProps) {
  const { t } = useLanguage();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("Employee");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: Ideally we would implement a user search here similar to /task-assignment
  // For now, consistent with the request, we'll use a simple Input for User ID
  // But to be helpful, let's allow searching by username/email if we had an endpoint for "search all users global"
  // Since we don't know if a global search exists, we'll stick to User ID input as per prompt data structure implies
  // "userId": "user-id-here"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const match = document.cookie.match(
        new RegExp("(^| )accessToken=([^;]+)")
      );
      const token = match ? match[2] : null;

      if (!token) throw new Error("No access token found");

      const response = await organizationApi.addOrganizationUser(token, orgId, {
        userId,
        role,
      });

      if (response.success) {
        setUserId("");
        setRole("Employee");
        onSuccess();
        onOpenChange(false);
      } else {
        setError(response.error?.message || "Failed to add user");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t.addUserToOrg}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-white/50 dark:bg-slate-950/50"
            />
            <p className="text-xs text-muted-foreground">
              Enter the exact User ID to add them to the organization.
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t.role}</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-white/50 dark:bg-slate-950/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !userId.trim()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.addUser}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
