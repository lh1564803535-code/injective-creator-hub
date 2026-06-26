"use client";

import { Shield, Star, Zap, Crown } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreatorAvatarProps {
  /** Injective wallet address – used to derive gradient colours */
  address: string;
  /** Optional image URL; overrides the gradient avatar */
  src?: string;
  /** Alt text / creator name */
  alt?: string;
  /** Creator level (1-5); controls badge colour */
  level?: number;
  /** Whether the creator is currently online */
  online?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derive two hues from an address for a unique gradient */
function gradientFromAddress(address: string) {
  const h1 = parseInt(address.slice(2, 5), 16) % 360;
  const h2 = (h1 + 120) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70%, 50%), hsl(${h2}, 60%, 40%))`;
}

/** Map level to badge config */
function levelBadge(level: number) {
  if (level >= 5)
    return {
      icon: Crown,
      bg: "bg-amber-500",
      ring: "ring-amber-400/40",
      label: "L5",
    };
  if (level >= 4)
    return {
      icon: Zap,
      bg: "bg-purple-500",
      ring: "ring-purple-400/40",
      label: "L4",
    };
  if (level >= 3)
    return {
      icon: Star,
      bg: "bg-cyan-500",
      ring: "ring-cyan-400/40",
      label: "L3",
    };
  if (level >= 2)
    return {
      icon: Shield,
      bg: "bg-emerald-500",
      ring: "ring-emerald-400/40",
      label: "L2",
    };
  return {
    icon: Shield,
    bg: "bg-gray-500",
    ring: "ring-gray-400/40",
    label: "L1",
  };
}

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: {
    container: "h-9 w-9",
    text: "text-[10px]",
    badge: "h-4 w-4",
    badgeIcon: "h-2.5 w-2.5",
    badgeOffset: "-bottom-0.5 -right-0.5",
    onlineDot: "h-2 w-2",
    onlineOffset: "-top-0.5 -right-0.5",
  },
  md: {
    container: "h-11 w-11",
    text: "text-xs",
    badge: "h-5 w-5",
    badgeIcon: "h-3 w-3",
    badgeOffset: "-bottom-0.5 -right-0.5",
    onlineDot: "h-2.5 w-2.5",
    onlineOffset: "-top-0.5 -right-0.5",
  },
  lg: {
    container: "h-14 w-14",
    text: "text-sm",
    badge: "h-6 w-6",
    badgeIcon: "h-3.5 w-3.5",
    badgeOffset: "-bottom-1 -right-1",
    onlineDot: "h-3 w-3",
    onlineOffset: "-top-0.5 -right-0.5",
  },
  xl: {
    container: "h-20 w-20",
    text: "text-lg",
    badge: "h-7 w-7",
    badgeIcon: "h-4 w-4",
    badgeOffset: "-bottom-1 -right-1",
    onlineDot: "h-3.5 w-3.5",
    onlineOffset: "-top-0.5 -right-0.5",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorAvatar({
  address,
  src,
  alt,
  level,
  online,
  size = "md",
}: CreatorAvatarProps) {
  const s = sizeMap[size];
  const badge = level != null ? levelBadge(level) : null;
  const BadgeIcon = badge?.icon;

  return (
    <div className="relative inline-flex shrink-0">
      {/* Main avatar */}
      {src ? (
        <img
          src={src}
          alt={alt || address}
          className={`rounded-full object-cover ring-2 ring-white/[0.08] ${s.container}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-full font-bold text-white ring-2 ring-white/[0.08] ${s.container} ${s.text}`}
          style={{ background: gradientFromAddress(address) }}
        >
          {address.slice(2, 4).toUpperCase()}
        </div>
      )}

      {/* Level badge */}
      {badge && BadgeIcon && (
        <div
          className={`absolute flex items-center justify-center rounded-full ${badge.bg} ${s.badge} ${s.badgeOffset} ring-2 ${badge.ring} border border-black/20`}
          title={badge.label}
        >
          <BadgeIcon className={`${s.badgeIcon} text-white`} />
        </div>
      )}

      {/* Online indicator */}
      {online && (
        <span
          className={`absolute block rounded-full bg-emerald-400 ring-2 ring-gray-900 ${s.onlineDot} ${s.onlineOffset}`}
        />
      )}
    </div>
  );
}
