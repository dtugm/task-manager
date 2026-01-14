"use client";

import { useEffect, useState } from "react";
import { PathAccess, PathAccessPayload } from "@/types/path-access";
import { pathAccessApi } from "@/lib/path-access-api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { PathAccessDialog } from "@/components/path-access/PathAccessDialog";
import { BackgroundEffects } from "@/app/login/components/BackgroundEffects";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "next-themes";

export default function PathAccessPage() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [data, setData] = useState<PathAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PathAccess | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getAuthToken = () => {
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    return match ? match[2] : null;
  };

  const fetchData = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const resp = await pathAccessApi.getAll(token);
      if (resp.success) {
        setData(resp.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch access rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (payload: PathAccessPayload) => {
    const token = getAuthToken();
    if (!token) return;

    setActionLoading(true);
    try {
      await pathAccessApi.create(token, payload);
      setIsDialogOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to create rule");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (payload: PathAccessPayload) => {
    const token = getAuthToken();
    if (!token || !editingItem) return;

    setActionLoading(true);
    try {
      await pathAccessApi.update(token, editingItem.id, payload);
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to update rule");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    const token = getAuthToken();
    if (!token) return;

    try {
      await pathAccessApi.delete(token, id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete rule");
    }
  };

  const openEdit = (item: PathAccess) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  return (
    <div
      className={`relative min-h-[calc(100vh-2rem)] p-4 sm:p-6 lg:p-8 overflow-hidden transition-colors duration-700 ${
        isDark ? "bg-slate-900" : "bg-indigo-50"
      }`}
    >
      {/* Background Effects */}
      <BackgroundEffects isDark={isDark} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/30 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-indigo-500" />
              Path Access Control
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
              Manage role-based access rules with ease
            </p>
          </div>
          <Button
            onClick={openCreate}
            size="lg"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 border-0 transition-all hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Rule
          </Button>
        </div>

        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-300 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/40 dark:border-slate-700/50 shadow-2xl overflow-hidden px-4">
          <Table>
            <TableHeader>
              <TableRow className="font-bold dark:bg-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-800/60 border-b border-white/20 dark:border-slate-700/50">
                <TableHead className="w-[30%]">Path URL</TableHead>
                <TableHead className="w-[40%]">Allowed Roles</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Loading rules...
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-slate-500"
                  >
                    No access rules defined yet.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell className="font-medium font-mono text-sm text-indigo-600 dark:text-indigo-400">
                      {item.path}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {item.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(item.updatedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(item)}
                          className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PathAccessDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={editingItem ? handleUpdate : handleCreate}
        initialData={editingItem}
        isLoading={actionLoading}
      />
    </div>
  );
}
