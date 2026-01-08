"use client";

import { Sparkles, Moon, Sun } from "lucide-react";

interface LoginHeaderProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  isLogin: boolean;
}

export function LoginHeader({ isDark, setIsDark, isLogin }: LoginHeaderProps) {
  return (
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
              className={`w-6 h-6 ${isDark ? "text-white" : "text-indigo-600"}`}
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
          {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
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
  );
}
