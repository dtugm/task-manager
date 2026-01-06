"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/auth-api";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const organizationId = "KELGsLB6canc9jAX7035G";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.signIn({
        email,
        password,
        organizationId,
      });

      if (response.success) {
        // Set cookie
        // Note: For production, consider using httpOnly cookies via a server action or API route wrapper
        // But since the API returns the token in the body, we must set it here or pass it to a server action.
        // For this task, we'll set it in the browser.
        document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=604800; SameSite=Lax`; // 7 days

        // Fetch and cache user data
        try {
          const userResponse = await authApi.getMe(response.data.accessToken);
          if (userResponse.success) {
            localStorage.setItem(
              "user_data",
              JSON.stringify(userResponse.data)
            );

            // Extract and save role for the current organization
            // The response data matches the structure provided by user:
            // { user: {...}, organizations: [{ id, role, ... }], ... }
            const userData = userResponse.data as any; // Cast to any to handle flexible structure
            const orgs = userData.organizations || [];
            const currentOrg =
              orgs.find((o: any) => o.id === organizationId) || orgs[0];

            if (currentOrg && currentOrg.role) {
              localStorage.setItem("user_role", currentOrg.role);
            }
          } else {
            // Fallback
            localStorage.setItem(
              "user_data",
              JSON.stringify({ user: response.data.user })
            );
          }
        } catch (e) {
          console.error("Failed to fetch user data on login", e);
        }

        router.push("/");
        router.refresh();
      } else {
        setError(response.error?.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Sign in to your account
          </CardTitle>
          <CardDescription>
            Enter your email and password below to enter your dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
