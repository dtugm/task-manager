"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";
import { User, UpdateUserData } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Lock,
  Settings,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getToken = () => {
    // Basic cookie parsing
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await authApi.getMe(token);
        if (response.success) {
          const userData = response.data.user;
          setUser(userData);
          setFullName(userData.fullName || "");
          setUsername(userData.username || "");
          setEmail(userData.email || "");
          setPhoneNumber(userData.phoneNumber || "");
        } else {
          setMessage({
            type: "error",
            text: response.error?.message || "Failed to load user profile",
          });
        }
      } catch (error: any) {
        setMessage({
          type: "error",
          text: error.message || "Failed to load user profile",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);
    const token = getToken();

    if (!user || !token) {
      setMessage({
        type: "error",
        text: "Session invalid. Please login again.",
      });
      setIsSaving(false);
      return;
    }

    // Validate Phone Number
    if (phoneNumber) {
      if (!/^\d+$/.test(phoneNumber)) {
        setMessage({
          type: "error",
          text: "Phone number must contain only digits.",
        });
        setIsSaving(false);
        return;
      }
      if (!phoneNumber.startsWith("628")) {
        setMessage({
          type: "error",
          text: "Phone number must start with 628 (e.g., 628712345678). Do not use 08 or +62.",
        });
        setIsSaving(false);
        return;
      }
    }

    const updateData: UpdateUserData = {
      fullName,
      username,
      email,
      phoneNumber,
    };

    // Only add password if it's not empty
    if (password) {
      updateData.password = password;
    }

    try {
      const response = await authApi.updateUser(token, user.id, updateData);
      if (response.success) {
        setUser(response.data);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setPassword(""); // Clear password field
      } else {
        setMessage({
          type: "error",
          text: response.error?.message || "Failed to update profile",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0077FF]" />
      </div>
    );
  }

  return (
    <div className="relative isolate flex items-center justify-center animate-in fade-in-50 duration-500">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob bg-[#0077FF]/40"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-[#F1677C]/40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bg-[#FFB200]/40"></div>
      </div>

      <Card className="w-full max-w-2xl border-0 shadow-2xl shadow-slate-200/40 dark:shadow-black/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md ring-1 ring-white/50 dark:ring-white/5 rounded-3xl overflow-hidden">
        <CardHeader className="text-center border-b border-slate-100/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/30">
          <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-[#0077FF] to-[#0C426A] shadow-lg shadow-[#0077FF]/20 text-white mb-4 w-fit">
            <Settings className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0C426A] to-[#0077FF] dark:from-white dark:to-slate-300">
            Profile Settings
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 text-base mt-2">
            Update your personal information and security preferences.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-8 px-8">
            {message && (
              <Alert
                className={`border-0 rounded-xl shadow-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                <AlertDescription className="font-medium text-center">
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label
                  htmlFor="fullName"
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  Full Name
                </Label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0077FF] transition-colors" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="pl-10 h-11 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#0077FF] focus-visible:border-[#0077FF] transition-all hover:bg-white dark:hover:bg-slate-950"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="username"
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  Username
                </Label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0077FF] transition-colors" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="pl-10 h-11 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#0077FF] focus-visible:border-[#0077FF] transition-all hover:bg-white dark:hover:bg-slate-950"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="email"
                className="text-slate-700 dark:text-slate-300 font-medium"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0077FF] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="pl-10 h-11 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#0077FF] focus-visible:border-[#0077FF] transition-all hover:bg-white dark:hover:bg-slate-950"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="phoneNumber"
                className="text-slate-700 dark:text-slate-300 font-medium"
              >
                Phone Number
              </Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0077FF] transition-colors" />
                <Input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, ""); // Only allow digits

                    // Auto-replace 08 -> 628 (useful for pasting)
                    if (val.startsWith("08")) {
                      val = "628" + val.substring(2);
                    }

                    // Enforce that it must start with 628 sequence
                    if (val.length > 0) {
                      const prefix = "628";
                      let isValid = true;

                      if (val.length < 3) {
                        if (!prefix.startsWith(val)) isValid = false;
                      } else {
                        if (!val.startsWith("628")) isValid = false;
                      }

                      if (!isValid) {
                        setMessage({
                          type: "error",
                          text: "Invalid input. Phone number must start with 628.",
                        });
                        return;
                      }
                    }

                    if (
                      message?.text.includes("Phone number must start with 628")
                    ) {
                      setMessage(null);
                    }

                    setPhoneNumber(val);
                  }}
                  placeholder="628712345678"
                  className="pl-10 h-11 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#0077FF] focus-visible:border-[#0077FF] transition-all hover:bg-white dark:hover:bg-slate-950"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Format: 628xxxxxxxxxx
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Label
                htmlFor="password"
                className="text-slate-700 dark:text-slate-300 font-medium"
              >
                New Password{" "}
                <span className="text-slate-400 font-normal ml-1">
                  (Optional)
                </span>
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0077FF] transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="pl-10 pr-10 h-11 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#0077FF] focus-visible:border-[#0077FF] transition-all hover:bg-white dark:hover:bg-slate-950"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end pt-4 pb-8 px-8">
            <Button
              type="submit"
              disabled={isSaving}
              size="lg"
              className="w-full sm:w-auto bg-[#0077FF] hover:bg-[#0077FF]/90 text-white shadow-lg shadow-[#0077FF]/25 dark:shadow-[#0077FF]/10 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl font-medium"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
