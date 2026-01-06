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
import { Loader2 } from "lucide-react";
// Actually I don't see use-toast in the previous file list, I'll stick to Alert for now or check if it exists in next step.
// To be safe I'll use Alert for success too.

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
  const [password, setPassword] = useState("");

  const getToken = () => {
    // Basic cookie parsing
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login"); // Middleware should handle this but double check
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

    const updateData: UpdateUserData = {
      fullName,
      username,
      email,
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
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl text-card-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {message && (
              <Alert
                variant={message.type === "success" ? "default" : "destructive"}
                className={
                  message.type === "success"
                    ? "border-green-500 text-green-500"
                    : ""
                }
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
