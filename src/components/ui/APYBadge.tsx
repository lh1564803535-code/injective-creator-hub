"use client";

import { TrendingUp } from "lucide-react";

interface APYBadgeProps {
  apy: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export function APYBadge({
  apy,
  size = "md",
  showIcon = true,
  className = "",
}: APYBadgeProps) {
  const color =
    apy >= 20
      ? "text-emerald-400 bg-emerald-500/10"
      : apy >= 10
      ? "text-cyan-400 bg-cyan-500/10"
      : "text-gray-400 bg-gray-500/10";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${color} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <TrendingUp className="h-3 w-3" />}
      {apy}% APY
    </span>
  );
}
