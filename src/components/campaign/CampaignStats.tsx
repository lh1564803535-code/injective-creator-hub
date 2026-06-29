"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { formatUSDC } from "@/lib/injective";

interface CampaignStatsProps {
  totalReward: bigint;
  submissionCount: number;
  totalVotes: number;
  deadline: number;
  settled: boolean;
  className?: string;
}

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

export function CampaignStats({
  totalReward,
  submissionCount,
  totalVotes,
  deadline,
  settled,
  className = "",
}: CampaignStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const animatedSubmissions = useAnimatedNumber(submissionCount);
  const animatedVotes = useAnimatedNumber(totalVotes);
  const avgVotes = submissionCount > 0 ? totalVotes / submissionCount : 0;
  const animatedAvg = useAnimatedNumber(Math.round(avgVotes * 10));

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

  const now = Math.floor(Date.now() / 1000);
  const totalDuration = deadline - now + 86400 * 7;
  const elapsed = totalDuration - (deadline - now);
  const progressPercent = settled
    ? 100
    : Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  const remaining = deadline - now;
  const days = Math.floor(Math.max(0, remaining) / 86400);
  const hours = Math.floor((Math.max(0, remaining) % 86400) / 3600);
  const minutes = Math.floor((Math.max(0, remaining) % 3600) / 60);

  let timeDisplay: string;
  if (settled) {
    timeDisplay = "Completed";
  } else if (remaining <= 0) {
    timeDisplay = "Voting Open";
  } else if (days > 0) {
    timeDisplay = `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    timeDisplay = `${hours}h ${minutes}m remaining`;
  } else {
    timeDisplay = `${minutes}m remaining`;
  }

  const stats = [
    {
      icon: Award,
      label: "Total Reward",
      value: `${formatUSDC(totalReward)} USDC`,
      color: "text-[#F0B90B]",
      bg: "bg-[#F0B90B]/10",
    },
    {
      icon: Users,
      label: "Participants",
      value: animatedSubmissions.toLocaleString(),
      color: "text-[#00D4AA]",
      bg: "bg-[#00D4AA]/10",
    },
    {
      icon: TrendingUp,
      label: "Total Votes",
      value: animatedVotes.toLocaleString(),
      color: "text-[#848E9C]",
      bg: "bg-[#2B3139]",
    },
    {
      icon: BarChart3,
      label: "Avg Votes",
      value: (animatedAvg / 10).toFixed(1),
      color: "text-[#00D4AA]",
      bg: "bg-[#00D4AA]/10",
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`rounded-xl border border-[#2B3139] bg-[#1E2329] p-5 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`rounded-lg bg-[#0B0E11] p-3 text-center transition-all ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div
              className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}
            >
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className={`font-mono text-sm font-bold tabular-nums ${stat.color}`}>
              {stat.value}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#848E9C]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-[#848E9C]">Campaign Progress</span>
          <span className={settled ? "text-[#00D4AA]" : "text-[#848E9C]"}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#0B0E11]">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              settled
                ? "bg-gradient-to-r from-[#00D4AA] to-[#00D4AA]"
                : "bg-gradient-to-r from-[#00D4AA] to-[#00B894]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-lg bg-[#0B0E11] px-4 py-3">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-[#848E9C]">
              <span>Vote Engagement</span>
              <span className="text-[#848E9C]">
                {submissionCount > 0 ? avgVotes.toFixed(1) : "0"} votes/sub
              </span>
            </div>
            <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-[#2B3139]">
              {Array.from({ length: Math.min(submissionCount, 20) }).map(
                (_, i) => {
                  const intensity = Math.min(
                    1,
                    totalVotes / Math.max(1, submissionCount * 10)
                  );
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: `rgba(0, 212, 170, ${0.15 + intensity * 0.6})`,
                        transitionDelay: isVisible ? `${i * 30}ms` : "0ms",
                      }}
                    />
                  );
                }
              )}
            </div>
          </div>
          <div className="h-8 w-px bg-[#2B3139]" />
          <div className="text-right">
            <p className="font-mono text-xs font-semibold text-[#00D4AA] tabular-nums">
              {animatedVotes.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#848E9C]">total</p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 ${
            settled ? "bg-[#00D4AA]/10" : "bg-[#0B0E11]"
          }`}
        >
          {settled ? (
            <CheckCircle className="h-4 w-4 text-[#00D4AA]" />
          ) : (
            <Clock className="h-4 w-4 text-[#848E9C]" />
          )}
          <span
            className={`text-sm font-medium ${
              settled ? "text-[#00D4AA]" : "text-[#EAECEF]"
            }`}
          >
            {timeDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}
