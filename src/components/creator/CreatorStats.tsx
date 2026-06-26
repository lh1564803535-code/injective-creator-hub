"use client";

import { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  TrendingUp,
  Trophy,
  Target,
  BarChart3,
  Percent,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreatorStatsData {
  /** Total USDC earnings */
  totalEarnings: number;
  /** Total votes received across all campaigns */
  totalVotes: number;
  /** Total submissions / works */
  totalWorks: number;
  /** Average rank across campaigns */
  avgRank: number;
  /** Win rate as 0-100 percentage */
  winRate: number;
}

interface CreatorStatsProps extends CreatorStatsData {
  className?: string;
}

// ---------------------------------------------------------------------------
// Animated Counter
// ---------------------------------------------------------------------------

function useAnimatedNumber(
  target: number,
  duration = 800,
  decimals = 0
): number {
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
      setDisplay(
        parseFloat((from + (to - from) * eased).toFixed(decimals))
      );
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    prevRef.current = target;
  }, [target, duration, decimals]);

  return display;
}

// ---------------------------------------------------------------------------
// Mini Bar Chart
// ---------------------------------------------------------------------------

function MiniBarChart({
  values,
  maxVal,
  animated,
  colors,
}: {
  values: number[];
  maxVal: number;
  animated: boolean;
  colors: string[];
}) {
  return (
    <div className="flex items-end gap-1" style={{ height: 40 }}>
      {values.map((v, i) => {
        const pct = maxVal > 0 ? (v / maxVal) * 100 : 0;
        return (
          <div
            key={i}
            className={`flex-1 rounded-t transition-all duration-700 ease-out ${colors[i % colors.length]}`}
            style={{
              height: animated ? `${Math.max(pct, 4)}%` : "4%",
              transitionDelay: `${i * 80}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ring Indicator
// ---------------------------------------------------------------------------

function RingIndicator({
  value,
  size = 64,
  stroke = 6,
  color = "#34d399",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <svg ref={ref} width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={animated ? offset : circumference}
        className="transition-all duration-1000 ease-out"
        style={{
          filter: `drop-shadow(0 0 6px ${color}40)`,
        }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorStats({
  totalEarnings,
  totalVotes,
  totalWorks,
  avgRank,
  winRate,
  className = "",
}: CreatorStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animated values
  const aEarnings = useAnimatedNumber(totalEarnings, 900, 2);
  const aVotes = useAnimatedNumber(totalVotes);
  const aWorks = useAnimatedNumber(totalWorks);
  const aRank = useAnimatedNumber(avgRank, 800, 1);
  const aWinRate = useAnimatedNumber(winRate, 800, 1);

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

  const cards = [
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: `$${aEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      glow: "shadow-emerald-500/10",
    },
    {
      icon: TrendingUp,
      label: "Total Votes",
      value: aVotes.toLocaleString(),
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      glow: "shadow-cyan-500/10",
    },
    {
      icon: Trophy,
      label: "Total Works",
      value: aWorks.toLocaleString(),
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      glow: "shadow-violet-500/10",
    },
    {
      icon: Target,
      label: "Avg Rank",
      value: `#${aRank.toFixed(1)}`,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      glow: "shadow-amber-500/10",
    },
  ];

  // Mini bar chart data: earnings breakdown by "category"
  const barValues = [
    totalEarnings * 0.4,
    totalEarnings * 0.25,
    totalEarnings * 0.2,
    totalEarnings * 0.15,
  ];
  const barMax = Math.max(...barValues, 1);
  const barColors = [
    "bg-emerald-500/70",
    "bg-cyan-500/70",
    "bg-violet-500/70",
    "bg-amber-500/70",
  ];
  const barLabels = ["Campaigns", "Votes", "Bonuses", "Streaks"];

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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Creator Stats</h3>
            <p className="text-[10px] text-gray-500">All-time performance</p>
          </div>
        </div>

        {/* Win rate ring */}
        <div className="relative flex items-center justify-center">
          <RingIndicator value={aWinRate} size={56} stroke={5} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-emerald-400">
              {aWinRate.toFixed(0)}%
            </span>
            <span className="text-[8px] text-gray-500">Win</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`rounded-xl bg-white/[0.02] p-3 text-center transition-all hover:bg-white/[0.04] ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div
              className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${card.bg} shadow-lg ${card.glow}`}
            >
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p
              className={`font-mono text-sm font-bold tabular-nums ${card.color}`}
            >
              {card.value}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-600">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Earnings breakdown mini chart */}
      <div className="rounded-xl bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500">
              Earnings Breakdown
            </span>
          </div>
          <span className="font-mono text-xs text-emerald-400">
            ${totalEarnings.toLocaleString()} total
          </span>
        </div>

        <MiniBarChart
          values={barValues}
          maxVal={barMax}
          animated={isVisible}
          colors={barColors}
        />

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3">
          {barLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-full ${barColors[i].replace("/70", "")}`}
              />
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Win rate bar */}
      <div className="mt-4 rounded-xl bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-600">
          <span>Win Rate</span>
          <span className="text-emerald-400">{aWinRate.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${Math.min(aWinRate, 100)}%` : "0%",
              boxShadow: "0 0 12px rgba(52, 211, 153, 0.3)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
