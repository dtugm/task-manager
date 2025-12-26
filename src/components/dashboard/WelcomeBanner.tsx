"use client";

import { useLanguage } from "@/contexts/language-context";

export function WelcomeBanner() {
  const { t } = useLanguage();
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-10 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden mb-6">
      {/* Abstract Shapes for visual interest */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {t.welcome}, John Doe! 👋
        </h1>
        <p className="text-indigo-100 text-lg font-medium opacity-90">{date}</p>
        <p className="mt-4 text-indigo-50 max-w-xl leading-relaxed opacity-80">
          You have <span className="font-bold text-white">4 active tasks</span>{" "}
          and <span className="font-bold text-white">2 pending reviews</span>{" "}
          today. {t.letsDoIt}!
        </p>
      </div>
    </div>
  );
}
