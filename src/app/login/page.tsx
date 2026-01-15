"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";
import { organizationApi } from "@/lib/organization-api";
import { setTokens } from "@/lib/token-utils";

import { BackgroundEffects } from "./components/BackgroundEffects";
import { LoginHeader } from "./components/LoginHeader";
import { AuthForm } from "./components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const organizationId =
    process.env.NEXT_PUBLIC_ORGANIZATION_ID || "KELGsLB6canc9jAX7035G";

  const handleAuthSuccess = async (
    accessToken: string,
    refreshToken: string,
    expiresIn?: number
  ) => {
    // Store tokens using utility function
    setTokens(accessToken, refreshToken, expiresIn || 43200);

    try {
      const userResponse = await authApi.getMe(accessToken);
      if (userResponse.success) {
        localStorage.setItem("user_data", JSON.stringify(userResponse.data));
        const userData = userResponse.data as any;
        const orgs = userData.organizations || [];
        const currentOrg =
          orgs.find((o: any) => o.id === organizationId) || orgs[0];
        if (currentOrg && currentOrg.role) {
          localStorage.setItem("user_role", currentOrg.role);
          if (currentOrg.role === "Unassigned") {
            router.push("/waiting-approval");
            return;
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch user data on auth success", e);
    }
    router.push("/");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const isEmail = identifier.includes("@");
        const credentials = {
          password,
          organizationId,
          ...(isEmail ? { email: identifier } : { username: identifier }),
        };

        const response = await authApi.signIn(credentials);

        if (response.success) {
          await handleAuthSuccess(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.expiresIn
          );
        } else {
          setError(response.error?.message || "Login failed");
        }
      } else {
        const response = await authApi.signUp({
          email: signupEmail,
          password,
          fullName,
          username: signupUsername,
        });

        if (response.success) {
          try {
            const userData = response.data.user as any;
            const newUserId = userData.user?.id || userData.id;

            if (newUserId) {
              await organizationApi.addOrganizationUser("", organizationId, {
                userId: newUserId,
                role: "Unassigned",
              });
            }

            // Store tokens using utility function
            setTokens(
              response.data.accessToken,
              response.data.refreshToken,
              response.data.expiresIn || 43200
            );
            localStorage.setItem("user_data", JSON.stringify(userData));
            localStorage.setItem("user_role", "Unassigned");

            router.push("/waiting-approval");
            return;
          } catch (orgError) {
            console.error(
              "Failed to add user to organization automatically",
              orgError
            );
            setError(
              "Account created but failed to join organization. Please contact admin."
            );
          }
        } else {
          setError(response.error?.message || "Signup failed");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-700 ${
        isDark ? "bg-slate-900" : "bg-indigo-50"
      }`}
    >
      <BackgroundEffects isDark={isDark} />

      <div className="relative z-10 w-full max-w-md px-4">
        <LoginHeader isDark={isDark} setIsDark={setIsDark} isLogin={isLogin} />

        <AuthForm
          isLogin={isLogin}
          isDark={isDark}
          isLoading={isLoading}
          error={error}
          handleSubmit={handleSubmit}
          identifier={identifier}
          setIdentifier={setIdentifier}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
          signupUsername={signupUsername}
          setSignupUsername={setSignupUsername}
          signupEmail={signupEmail}
          setSignupEmail={setSignupEmail}
          setIsLogin={setIsLogin}
          setError={setError}
        />
      </div>
    </div>
  );
}
