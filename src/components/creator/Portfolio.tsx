"use client";

import {
  Trophy,
  Clock,
  CheckCircle,
  ExternalLink,
  ThumbsUp,
  DollarSign,
} from "lucide-react";
import type { Submission } from "@/types/creator-settlement";

interface PortfolioItem extends Submission {
  campaignTitle: string;
  campaignStatus: "active" | "voting" | "ended";
}

interface PortfolioProps {
  items: PortfolioItem[];
}

const statusConfig = {
  active: {
    label: "In Progress",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    icon: Clock,
  },
  voting: {
    label: "Voting",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    icon: Trophy,
  },
  ended: {
    label: "Ended",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    icon: CheckCircle,
  },
};

function formatReward(wei: bigint): string {
  const str = wei.toString();
  if (str.length <= 6) return `0.${str.padStart(6, "0")}`;
  return `${str.slice(0, -6)}.${str.slice(-6)}`;
}

export function Portfolio({ items }: PortfolioProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04]">
          <Trophy className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-white">No submissions yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Join a campaign to start building your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const status = statusConfig[item.campaignStatus];
        const StatusIcon = status.icon;

        return (
          <div
            key={item.id}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:bg-white/[0.04]"
          >
            {/* Status badge */}
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${status.bg} ${status.text}`}
              >
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </span>
              <span className="text-xs text-gray-600">
                #{item.id}
              </span>
            </div>

            {/* Campaign title */}
            <h4 className="mb-1 text-sm font-semibold text-white line-clamp-1">
              {item.campaignTitle}
            </h4>

            {/* Content link */}
            <a
              href={item.contentURI}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="h-3 w-3" />
              View submission
            </a>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.03] p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <ThumbsUp className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[10px] text-gray-500">Votes</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {item.votes}
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] text-gray-500">Reward</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  ${formatReward(item.reward)}
                </p>
              </div>
            </div>

            {/* Claimed indicator */}
            {item.claimed && (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Reward claimed
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
