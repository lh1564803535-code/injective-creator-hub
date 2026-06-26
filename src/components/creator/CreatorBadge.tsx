"use client";

import { Crown, Trophy, Medal, ShieldCheck, Sparkles, Flame, BadgeCheck } from "lucide-react";

// ---------------------------------------------------------------------------
// Rank badge (Top 1 / Top 3 / Top 10)
// ---------------------------------------------------------------------------

type RankTier = 1 | 3 | 10;

interface RankBadgeProps {
  rank: number;
  className?: string;
}

const rankStyles: Record<
  RankTier,
  { bg: string; text: string; ring: string; icon: typeof Crown; label: string }
> = {
  1: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    ring: "ring-amber-400/30",
    icon: Crown,
    label: "Top 1",
  },
  3: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    ring: "ring-orange-400/30",
    icon: Trophy,
    label: "Top 3",
  },
  10: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    ring: "ring-cyan-400/30",
    icon: Medal,
    label: "Top 10",
  },
};

export function RankBadge({ rank, className = "" }: RankBadgeProps) {
  const tier: RankTier = rank === 1 ? 1 : rank <= 3 ? 3 : 10;
  const s = rankStyles[tier];
  const Icon = s.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-2.5 py-1 text-xs font-semibold ring-1 ${s.bg} ${s.text} ${s.ring} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Level badge (Newcomer / Pro / Legend)
// ---------------------------------------------------------------------------

type CreatorLevel = "newcomer" | "pro" | "legend";

interface LevelBadgeProps {
  level: CreatorLevel;
  className?: string;
}

const levelStyles: Record<
  CreatorLevel,
  { bg: string; text: string; border: string; icon: typeof Sparkles; label: string }
> = {
  newcomer: {
    bg: "bg-white/[0.06]",
    text: "text-gray-400",
    border: "border-white/[0.08]",
    icon: Sparkles,
    label: "Newcomer",
  },
  pro: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    icon: Flame,
    label: "Pro",
  },
  legend: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    icon: Crown,
    label: "Legend",
  },
};

export function LevelBadge({ level, className = "" }: LevelBadgeProps) {
  const s = levelStyles[level];
  const Icon = s.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text} ${s.border} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Verified badge
// ---------------------------------------------------------------------------

interface VerifiedBadgeProps {
  label?: string;
  className?: string;
}

export function VerifiedBadge({ label = "Verified", className = "" }: VerifiedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 ${className}`}
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
