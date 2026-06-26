"use client";

import { Zap, Vote, CheckCircle2, Palette, Music, Gamepad2, Smile } from "lucide-react";

// ---------------------------------------------------------------------------
// Campaign type tag
// ---------------------------------------------------------------------------

type CampaignType = "illustration" | "music" | "gamefi" | "meme";

interface CampaignTypeTagProps {
  type: CampaignType;
  className?: string;
}

const campaignTypeStyles: Record<
  CampaignType,
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
  meme: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    icon: Smile,
    label: "Meme",
  },
};

export function CampaignTypeTag({ type, className = "" }: CampaignTypeTagProps) {
  const s = campaignTypeStyles[type];
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
// Campaign status tag
// ---------------------------------------------------------------------------

type CampaignStatus = "active" | "voting" | "ended";

interface CampaignStatusTagProps {
  status: CampaignStatus;
  className?: string;
}

const campaignStatusStyles: Record<
  CampaignStatus,
  { bg: string; text: string; border: string; dot: string; icon: typeof Zap; label: string }
> = {
  active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    icon: Zap,
    label: "Live",
  },
  voting: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
    icon: Vote,
    label: "Voting",
  },
  ended: {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/20",
    dot: "bg-gray-500",
    icon: CheckCircle2,
    label: "Ended",
  },
};

export function CampaignStatusTag({ status, className = "" }: CampaignStatusTagProps) {
  const s = campaignStatusStyles[status];
  const Icon = s.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text} ${s.border} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}
