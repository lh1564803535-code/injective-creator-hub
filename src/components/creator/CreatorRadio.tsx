"use client";

import { useState } from "react";
import { RadioGroup } from "@/components/ui/Radio";
import { Globe, Palette, Bell } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreatorRadioProps {
  onLanguageChange?: (value: string) => void;
  onThemeChange?: (value: string) => void;
  onNotificationChange?: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const languageOptions = [
  { value: "en", label: "English" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "es", label: "Spanish" },
];

const themeOptions = [
  {
    value: "dark",
    label: "Dark",
    description: "Easy on the eyes, ideal for long sessions",
  },
  {
    value: "light",
    label: "Light",
    description: "Clean and bright for daytime use",
  },
  {
    value: "system",
    label: "System",
    description: "Follow your operating system preference",
  },
];

const notificationOptions = [
  {
    value: "realtime",
    label: "Real-time",
    description: "Get notified immediately for every update",
  },
  {
    value: "daily",
    label: "Daily Digest",
    description: "Receive a summary once per day",
  },
  {
    value: "weekly",
    label: "Weekly Summary",
    description: "A weekly roundup of your campaign activity",
  },
  {
    value: "none",
    label: "Disabled",
    description: "Turn off all notifications",
  },
];

// ---------------------------------------------------------------------------
// CreatorRadio
// ---------------------------------------------------------------------------

export function CreatorRadio({
  onLanguageChange,
  onThemeChange,
  onNotificationChange,
}: CreatorRadioProps) {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [notification, setNotification] = useState("realtime");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    onLanguageChange?.(value);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    onThemeChange?.(value);
  };

  const handleNotificationChange = (value: string) => {
    setNotification(value);
    onNotificationChange?.(value);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Display language */}
      <div className="rounded-xl bg-[#1a1a1a] p-5 ring-1 ring-white/10">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Display Language</h3>
        </div>
        <RadioGroup
          name="display-language"
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />
      </div>

      {/* Theme preference */}
      <div className="rounded-xl bg-[#1a1a1a] p-5 ring-1 ring-white/10">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Theme Preference</h3>
        </div>
        <RadioGroup
          name="theme-preference"
          options={themeOptions}
          value={theme}
          onChange={handleThemeChange}
        />
      </div>

      {/* Notification frequency */}
      <div className="rounded-xl bg-[#1a1a1a] p-5 ring-1 ring-white/10">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">
            Notification Frequency
          </h3>
        </div>
        <RadioGroup
          name="notification-frequency"
          options={notificationOptions}
          value={notification}
          onChange={handleNotificationChange}
        />
      </div>
    </div>
  );
}
