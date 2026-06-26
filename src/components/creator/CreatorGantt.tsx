"use client";

import { Gantt, type GanttTask, type GanttTaskStatus } from "@/components/ui/Gantt";
import { User, Trophy, Clock, CheckCircle, AlertCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreatorCampaignEntry {
  /** Campaign identifier */
  campaignId: string;
  /** Campaign display name */
  campaignName: string;
  /** Phase the creator is currently in */
  phase: "joined" | "submitted" | "voting" | "rewarded" | "missed";
  /** Start date of the campaign */
  startDate: Date;
  /** End date / deadline */
  endDate: Date;
  /** Reward amount if rewarded (in USDC or INJ) */
  reward?: string;
  /** Rank / placement */
  rank?: number;
}

interface CreatorGanttProps {
  /** Creator display name */
  creatorName?: string;
  /** List of campaigns the creator is participating in */
  campaigns: CreatorCampaignEntry[];
  /** Optional className for the outer wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const phaseToStatus: Record<
  CreatorCampaignEntry["phase"],
  GanttTaskStatus
> = {
  joined: "in-progress",
  submitted: "in-progress",
  voting: "in-progress",
  rewarded: "completed",
  missed: "completed",
};

const phaseConfig: Record<
  CreatorCampaignEntry["phase"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  joined: {
    label: "Joined",
    color: "bg-blue-500/60",
    icon: <User className="h-3 w-3" />,
  },
  submitted: {
    label: "Submitted",
    color: "bg-cyan-500/60",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  voting: {
    label: "Voting",
    color: "bg-purple-500/60",
    icon: <Clock className="h-3 w-3 animate-pulse" />,
  },
  rewarded: {
    label: "Rewarded",
    color: "bg-emerald-500/60",
    icon: <Trophy className="h-3 w-3" />,
  },
  missed: {
    label: "Missed",
    color: "bg-white/[0.08]",
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

function getActiveCount(campaigns: CreatorCampaignEntry[]): number {
  return campaigns.filter(
    (c) => c.phase !== "rewarded" && c.phase !== "missed"
  ).length;
}

function getRewardedCount(campaigns: CreatorCampaignEntry[]): number {
  return campaigns.filter((c) => c.phase === "rewarded").length;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorGantt({
  creatorName,
  campaigns,
  className = "",
}: CreatorGanttProps) {
  const activeCount = getActiveCount(campaigns);
  const rewardedCount = getRewardedCount(campaigns);

  const tasks: GanttTask[] = campaigns.map((c) => ({
    id: c.campaignId,
    label: c.campaignName,
    startDate: c.startDate,
    endDate: c.endDate,
    status: phaseToStatus[c.phase],
    color: phaseConfig[c.phase].color,
  }));

  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] ${className}`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
            <User className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {creatorName || "My Campaigns"}
            </h3>
            <p className="text-xs text-gray-500">
              {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Active</p>
            <p className="text-sm font-semibold text-cyan-400">{activeCount}</p>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Rewarded</p>
            <p className="text-sm font-semibold text-emerald-400">
              {rewardedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Gantt chart */}
      <div className="p-4">
        <Gantt tasks={tasks} timeScale="day" />
      </div>

      {/* Campaign list */}
      <div className="space-y-0 border-t border-white/[0.04]">
        {campaigns.map((campaign) => {
          const config = phaseConfig[campaign.phase];
          return (
            <div
              key={campaign.campaignId}
              className="flex items-center justify-between border-b border-white/[0.02] px-6 py-3 last:border-b-0 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-md ${
                    campaign.phase === "rewarded"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : campaign.phase === "missed"
                        ? "bg-white/[0.04] text-gray-600"
                        : "bg-cyan-500/10 text-cyan-400"
                  }`}
                >
                  {config.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-white">
                    {campaign.campaignName}
                  </p>
                  <p className="text-[10px] text-gray-600">
                    {campaign.startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {campaign.endDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Reward */}
                {campaign.reward && (
                  <span className="text-xs font-medium text-emerald-400">
                    +{campaign.reward}
                  </span>
                )}
                {/* Rank */}
                {campaign.rank && (
                  <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-gray-400">
                    #{campaign.rank}
                  </span>
                )}
                {/* Phase badge */}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    campaign.phase === "rewarded"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : campaign.phase === "missed"
                        ? "bg-white/[0.04] text-gray-600"
                        : "bg-cyan-500/10 text-cyan-400"
                  }`}
                >
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
