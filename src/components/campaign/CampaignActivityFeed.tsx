"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Vote,
  Gift,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Activity,
} from "lucide-react";
import { shortenAddress } from "@/lib/injective";
import { MOCK_CREATORS } from "@/lib/mock-data";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActivityEvent {
  id: string;
  type: "submission" | "vote" | "claim" | "settle";
  creator: string;
  timestamp: number;
  detail: string;
  votes?: number;
  amount?: string;
}

// ---------------------------------------------------------------------------
// Mock activity events for a campaign
// ---------------------------------------------------------------------------

function generateCampaignActivity(campaignId: number): ActivityEvent[] {
  const now = Math.floor(Date.now() / 1000);
  const creators = MOCK_CREATORS.slice(0, 8);

  const events: ActivityEvent[] = [
    {
      id: `${campaignId}-s1`,
      type: "submission",
      creator: creators[0].address,
      timestamp: now - 120,
      detail: "Submitted new content",
    },
    {
      id: `${campaignId}-v1`,
      type: "vote",
      creator: creators[1].address,
      timestamp: now - 300,
      detail: "Voted with 4x weight",
      votes: 4,
    },
    {
      id: `${campaignId}-v2`,
      type: "vote",
      creator: creators[2].address,
      timestamp: now - 600,
      detail: "Voted with 2x weight",
      votes: 2,
    },
    {
      id: `${campaignId}-s2`,
      type: "submission",
      creator: creators[3].address,
      timestamp: now - 1800,
      detail: "Submitted new content",
    },
    {
      id: `${campaignId}-v3`,
      type: "vote",
      creator: creators[4].address,
      timestamp: now - 3600,
      detail: "Voted with 5x weight",
      votes: 5,
    },
    {
      id: `${campaignId}-s3`,
      type: "submission",
      creator: creators[5].address,
      timestamp: now - 7200,
      detail: "Submitted new content",
    },
    {
      id: `${campaignId}-v4`,
      type: "vote",
      creator: creators[0].address,
      timestamp: now - 14400,
      detail: "Voted with 3x weight",
      votes: 3,
    },
    {
      id: `${campaignId}-c1`,
      type: "claim",
      creator: creators[6].address,
      timestamp: now - 28800,
      detail: "Claimed 150 USDC reward",
      amount: "150",
    },
    {
      id: `${campaignId}-v5`,
      type: "vote",
      creator: creators[7].address,
      timestamp: now - 43200,
      detail: "Voted with 1x weight",
      votes: 1,
    },
    {
      id: `${campaignId}-s4`,
      type: "submission",
      creator: creators[2].address,
      timestamp: now - 86400,
      detail: "Submitted new content",
    },
  ];

  return events.sort((a, b) => b.timestamp - a.timestamp);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const eventConfig: Record<
  string,
  { icon: typeof Send; color: string; bg: string; label: string }
> = {
  submission: {
    icon: Send,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    label: "submitted content",
  },
  vote: {
    icon: Vote,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "voted",
  },
  claim: {
    icon: Gift,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    label: "claimed reward",
  },
  settle: {
    icon: Award,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "settled campaign",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CampaignActivityFeedProps {
  campaignId: number;
  compact?: boolean;
}

export function CampaignActivityFeed({
  campaignId,
  compact = false,
}: CampaignActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [expanded, setExpanded] = useState(!compact);
  const [animatedIds, setAnimatedIds] = useState<Set<string>>(new Set());
  const initialLoad = useRef(true);

  useEffect(() => {
    const data = generateCampaignActivity(campaignId);
    setEvents(data);
    // Mark all initial events as already animated
    setAnimatedIds(new Set(data.map((e) => e.id)));
    initialLoad.current = false;
  }, [campaignId]);

  // Simulate new events arriving
  useEffect(() => {
    const interval = setInterval(() => {
      const creators = MOCK_CREATORS;
      const randomCreator =
        creators[Math.floor(Math.random() * creators.length)];
      const types: ActivityEvent["type"][] = ["vote", "submission"];
      const randomType = types[Math.floor(Math.random() * types.length)];

      const newEvent: ActivityEvent = {
        id: `${campaignId}-live-${Date.now()}`,
        type: randomType,
        creator: randomCreator.address,
        timestamp: Math.floor(Date.now() / 1000),
        detail:
          randomType === "vote"
            ? `Voted with ${Math.ceil(Math.random() * 5)}x weight`
            : "Submitted new content",
        votes:
          randomType === "vote"
            ? Math.ceil(Math.random() * 5)
            : undefined,
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, 15));
      setAnimatedIds((prev) => new Set(prev).add(newEvent.id));
    }, 12000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, [campaignId]);

  const visibleEvents = expanded ? events : events.slice(0, 4);

  // Activity type counts
  const counts = events.reduce(
    (acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm transition-all hover:border-white/[0.1]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
            <Activity className="h-4.5 w-4.5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Campaign Activity
            </h3>
            <p className="text-xs text-gray-500">Real-time feed</p>
          </div>
        </div>

        {/* Type counters */}
        <div className="flex items-center gap-2">
          {(["submission", "vote", "claim"] as const).map((type) => {
            const cfg = eventConfig[type];
            const count = counts[type] || 0;
            if (count === 0) return null;
            return (
              <span
                key={type}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.color} ${cfg.bg}`}
              >
                <cfg.icon className="h-2.5 w-2.5" />
                {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Event list */}
      <div className="divide-y divide-white/[0.04]">
        {visibleEvents.map((event, i) => {
          const cfg = eventConfig[event.type];
          const isNew = !animatedIds.has(event.id);

          return (
            <div
              key={event.id}
              className={`flex items-start gap-3 px-5 py-3.5 transition-all ${
                isNew
                  ? "animate-fade-in-up bg-cyan-500/[0.02]"
                  : "hover:bg-white/[0.02]"
              }`}
              style={{
                animationDelay: `${i * 40}ms`,
              }}
            >
              {/* Icon */}
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}
              >
                <cfg.icon className={`h-3.5 w-3.5 ${cfg.color}`} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-200">
                  <span className="font-mono text-xs text-gray-400">
                    {shortenAddress(event.creator)}
                  </span>{" "}
                  <span className="text-gray-500">{cfg.label}</span>
                </p>
                <p className="mt-0.5 text-xs text-gray-600">
                  {event.detail}
                </p>
              </div>

              {/* Right side */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[11px] text-gray-600">
                  {timeAgo(event.timestamp)}
                </span>
                {event.votes && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                    {event.votes}x
                  </span>
                )}
                {event.amount && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-400">
                    {event.amount} USDC
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand / Collapse */}
      {events.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-white/[0.04] py-3 text-xs text-gray-500 transition hover:bg-white/[0.02] hover:text-gray-300"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show {events.length - 4} more <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}

      {/* Live indicator */}
      <div className="flex items-center justify-center gap-2 border-t border-white/[0.04] py-2.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
          Live
        </span>
      </div>
    </div>
  );
}
