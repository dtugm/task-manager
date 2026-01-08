"use client";

import { useState, useEffect } from "react";

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

export function BackgroundEffects({ isDark }: { isDark: boolean }) {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 30 }, (_, i) => i));
  }, []);

  return (
    <>
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
          <Particle key={i} isDark={isDark} />
        ))}
      </div>
    </>
  );
}
