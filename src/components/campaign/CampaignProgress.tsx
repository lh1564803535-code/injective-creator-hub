"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Users, Vote, CheckCircle, Timer } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignProgressProps {
  /** Campaign start timestamp (unix seconds) */
  startTime: number;
  /** Campaign deadline timestamp (unix seconds) */
  deadline: number;
  /** Whether the campaign is settled */
  settled: boolean;
  /** Current number of submissions */
  currentSubmissions: number;
  /** Target number of submissions */
  targetSubmissions: number;
  /** Current total votes */
  currentVotes: number;
  /** Target total votes */
  targetVotes: number;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Animated Number Hook
// ---------------------------------------------------------------------------

function useAnimatedNumber(target: number, duration = 800): number {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    if (from === to) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    prevRef.current = target;
  }, [target, duration]);

  return display;
}

// ---------------------------------------------------------------------------
// Progress Bar Sub-component
// ---------------------------------------------------------------------------

function ProgressBarInner({
  percentage,
  color,
  glowColor,
  animated,
  delay = 0,
}: {
  percentage: number;
  color: string;
  glowColor: string;
  animated: boolean;
  delay?: number;
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{
          width: animated ? `${Math.min(percentage, 100)}%` : "0%",
          boxShadow: `0 0 12px ${glowColor}`,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignProgress({
  startTime,
  deadline,
  settled,
  currentSubmissions,
  targetSubmissions,
  currentVotes,
  targetVotes,
  className = "",
}: CampaignProgressProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const aSubmissions = useAnimatedNumber(currentSubmissions);
  const aVotes = useAnimatedNumber(currentVotes);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Time progress
  const now = Math.floor(Date.now() / 1000);
  const totalDuration = deadline - startTime;
  const elapsed = settled ? totalDuration : Math.max(0, now - startTime);
  const timePercent =
    totalDuration > 0
      ? Math.min(100, (elapsed / totalDuration) * 100)
      : settled
        ? 100
        : 0;

  // Submission progress
  const submissionPercent =
    targetSubmissions > 0
      ? Math.min(100, (currentSubmissions / targetSubmissions) * 100)
      : 0;

  // Vote progress
  const votePercent =
    targetVotes > 0 ? Math.min(100, (currentVotes / targetVotes) * 100) : 0;

  // Time remaining
  const remaining = deadline - now;
  const days = Math.floor(Math.max(0, remaining) / 86400);
  const hours = Math.floor((Math.max(0, remaining) % 86400) / 3600);
  const minutes = Math.floor((Math.max(0, remaining) % 3600) / 60);

  let timeLabel: string;
  let timeStatus: "active" | "voting" | "ended";
  if (settled) {
    timeLabel = "Completed";
    timeStatus = "ended";
  } else if (remaining <= 0) {
    timeLabel = "Voting Open";
    timeStatus = "voting";
  } else if (days > 0) {
    timeLabel = `${days}d ${hours}h remaining`;
    timeStatus = "active";
  } else if (hours > 0) {
    timeLabel = `${hours}h ${minutes}m remaining`;
    timeStatus = "active";
  } else {
    timeLabel = `${minutes}m remaining`;
    timeStatus = "active";
  }

  const progressItems = [
    {
      icon: Timer,
      label: "Time Progress",
      current: timeLabel,
      percentage: timePercent,
      color: settled
        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
        : timeStatus === "voting"
          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
          : "bg-gradient-to-r from-cyan-500 to-blue-500",
      glowColor: settled
        ? "rgba(52,211,153,0.3)"
        : timeStatus === "voting"
          ? "rgba(251,191,36,0.3)"
          : "rgba(34,211,238,0.3)",
      accentColor: settled
        ? "text-emerald-400"
        : timeStatus === "voting"
          ? "text-amber-400"
          : "text-cyan-400",
    },
    {
      icon: Users,
      label: "Submissions",
      current: `${aSubmissions} / ${targetSubmissions}`,
      percentage: submissionPercent,
      color: "bg-gradient-to-r from-violet-500 to-purple-400",
      glowColor: "rgba(167,139,250,0.3)",
      accentColor: "text-violet-400",
    },
    {
      icon: Vote,
      label: "Votes",
      current: `${aVotes} / ${targetVotes}`,
      percentage: votePercent,
      color: "bg-gradient-to-r from-blue-500 to-indigo-400",
      glowColor: "rgba(96,165,250,0.3)",
      accentColor: "text-blue-400",
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15">
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Campaign Progress
            </h3>
            <p className="text-[10px] text-gray-500">
              {settled ? "Campaign completed" : "Tracking milestones"}
            </p>
          </div>
        </div>

        {settled && (
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">
              Settled
            </span>
          </div>
        )}
      </div>

      {/* Progress items */}
      <div className="space-y-4">
        {progressItems.map((item, i) => (
          <div
            key={item.label}
            className={`transition-all ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <item.icon className={`h-3.5 w-3.5 ${item.accentColor}`} />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
              <span
                className={`font-mono text-xs tabular-nums ${item.accentColor}`}
              >
                {item.current}
              </span>
            </div>
            <ProgressBarInner
              percentage={item.percentage}
              color={item.color}
              glowColor={item.glowColor}
              animated={isVisible}
              delay={i * 120}
            />
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-2.5">
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          Overall Completion
        </span>
        <span className="font-mono text-xs tabular-nums text-gray-300">
          {Math.round((timePercent + submissionPercent + votePercent) / 3)}%
        </span>
      </div>
    </div>
  );
}
