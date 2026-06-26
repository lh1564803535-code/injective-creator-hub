"use client";

import { Sparkles, Flame, Crown, Palette, Music, Gamepad2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Creator level tag
// ---------------------------------------------------------------------------

type CreatorLevel = "newcomer" | "pro" | "legend";

interface CreatorLevelTagProps {
  level: CreatorLevel;
  className?: string;
}

const creatorLevelStyles: Record<
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

export function CreatorLevelTag({ level, className = "" }: CreatorLevelTagProps) {
  const s = creatorLevelStyles[level];
  const Icon = s.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text} ${s.border} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Creator skill tag
// ---------------------------------------------------------------------------

type CreatorSkill = "illustration" | "music" | "gamefi";

interface CreatorSkillTagProps {
  skill: CreatorSkill;
  className?: string;
}

const creatorSkillStyles: Record<
  CreatorSkill,
  { bg: string; text: string; border: string; icon: typeof Palette; label: string }
> = {
  illustration: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    icon: Palette,
    label: "Illustration",
  },
  music: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    icon: Music,
    label: "Music",
  },
  gamefi: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    icon: Gamepad2,
    label: "GameFi",
  },
};

export function CreatorSkillTag({ skill, className = "" }: CreatorSkillTagProps) {
  const s = creatorSkillStyles[skill];
  const Icon = s.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text} ${s.border} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}
