"use client";

import { useLanguage } from "@/contexts/language-context";

interface WelcomeBannerProps {
  user?: {
    fullName?: string;
    email?: string;
  };
  stats?: {
    myTasksCount: number;
  };
}

export function WelcomeBanner({ user, stats }: WelcomeBannerProps) {
  const { t } = useLanguage();
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const name = user?.fullName || user?.email?.split("@")[0] || "User";

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#0077FF] to-[#0C426A] p-10 text-white shadow-xl shadow-[#0077FF]/25 relative overflow-hidden mb-6 group transition-all duration-300 hover:scale-[1.01]">
      {/* Abstract Shapes for visual interest */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-[#F1677C]/30 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {t.welcome}, {name}! 👋
        </h1>
        <p className="text-blue-100 text-lg font-medium opacity-90">{date}</p>
        <p className="mt-4 text-white max-w-xl leading-relaxed opacity-90 backdrop-blur-sm bg-black/5 p-3 rounded-xl border border-white/10">
          You have{" "}
          <span className="font-bold text-[#FFB200]">
            {stats?.myTasksCount || 0} active tasks
          </span>{" "}
          assigned to you. {t.letsDoIt}!
        </p>
      </div>
    </div>
  );
}
