"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Clock, ShieldAlert } from "lucide-react";

export default function WaitingApprovalPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  // Use the same particle/blob background as login for consistency
  const [particles, setParticles] = useState<number[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 30 }, (_, i) => i));
  }, []);

  const handleLogout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_role");
    router.push("/login");
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

      {/* Particles */}
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
        {/* Branding Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl shadow-lg ${
                  isDark
                    ? "bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-indigo-500/30"
                    : "bg-white shadow-indigo-200 text-indigo-600"
                }`}
              >
                <Clock
                  className={`w-6 h-6 ${
                    isDark ? "text-white" : "text-indigo-600"
                  }`}
                />
              </div>
              <h1
                className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-400"
                    : "from-indigo-600 to-purple-600"
                }`}
              >
                Geo AIT
              </h1>
            </div>
          </div>
        </div>

        {/* Glass Card */}
        <div
          className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl ${
            isDark
              ? "bg-white/10 border-white/20 shadow-black/20"
              : "bg-white/70 border-white/50 shadow-indigo-100/50"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <ShieldAlert className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Access Pending
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Your account has been created successfully, but you don't have
                an assigned role yet.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please wait until an administrator assigns you a role. You will
                gain access to the dashboard once approved.
              </p>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
