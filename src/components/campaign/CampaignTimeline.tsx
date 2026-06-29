"use client";

import { Rocket, Send, Vote, Award, Check, Clock } from "lucide-react";

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

function getCurrentPhase(deadline: number, settled: boolean): CampaignPhase {
  const now = Math.floor(Date.now() / 1000);
  if (settled) return "completed";
  if (now >= deadline) return "voting";
  return "submission";
}

function getPhaseIndex(phase: CampaignPhase): number {
  if (phase === "completed") return PHASES.length;
  return PHASES.findIndex((p) => p.id === phase);
}

interface CampaignTimelineProps {
  deadline: number;
  settled: boolean;
  createdAt?: number;
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
    <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#EAECEF]">
          Campaign Timeline
        </h3>
        <span className="flex items-center gap-1 text-xs text-[#848E9C]">
          <Clock className="h-3 w-3" />
          {settled
            ? "Completed"
            : currentPhase === "voting"
              ? "Voting period"
              : `${Math.max(0, Math.ceil((deadline - now) / 86400))} days left`}
        </span>
      </div>

      <div className="relative mb-8">
        <div className="h-1.5 overflow-hidden rounded-full bg-[#0B0E11]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00D4AA] to-[#00B894] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {PHASES.map((phase, i) => {
          const isCompleted = i < currentIndex || settled;
          const isCurrent = i === currentIndex && !settled;

          return (
            <div key={phase.id} className="text-center">
              <div
                className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? "bg-[#00D4AA]/20 text-[#00D4AA]"
                    : isCurrent
                      ? "bg-[#00D4AA]/20 text-[#00D4AA] ring-2 ring-[#00D4AA]/30"
                      : "bg-[#2B3139] text-[#848E9C]"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : phase.icon}
              </div>
              <p
                className={`text-xs font-medium ${
                  isCompleted
                    ? "text-[#00D4AA]"
                    : isCurrent
                      ? "text-[#00D4AA]"
                      : "text-[#848E9C]"
                }`}
              >
                {phase.label}
              </p>
              {isCurrent && (
                <p className="mt-1 text-[10px] text-[#848E9C]">
                  {phase.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {settled && (
        <div className="mt-4 rounded-lg bg-[#00D4AA]/5 px-3 py-2 text-center">
          <p className="text-xs text-[#00D4AA]">
            Campaign completed — rewards have been distributed
          </p>
        </div>
      )}
    </div>
  );
}
