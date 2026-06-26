"use client";

import { Zap, Vote, CheckCircle2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Campaign status badge
// ---------------------------------------------------------------------------

type CampaignStatus = "active" | "voting" | "ended";

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

const campaignStatusStyles: Record<
  CampaignStatus,
  { bg: string; text: string; border: string; dot: string; label: string; icon: typeof Zap }
> = {
  active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    label: "Live",
    icon: Zap,
  },
  voting: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
    label: "Voting",
    icon: Vote,
  },
  ended: {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/20",
    dot: "bg-gray-500",
    label: "Ended",
    icon: CheckCircle2,
  },
};

export function CampaignStatusBadge({ status, className = "" }: CampaignStatusBadgeProps) {
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

// ---------------------------------------------------------------------------
// Reward tier badge
// ---------------------------------------------------------------------------

type RewardTier = "mega" | "premium" | "standard" | "starter";

interface RewardTierBadgeProps {
  tier: RewardTier;
  className?: string;
}

const rewardTierStyles: Record<
  RewardTier,
  { bg: string; text: string; border: string; label: string }
> = {
  mega: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    label: "Mega",
  },
  premium: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    label: "Premium",
  },
  standard: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    label: "Standard",
  },
  starter: {
    bg: "bg-white/[0.06]",
    text: "text-gray-400",
    border: "border-white/[0.08]",
    label: "Starter",
  },
};

export function RewardTierBadge({ tier, className = "" }: RewardTierBadgeProps) {
  const t = rewardTierStyles[tier];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${t.bg} ${t.text} ${t.border} ${className}`}
    >
      {t.label}
    </span>
  );
}
