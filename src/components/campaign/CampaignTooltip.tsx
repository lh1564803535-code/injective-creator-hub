"use client";

import { useState, useRef } from "react";
import { Trophy, Users, DollarSign, Calendar } from "lucide-react";
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
// Position styles
// ---------------------------------------------------------------------------

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles = {
  top: "bottom-[-4px] left-1/2 -translate-x-1/2",
  bottom: "top-[-4px] left-1/2 -translate-x-1/2",
  left: "right-[-4px] top-1/2 -translate-y-1/2",
  right: "left-[-4px] top-1/2 -translate-y-1/2",
};

// ---------------------------------------------------------------------------
// CampaignTooltip
// ---------------------------------------------------------------------------

export function CampaignTooltip({
  campaign,
  children,
  position = "top",
}: CampaignTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const deadlineDate = new Date(campaign.deadline * 1000);
  const isExpired = deadlineDate < new Date();
  const formattedDate = deadlineDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), 200);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {isVisible && (
        <div className={`absolute z-50 ${positionStyles[position]}`}>
          <div className="w-64 rounded-lg bg-[#1a1a1a] p-3 shadow-xl ring-1 ring-white/10">
            {/* Header */}
            <div className="border-b border-white/10 pb-2">
              <h4 className="text-sm font-semibold text-white">{campaign.title}</h4>
              <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                {campaign.description}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-2 gap-2">
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
            <div className="mt-3 border-t border-white/10 pt-2">
              <p className="text-[10px] text-gray-500">
                Sponsored by{" "}
                <span className="font-mono text-gray-400">
                  {campaign.sponsor.slice(0, 6)}...{campaign.sponsor.slice(-4)}
                </span>
              </p>
            </div>
          </div>
          <div
            className={`absolute h-2 w-2 rotate-45 bg-[#1a1a1a] ${arrowStyles[position]}`}
          />
        </div>
      )}
    </div>
  );
}
