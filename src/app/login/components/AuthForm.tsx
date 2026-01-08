"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  isLogin: boolean;
  isDark: boolean;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  // Form State Handlers
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  fullName: string;
  setFullName: (val: string) => void;
  signupUsername: string;
  setSignupUsername: (val: string) => void;
  signupEmail: string;
  setSignupEmail: (val: string) => void;
  // Toggle Handlers
  setIsLogin: (val: boolean) => void;
  setError: (val: string | null) => void;
}

export function AuthForm({
  isLogin,
  isDark,
  isLoading,
  error,
  handleSubmit,
  identifier,
  setIdentifier,
  password,
  setPassword,
  fullName,
  setFullName,
  signupUsername,
  setSignupUsername,
  signupEmail,
  setSignupEmail,
  setIsLogin,
  setError,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
          className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {isLogin ? "Don't have an account? " : "Already part of the team? "}
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
  );
}
