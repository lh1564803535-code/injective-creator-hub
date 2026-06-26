"use client";

import { CheckCircle, Shield } from "lucide-react";

interface VerifiedBadgeProps {
  type?: "creator" | "project" | "contract";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const typeConfig = {
  creator: { label: "Verified Creator", color: "text-cyan-400 bg-cyan-500/10" },
  project: { label: "Verified Project", color: "text-emerald-400 bg-emerald-500/10" },
  contract: { label: "Verified Contract", color: "text-purple-400 bg-purple-500/10" },
};

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-[9px]",
  md: "px-2 py-0.5 text-[10px]",
  lg: "px-2.5 py-1 text-xs",
};

export function VerifiedBadge({
  type = "creator",
  size = "sm",
  className = "",
}: VerifiedBadgeProps) {
  const config = typeConfig[type];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses[size]} ${className}`}>
      <CheckCircle className="h-3 w-3" />
      {config.label}
    </span>
  );
}
