"use client";

import Link from "next/link";
import { Clock, Users, Award, ArrowUpRight } from "lucide-react";
import {
  formatUSDC,
  getTimeRemaining,
  getCampaignStatus,
} from "@/lib/injective";
import type { Campaign } from "@/types/creator-settlement";

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

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent transition-all group-hover:via-cyan-500/30" />
    </Link>
  );
}
