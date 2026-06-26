"use client";

import { Lock, Eye, EyeOff } from "lucide-react";

interface PrivacyBadgeProps {
  level: "public" | "private" | "encrypted";
  className?: string;
}

const levelConfig = {
  public: { icon: Eye, color: "text-gray-400 bg-gray-500/10", label: "Public" },
  private: { icon: EyeOff, color: "text-amber-400 bg-amber-500/10", label: "Private" },
  encrypted: { icon: Lock, color: "text-emerald-400 bg-emerald-500/10", label: "Encrypted" },
};

export function PrivacyBadge({ level, className = "" }: PrivacyBadgeProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.color} ${className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
