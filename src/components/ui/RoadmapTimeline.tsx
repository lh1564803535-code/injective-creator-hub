"use client";

import { CheckCircle, Circle, Clock } from "lucide-react";

interface RoadmapItem {
  phase: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  date: string;
}

const ROADMAP: RoadmapItem[] = [
  {
    phase: "Phase 1",
    title: "Core Platform",
    description: "Campaign creation, submissions, voting, and reward distribution",
    status: "completed",
    date: "Q2 2026",
  },
  {
    phase: "Phase 2",
    title: "AI Integration",
    description: "AI assistant, natural language commands, transaction previews",
    status: "completed",
    date: "Q2 2026",
  },
  {
    phase: "Phase 3",
    title: "Real-Time Streaming",
    description: "Superfluid-inspired earnings, live counters, streaming payments",
    status: "completed",
    date: "Q2 2026",
  },
  {
    phase: "Phase 4",
    title: "Testnet Launch",
    description: "Deploy to Injective testnet, community testing, bug fixes",
    status: "in-progress",
    date: "Q3 2026",
  },
  {
    phase: "Phase 5",
    title: "Mainnet & Growth",
    description: "Mainnet deployment, partnerships, creator onboarding",
    status: "upcoming",
    date: "Q4 2026",
  },
];

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", line: "bg-emerald-500" },
  "in-progress": { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", line: "bg-amber-500" },
  upcoming: { icon: Circle, color: "text-gray-500", bg: "bg-gray-500/10", line: "bg-gray-500" },
};

export function RoadmapTimeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/[0.06]" />

      <div className="space-y-8">
        {ROADMAP.map((item, index) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;

          return (
            <div key={item.phase} className="relative flex gap-4">
              {/* Icon */}
              <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                <Icon className={`h-6 w-6 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-gray-500">{item.phase}</span>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-gray-400">
                    {item.date}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">{item.description}</p>

                {item.status === "completed" && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    Completed
                  </div>
                )}
                {item.status === "in-progress" && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                    <Clock className="h-3 w-3 animate-pulse" />
                    In Progress
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
