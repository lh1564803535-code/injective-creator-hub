"use client";

import { Crown, Award, Star } from "lucide-react";

// ---------------------------------------------------------------------------
// Original Badge (preserved for backward compatibility)
// ---------------------------------------------------------------------------

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  children: React.ReactNode;
}

const variantClasses = {
  default: "bg-white/[0.06] text-gray-400",
  success: "bg-emerald-500/10 text-emerald-400",
  warning: "bg-amber-500/10 text-amber-400",
  error: "bg-red-500/10 text-red-400",
  info: "bg-cyan-500/10 text-cyan-400",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
};

export function Badge({ variant = "default", size = "sm", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Extended badges: Status / Tier / Count
// ---------------------------------------------------------------------------

type StatusVariant = "success" | "warning" | "error" | "info";
type TierVariant = "gold" | "silver" | "bronze";
type Shape = "rounded" | "square";

// --- Status Badge ---

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  shape?: Shape;
  pulse?: boolean;
  className?: string;
}

const statusStyles: Record<StatusVariant, { bg: string; text: string; dot: string }> = {
  success: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  error:   { bg: "bg-red-500/10",   text: "text-red-400",   dot: "bg-red-400" },
  info:    { bg: "bg-cyan-500/10",   text: "text-cyan-400",  dot: "bg-cyan-400" },
};

export function StatusBadge({ variant, label, shape = "rounded", pulse = false, className = "" }: StatusBadgeProps) {
  const s = statusStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium ${
        shape === "rounded" ? "rounded-full" : "rounded-md"
      } ${s.bg} ${s.text} ${className}`}
    >
      <span className={`relative flex h-1.5 w-1.5 ${s.dot}`}>
        {pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${s.dot}`} />
        )}
      </span>
      {label}
    </span>
  );
}

// --- Tier Badge (Gold / Silver / Bronze) ---

interface TierBadgeProps {
  tier: TierVariant;
  label?: string;
  shape?: Shape;
  className?: string;
}

const tierStyles: Record<TierVariant, { bg: string; text: string; icon: typeof Crown }> = {
  gold:   { bg: "bg-amber-500/15",  text: "text-amber-400",  icon: Crown },
  silver: { bg: "bg-gray-400/15",   text: "text-gray-300",   icon: Award },
  bronze: { bg: "bg-orange-500/15", text: "text-orange-400", icon: Star },
};

export function TierBadge({ tier, label, shape = "rounded", className = "" }: TierBadgeProps) {
  const t = tierStyles[tier];
  const Icon = t.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium ${
        shape === "rounded" ? "rounded-full" : "rounded-md"
      } ${t.bg} ${t.text} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label ?? tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

// --- Count Badge ---

interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: StatusVariant | "default";
  shape?: Shape;
  className?: string;
}

const countVariantStyles: Record<StatusVariant | "default", { bg: string; text: string }> = {
  default: { bg: "bg-white/[0.08]",    text: "text-gray-300" },
  success: { bg: "bg-emerald-500/15",  text: "text-emerald-400" },
  warning: { bg: "bg-amber-500/15",    text: "text-amber-400" },
  error:   { bg: "bg-red-500/15",      text: "text-red-400" },
  info:    { bg: "bg-cyan-500/15",     text: "text-cyan-400" },
};

export function CountBadge({ count, max, variant = "default", shape = "rounded", className = "" }: CountBadgeProps) {
  const v = countVariantStyles[variant];
  const display = max !== undefined && count > max ? `${max}+` : String(count);

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold leading-none ${
        shape === "rounded" ? "rounded-full min-w-[1.25rem]" : "rounded-md min-w-[1.25rem]"
      } ${v.bg} ${v.text} ${className}`}
    >
      {display}
    </span>
  );
}
