"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, Sparkles, Moon, Sun } from "lucide-react";

// Simple Particle Component
const Particle = ({ isDark }: { isDark: boolean }) => {
  const style = {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    animationDelay: `${Math.random() * 5}s`,
  };
  return (
    <div
      className={`absolute w-1 h-1 rounded-full animate-float opacity-50 ${
        isDark ? "bg-white" : "bg-indigo-600"
      }`}
      style={style}
    />
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default to Light Mode

  // Form States
  const [identifier, setIdentifier] = useState(""); // Email or Username
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  // Separate states for signup since we need specific email and username
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const organizationId = "KELGsLB6canc9jAX7035G"; // Default Org ID

  // Simple particle generation
  const [particles, setParticles] = useState<number[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 30 }, (_, i) => i));
  }, []);

  // Handle Auth Success
  const handleAuthSuccess = async (accessToken: string) => {
    document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
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
        // LOGIN FLOW: Determine if identifier is email or username
        const isEmail = identifier.includes("@");
        const credentials = {
          password,
          organizationId,
          ...(isEmail ? { email: identifier } : { username: identifier }),
        };

        const response = await authApi.signIn(credentials);

        if (response.success) {
          await handleAuthSuccess(response.data.accessToken);
        } else {
          setError(response.error?.message || "Login failed");
        }
      } else {
        // SIGNUP FLOW: Requires explicit email and username
        const response = await authApi.signUp({
          email: signupEmail,
          password,
          fullName,
          username: signupUsername,
        });

        if (response.success) {
          await handleAuthSuccess(response.data.accessToken);
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
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div
          className={`absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob transition-colors duration-700 ${
            isDark ? "bg-purple-500" : "bg-purple-300"
          }`}
        ></div>
        <div
          className={`absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 transition-colors duration-700 ${
            isDark ? "bg-indigo-500" : "bg-blue-300"
          }`}
        ></div>
        <div
          className={`absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 transition-colors duration-700 ${
            isDark ? "bg-pink-500" : "bg-pink-300"
          }`}
        ></div>
        <div
          className={`absolute inset-0 backdrop-blur-[1px] ${
            isDark ? "bg-slate-900/50" : "bg-white/30"
          }`}
        />
      </div>

      {/* Particles - Moved after background overlay for better visibility */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse ${
              isDark ? "bg-white opacity-40" : "bg-indigo-400 opacity-20"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Branding Header with Theme Toggle */}
        <div className="text-center mb-8 space-y-2">
          {/* Clicable Logo Area */}
          <div
            className="group flex flex-col items-center justify-center gap-2 mb-4 cursor-pointer select-none"
            onClick={() => setIsDark(!isDark)}
            title="Click to switch theme"
          >
            <div className="flex items-center gap-3 transition-transform duration-300 group-hover:scale-105">
              <div
                className={`p-3 rounded-2xl shadow-lg transition-all duration-500 ${
                  isDark
                    ? "bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-indigo-500/30"
                    : "bg-white shadow-indigo-200 text-indigo-600"
                }`}
              >
                <Sparkles
                  className={`w-6 h-6 ${
                    isDark ? "text-white" : "text-indigo-600"
                  }`}
                />
              </div>
              <h1
                className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r transition-all duration-500 ${
                  isDark
                    ? "from-white to-gray-400"
                    : "from-indigo-600 to-purple-600"
                }`}
              >
                Geo AIT
              </h1>
            </div>

            {/* Visual Indicator for Theme Switch */}
            <div
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                isDark
                  ? "bg-white/10 text-slate-300 group-hover:bg-white/20"
                  : "bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100"
              }`}
            >
              {isDark ? (
                <Moon className="w-3 h-3" />
              ) : (
                <Sun className="w-3 h-3" />
              )}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-1 group-hover:ml-0 w-0 group-hover:w-auto overflow-hidden text-[10px] uppercase tracking-wider">
                Switch Theme
              </span>
            </div>
          </div>

          <h2
            className={`text-2xl font-semibold tracking-tight transition-colors duration-500 ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            {isLogin ? "Welcome Back!" : "Join the Team"}
          </h2>
          <p
            className={`text-sm transition-colors duration-500 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {isLogin
              ? "Sign in to manage your tasks effectively"
              : "Create your account to start collaborating"}
          </p>
        </div>

        {/* Glass Card */}
        <div
          className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-all duration-700 ${
            isDark
              ? "bg-white/10 border-white/20 shadow-black/20"
              : "bg-white/70 border-white/50 shadow-indigo-100/50"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-500/10 border-red-500/50 text-red-200"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isLogin ? (
              // SIGNUP FIELDS
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className={isDark ? "text-slate-200" : "text-slate-700"}
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`transition-colors duration-500 ${
                      isDark
                        ? "bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
                    }`}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="signupUsername"
                    className={isDark ? "text-slate-200" : "text-slate-700"}
                  >
                    Username
                  </Label>
                  <Input
                    id="signupUsername"
                    placeholder="johndoe"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className={`transition-colors duration-500 ${
                      isDark
                        ? "bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
                    }`}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="signupEmail"
                    className={isDark ? "text-slate-200" : "text-slate-700"}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="name@geoait.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={`transition-colors duration-500 ${
                      isDark
                        ? "bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
                    }`}
                    required
                  />
                </div>
              </div>
            ) : (
              // LOGIN FIELDS
              <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-300">
                <Label
                  htmlFor="identifier"
                  className={isDark ? "text-slate-200" : "text-slate-700"}
                >
                  Email or Username
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="name@geoait.com or johndoe"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`transition-colors duration-500 ${
                    isDark
                      ? "bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500"
                      : "bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
                  }`}
                  required
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className={isDark ? "text-slate-200" : "text-slate-700"}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 transition-colors duration-500 ${
                      isDark
                        ? "bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500"
                        : "bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
                    }`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${
                      isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-400 hover:text-indigo-600"
                    }`}
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
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02]"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {isLogin
                ? "Don't have an account? "
                : "Already part of the team? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-indigo-500 hover:text-indigo-600 font-semibold hover:underline transition-colors ml-1"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
