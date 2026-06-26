"use client";

import { Trophy, Users, Clock, DollarSign, Calendar } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { formatUSDC } from "@/lib/injective";
import type { Campaign } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignTooltipProps {
  campaign: Campaign;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

// ---------------------------------------------------------------------------
// CampaignTooltip
// ---------------------------------------------------------------------------

export function CampaignTooltip({
  campaign,
  children,
  position = "top",
}: CampaignTooltipProps) {
  const deadlineDate = new Date(campaign.deadline * 1000);
  const isExpired = deadlineDate < new Date();
  const formattedDate = deadlineDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const tooltipContent = (
    <div className="w-64 space-y-3 p-1">
      {/* Header */}
      <div className="border-b border-white/10 pb-2">
        <h4 className="text-sm font-semibold text-white">{campaign.title}</h4>
        <p className="mt-1 text-xs text-gray-400 line-clamp-2">
          {campaign.description}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          <div>
            <p className="text-[10px] text-gray-500">Reward Pool</p>
            <p className="text-xs font-medium text-emerald-400">
              {formatUSDC(campaign.totalReward)} USDC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-cyan-400" />
          <div>
            <p className="text-[10px] text-gray-500">Submissions</p>
            <p className="text-xs font-medium text-cyan-400">
              {campaign.submissionCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-purple-400" />
          <div>
            <p className="text-[10px] text-gray-500">Deadline</p>
            <p className={`text-xs font-medium ${isExpired ? "text-red-400" : "text-purple-400"}`}>
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="h-3.5 w-3.5 text-amber-400" />
          <div>
            <p className="text-[10px] text-gray-500">Status</p>
            <p className={`text-xs font-medium ${
              campaign.settled ? "text-gray-400" :
              isExpired ? "text-red-400" :
              "text-emerald-400"
            }`}>
              {campaign.settled ? "Settled" : isExpired ? "Expired" : "Active"}
            </p>
          </div>
        </div>
      </div>

      {/* Sponsor */}
      <div className="border-t border-white/10 pt-2">
        <p className="text-[10px] text-gray-500">
          Sponsored by{" "}
          <span className="font-mono text-gray-400">
            {campaign.sponsor.slice(0, 6)}...{campaign.sponsor.slice(-4)}
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position={position}>
      {children}
    </Tooltip>
  );
}
