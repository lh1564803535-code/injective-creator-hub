"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

const STORAGE_KEY = "injective-creator-hub-theme";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const toggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Avoid hydration mismatch — render a neutral placeholder until mounted
  if (!mounted) {
    return (
      <button
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] transition-colors"
        aria-label="Toggle theme"
      >
        <span className="h-5 w-5" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
        isDark
          ? "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
          : "border-amber-300/30 bg-amber-50/10 hover:bg-amber-50/20"
      }`}
    >
      {/* Sun icon — visible in dark mode, rotates out in light mode */}
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 text-amber-400 opacity-100"
            : "rotate-90 scale-0 text-amber-500 opacity-0"
        }`}
      />

      {/* Moon icon — visible in light mode, rotates out in dark mode */}
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark
            ? "-rotate-90 scale-0 text-cyan-400 opacity-0"
            : "rotate-0 scale-100 text-indigo-400 opacity-100"
        }`}
      />
    </button>
  );
}
