"use client";

import { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronUp,
  ChevronDown,
  BarChart3,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreatorRewardProps {
  /** Total lifetime earnings in USDC */
  totalEarnings?: number;
  /** Today's earnings in USDC */
  todayEarnings?: number;
  /** This month's earnings in USDC */
  monthEarnings?: number;
  /** 7-day earnings trend data */
  weeklyData?: number[];
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCompact(value: number): string {
  if (value >= 100000) return `$${(value / 1000).toFixed(1)}k`;
  if (value >= 10000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(2)}`;
}

function formatUSDC(value: number): string {
  const parts = value.toFixed(2).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${intPart}.${parts[1]}`;
}

/** Animate a number from 0 to target on mount */
function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

/** Generate default 7-day mock data */
function defaultWeeklyData(): number[] {
  return [18.2, 24.4, 19.8, 28.2, 22.1, 26.5, 24.45];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Sparkline({ data, color = "#34d399" }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const step = w / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="creator-reward-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#creator-reward-grad)" />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={parseFloat(points[points.length - 1].split(",")[1])}
        r="2"
        fill={color}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorReward({
  totalEarnings = 12847.53,
  todayEarnings = 24.45,
  monthEarnings = 1245.67,
  weeklyData,
  className = "",
}: CreatorRewardProps) {
  const data = weeklyData ?? defaultWeeklyData();

  const animatedTotal = useCountUp(totalEarnings);
  const animatedToday = useCountUp(todayEarnings);
  const animatedMonth = useCountUp(monthEarnings);

  // Calculate trend from weekly data
  const recent = data.slice(-2);
  const trendPct = recent[0] > 0 ? ((recent[1] - recent[0]) / recent[0]) * 100 : 0;
  const isPositive = trendPct >= 0;

  // Mock percentage changes
  const todayChange = +8.3;
  const monthChange = +12.7;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#1a1a1a] ${className}`}>
      {/* Green glow */}
      <div className="absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-emerald-500/8 blur-3xl" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Creator Rewards</h3>
              <p className="text-xs text-gray-500">Your earnings overview</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">
              {isPositive ? "+" : ""}
              {trendPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Total earnings (hero) */}
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs text-gray-500">Total Earnings</p>
          <span className="font-mono text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
            ${formatUSDC(animatedTotal)}
          </span>
          <p className="mt-1 text-xs text-gray-500">USDC lifetime</p>
        </div>

        {/* Today + Month stats */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-1 text-xs text-gray-500">Today</p>
            <p className="text-xl font-bold text-emerald-400">
              +${formatUSDC(animatedToday)}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-500">
              <ChevronUp className="h-3 w-3" />
              <span>+{todayChange}%</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-500" />
              <p className="text-xs text-gray-500">This Month</p>
            </div>
            <p className="text-xl font-bold text-white">
              {formatCompact(animatedMonth)}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-500">
              <ChevronUp className="h-3 w-3" />
              <span>+{monthChange}%</span>
            </div>
          </div>
        </div>

        {/* Earnings trend */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-400">
                7-Day Earnings Trend
              </span>
            </div>
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}
              {trendPct.toFixed(1)}% vs last week
            </span>
          </div>

          <div className="flex items-end justify-between">
            <Sparkline data={data} />
            <div className="text-right">
              <p className="text-xs text-gray-500">Peak</p>
              <p className="text-sm font-semibold text-white">
                ${Math.max(...data).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Day labels */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-gray-600">Mon</span>
            <span className="text-[10px] text-gray-600">Tue</span>
            <span className="text-[10px] text-gray-600">Wed</span>
            <span className="text-[10px] text-gray-600">Thu</span>
            <span className="text-[10px] text-gray-600">Fri</span>
            <span className="text-[10px] text-gray-600">Sat</span>
            <span className="text-[10px] text-gray-400 font-medium">Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}
