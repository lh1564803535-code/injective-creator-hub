"use client";

import {
  Rocket,
  Send,
  Vote,
  Award,
  Check,
  Clock,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CampaignPhase =
  | "creation"
  | "submission"
  | "voting"
  | "settlement"
  | "completed";

interface PhaseInfo {
  id: CampaignPhase;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const PHASES: PhaseInfo[] = [
  {
    id: "creation",
    label: "Created",
    icon: <Rocket className="h-4 w-4" />,
    description: "Campaign launched by sponsor",
  },
  {
    id: "submission",
    label: "Submissions",
    icon: <Send className="h-4 w-4" />,
    description: "Creators submit content",
  },
  {
    id: "voting",
    label: "Voting",
    icon: <Vote className="h-4 w-4" />,
    description: "Community votes on submissions",
  },
  {
    id: "settlement",
    label: "Settlement",
    icon: <Award className="h-4 w-4" />,
    description: "Rewards distributed to winners",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCurrentPhase(
  deadline: number,
  settled: boolean
): CampaignPhase {
  const now = Math.floor(Date.now() / 1000);
  if (settled) return "completed";
  if (now >= deadline) return "voting";
  return "submission";
}

function getPhaseIndex(phase: CampaignPhase): number {
  if (phase === "completed") return PHASES.length;
  return PHASES.findIndex((p) => p.id === phase);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CampaignTimelineProps {
  deadline: number;
  settled: boolean;
  createdAt?: number; // optional, defaults to deadline - 7 days
}

export function CampaignTimeline({
  deadline,
  settled,
  createdAt,
}: CampaignTimelineProps) {
  const currentPhase = getCurrentPhase(deadline, settled);
  const currentIndex = getPhaseIndex(currentPhase);

  const now = Math.floor(Date.now() / 1000);
  const totalDuration = deadline - (createdAt || deadline - 86400 * 7);
  const elapsed = now - (createdAt || deadline - 86400 * 7);
  const progressPercent = settled
    ? 100
    : Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Campaign Timeline</h3>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {settled
            ? "Completed"
            : currentPhase === "voting"
              ? "Voting period"
              : `${Math.max(0, Math.ceil((deadline - now) / 86400))} days left`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase steps */}
      <div className="grid grid-cols-4 gap-2">
        {PHASES.map((phase, i) => {
          const isCompleted = i < currentIndex || settled;
          const isCurrent = i === currentIndex && !settled;
          const isPending = i > currentIndex && !settled;

          return (
            <div key={phase.id} className="text-center">
              {/* Icon */}
              <div
                className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-400"
                    : isCurrent
                      ? "bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/30"
                      : "bg-white/[0.04] text-gray-600"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  phase.icon
                )}
              </div>

              {/* Label */}
              <p
                className={`text-xs font-medium ${
                  isCompleted
                    ? "text-emerald-400"
                    : isCurrent
                      ? "text-cyan-400"
                      : "text-gray-600"
                }`}
              >
                {phase.label}
              </p>

              {/* Description - only for current */}
              {isCurrent && (
                <p className="mt-1 text-[10px] text-gray-500">
                  {phase.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Completed overlay */}
      {settled && (
        <div className="mt-4 rounded-lg bg-emerald-500/5 px-3 py-2 text-center">
          <p className="text-xs text-emerald-400">
            Campaign completed -- rewards have been distributed
          </p>
        </div>
      )}
    </div>
  );
}
