"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { getLocale, setLocale, type Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const [locale, setCurrentLocale] = useState<Locale>("zh");

  useEffect(() => {
    setCurrentLocale(getLocale());
  }, []);

  const toggle = () => {
    const next = locale === "en" ? "zh" : "en";
    setLocale(next);
    setCurrentLocale(next);
    // Force re-render of the page
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{locale === "en" ? "中文" : "EN"}</span>
    </button>
  );
}
