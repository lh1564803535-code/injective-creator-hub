"use client";

import { Calendar, Trophy, Clock, ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorActivityStatus =
  | "active"
  | "submitted"
  | "voting"
  | "won"
  | "completed";

interface CreatorActivity {
  id: string;
  campaignTitle: string;
  status: CreatorActivityStatus;
  rewardAmount?: string;
  rewardToken?: string;
  submittedAt?: string;
  deadline?: string;
  txHash?: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const statusConfig: Record<
  CreatorActivityStatus,
  { color: string; bg: string; label: string }
> = {
  active: {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    label: "Active",
  },
  submitted: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    label: "Submitted",
  },
  voting: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "Voting",
  },
  won: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Won",
  },
  completed: {
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    label: "Completed",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CreatorTimelineProps {
  activities: CreatorActivity[];
  className?: string;
}

export function CreatorTimeline({
  activities,
  className = "",
}: CreatorTimelineProps) {
  if (activities.length === 0) {
    return (
      <div
        className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 ${className}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">
            Campaign Activity
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-10 w-10 text-gray-600 mb-3" />
          <p className="text-sm text-gray-500">No campaign activity yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Join a campaign to start building your timeline
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">
            Campaign Activity
          </h3>
        </div>
        <span className="text-xs text-gray-500">
          {activities.length} campaign{activities.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-white/[0.06]" />

        <div className="space-y-6">
          {activities.map((activity) => {
            const config = statusConfig[activity.status];

            return (
              <div key={activity.id} className="relative flex gap-4">
                {/* Dot */}
                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                    activity.status === "won"
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : activity.status === "active"
                        ? "border-cyan-500/30 bg-cyan-500/10"
                        : "border-white/[0.08] bg-white/[0.04]"
                  }`}
                >
                  {activity.status === "won" ? (
                    <Trophy className="h-4 w-4 text-emerald-400" />
                  ) : activity.status === "active" ? (
                    <Clock className="h-4 w-4 text-cyan-400 animate-pulse" />
                  ) : (
                    <Calendar
                      className={`h-4 w-4 ${
                        activity.status === "submitted"
                          ? "text-blue-400"
                          : activity.status === "voting"
                            ? "text-amber-400"
                            : "text-gray-500"
                      }`}
                    />
                  )}
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {activity.campaignTitle}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}
                        >
                          {config.label}
                        </span>
                        {activity.submittedAt && (
                          <span className="text-[10px] text-gray-600">
                            {activity.submittedAt}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reward badge */}
                    {activity.rewardAmount && (
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-semibold text-emerald-400">
                          +{activity.rewardAmount} {activity.rewardToken || "INJ"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Deadline info */}
                  {activity.deadline && activity.status === "active" && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="h-3 w-3" />
                      Deadline: {activity.deadline}
                    </div>
                  )}

                  {/* Tx link */}
                  {activity.txHash && (
                    <a
                      href={`https://testnet.explorer.injective.network/transaction/${activity.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View on Explorer
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
