"use client";

import { Trophy, Users, DollarSign, Calendar } from "lucide-react";
import { formatUSDC } from "@/lib/injective";
import { Popover } from "@/components/ui/Popover";
import type { Campaign } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignPopoverProps {
  campaign: Campaign;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

// ---------------------------------------------------------------------------
// CampaignPopover
// ---------------------------------------------------------------------------

export function CampaignPopover({
  campaign,
  children,
  position = "bottom",
}: CampaignPopoverProps) {
  const deadlineDate = new Date(campaign.deadline * 1000);
  const isExpired = deadlineDate < new Date();
  const formattedDate = deadlineDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Popover trigger={children} position={position} className="w-72 p-4">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <h4 className="text-sm font-semibold text-white">{campaign.title}</h4>
        <p className="mt-1 text-xs text-gray-400 line-clamp-2">
          {campaign.description}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-400" />
          <div>
            <p className="text-[10px] text-gray-500">Reward Pool</p>
            <p className="text-xs font-medium text-emerald-400">
              {formatUSDC(campaign.totalReward)} USDC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-400" />
          <div>
            <p className="text-[10px] text-gray-500">Participants</p>
            <p className="text-xs font-medium text-cyan-400">
              {campaign.submissionCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-purple-400" />
          <div>
            <p className="text-[10px] text-gray-500">Deadline</p>
            <p
              className={`text-xs font-medium ${
                isExpired ? "text-red-400" : "text-purple-400"
              }`}
            >
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <div>
            <p className="text-[10px] text-gray-500">Status</p>
            <p
              className={`text-xs font-medium ${
                campaign.settled
                  ? "text-gray-400"
                  : isExpired
                    ? "text-red-400"
                    : "text-emerald-400"
              }`}
            >
              {campaign.settled ? "Settled" : isExpired ? "Expired" : "Active"}
            </p>
          </div>
        </div>
      </div>

      {/* Sponsor */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <p className="text-[10px] text-gray-500">
          Sponsored by{" "}
          <span className="font-mono text-gray-400">
            {campaign.sponsor.slice(0, 6)}...{campaign.sponsor.slice(-4)}
          </span>
        </p>
      </div>
    </Popover>
  );
}
