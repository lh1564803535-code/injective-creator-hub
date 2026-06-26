"use client";

import Link from "next/link";
import { Clock, Users, Award, ArrowUpRight } from "lucide-react";
import {
  formatUSDC,
  getTimeRemaining,
  getCampaignStatus,
} from "@/lib/injective";
import { SocialProof, type SocialMetrics } from "@/components/ui/SocialProof";
import type { Campaign } from "@/types/creator-settlement";

// Mock social metrics per campaign (seeded by campaign ID)
const SOCIAL_METRICS: Record<number, SocialMetrics> = {
  1: { views: 12400, shares: 890, reactions: 3200, trendingScore: 92, farcasterFid: 12345, lensHandle: "creator-hub" },
  2: { views: 8700, shares: 540, reactions: 2100, trendingScore: 78, ensName: "injective-hub.eth" },
  3: { views: 23100, shares: 1200, reactions: 5600, trendingScore: 95, farcasterFid: 67890, lensHandle: "meme-queen" },
  4: { views: 4500, shares: 320, reactions: 980, trendingScore: 45 },
  5: { views: 15800, shares: 720, reactions: 4100, trendingScore: 85, lensHandle: "art-collector" },
  6: { views: 6200, shares: 410, reactions: 1500, trendingScore: 62 },
  7: { views: 9800, shares: 560, reactions: 2800, trendingScore: 71, farcasterFid: 11111 },
  8: { views: 18500, shares: 950, reactions: 4800, trendingScore: 88, ensName: "defi-creator.eth" },
};

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const status = getCampaignStatus(campaign.deadline, campaign.settled);
  const timeRemaining = getTimeRemaining(campaign.deadline);

  const statusConfig = {
    active: {
      label: "Live",
      dot: "bg-emerald-400",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      glow: "group-hover:shadow-emerald-500/10",
    },
    voting: {
      label: "Voting",
      dot: "bg-amber-400",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      glow: "group-hover:shadow-amber-500/10",
    },
    ended: {
      label: "Ended",
      dot: "bg-gray-500",
      className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      glow: "",
    },
  };

  const config = statusConfig[status];

  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className={`group relative block min-w-[280px] max-w-[340px] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-xl ${config.glow}`}
    >
      {/* Hover glow effect */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/0 blur-2xl transition-all group-hover:bg-cyan-500/10" />

      {/* Top row */}
      <div className="relative mb-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {timeRemaining}
        </span>
      </div>

      {/* Title */}
      <h3 className="relative mb-2 text-lg font-semibold text-white transition-colors group-hover:text-cyan-300">
        {campaign.title}
        <ArrowUpRight className="ml-1 inline h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
      </h3>

      {/* Description */}
      <p className="relative mb-5 line-clamp-2 text-sm text-gray-500">
        {campaign.description}
      </p>

      {/* Stats row */}
      <div className="relative flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
            <Award className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <span className="font-semibold text-white">
            {formatUSDC(campaign.totalReward)}
          </span>
          <span className="text-gray-500">USDC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.04]">
            <Users className="h-3.5 w-3.5 text-gray-400" />
          </div>
          <span className="text-gray-400">{campaign.submissionCount}</span>
        </div>
      </div>

      {/* Social proof */}
      {SOCIAL_METRICS[campaign.id] && (
        <div className="relative mt-3 border-t border-white/[0.04] pt-3">
          <SocialProof
            metrics={SOCIAL_METRICS[campaign.id]}
            variant="compact"
          />
        </div>
      )}

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent transition-all group-hover:via-cyan-500/30" />
    </Link>
  );
}
