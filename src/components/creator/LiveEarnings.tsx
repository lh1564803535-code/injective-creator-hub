"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DollarSign, TrendingUp, Target, ChevronUp } from "lucide-react";

interface LiveEarningsProps {
  /** Simplified mode for homepage (only total + rate) */
  compact?: boolean;
  /** Initial total earnings in USDC */
  initialTotal?: number;
  /** Growth rate per second in USDC */
  ratePerSecond?: number;
  /** Monthly earnings target in USDC */
  monthlyTarget?: number;
}

function formatUSDC(value: number): string {
  const parts = value.toFixed(4).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${intPart}.${parts[1]}`;
}

function formatCompact(value: number): string {
  if (value >= 10000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(2)}`;
}

export function LiveEarnings({
  compact = false,
  initialTotal = 42.5837,
  ratePerSecond = 0.0003,
  monthlyTarget = 2000,
}: LiveEarningsProps) {
  const [total, setTotal] = useState(initialTotal);
  const [todayEarnings] = useState(12.45);
  const [monthEarnings, setMonthEarnings] = useState(1245.67);
  const [prevTotal, setPrevTotal] = useState(initialTotal);
  const [animating, setAnimating] = useState(false);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const accumulatedRef = useRef(0);

  // requestAnimationFrame loop for smooth earnings ticking
  const tick = useCallback(
    (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = now;

      // Random increment between ratePerSecond * 0.3 and ratePerSecond * 3.3
      const randomMultiplier = 0.3 + Math.random() * 3;
      const increment = ratePerSecond * delta * randomMultiplier;

      accumulatedRef.current += increment;

      // Update display every ~100ms worth of accumulation
      if (accumulatedRef.current > ratePerSecond * 0.1) {
        setPrevTotal((prev) => {
          setTotal((t) => {
            const newTotal = t + accumulatedRef.current;
            setMonthEarnings((m) => m + accumulatedRef.current);
            accumulatedRef.current = 0;
            return newTotal;
          });
          return prev; // will be updated separately
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [ratePerSecond]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // Trigger digit animation on total change
  useEffect(() => {
    if (total !== prevTotal) {
      setAnimating(true);
      const timeout = setTimeout(() => {
        setAnimating(false);
        setPrevTotal(total);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [total, prevTotal]);

  const annualProjection = monthEarnings * 12;
  const monthProgress = Math.min((monthEarnings / monthlyTarget) * 100, 100);

  if (compact) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-[#1a1a1a] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
        <div className="relative">
          <div className="mb-1 flex items-center gap-2 text-sm text-gray-400">
            <DollarSign className="h-4 w-4 text-amber-400" />
            Live Earnings
          </div>
          <div className="flex items-baseline gap-3">
            <span className="live-earnings-digit font-mono text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              ${formatUSDC(total)}
            </span>
            <span className="live-earnings-rate text-sm font-medium text-emerald-400">
              +${ratePerSecond.toFixed(4)}/s
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">USDC earned in real-time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-[#1a1a1a]">
      {/* Subtle glow */}
      <div className="absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-amber-500/8 blur-3xl" />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <DollarSign className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Live Earnings</h2>
              <p className="text-xs text-gray-500">Real-time USDC streaming</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1">
            <span className="live-earnings-pulse h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Streaming</span>
          </div>
        </div>

        {/* Main Number */}
        <div className="mb-8 text-center">
          <div className="relative inline-block overflow-hidden">
            <span
              className={`live-earnings-digit block font-mono text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent transition-transform duration-300 ${
                animating ? "digit-scroll" : ""
              }`}
            >
              ${formatUSDC(total)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="live-earnings-rate text-sm font-medium text-emerald-400">
              +${ratePerSecond.toFixed(4)}/s
            </span>
            <span className="text-xs text-gray-600">USDC</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="mb-1 text-xs text-gray-500">Today</p>
            <p className="text-lg font-bold text-emerald-400">
              +${todayEarnings.toFixed(2)}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-emerald-500">
              <ChevronUp className="h-3 w-3" />
              <span>+8.3%</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="mb-1 text-xs text-gray-500">This Month</p>
            <p className="text-lg font-bold text-white">
              ${formatCompact(monthEarnings)}
            </p>
            <p className="mt-1 text-[10px] text-gray-600">
              {monthProgress.toFixed(0)}% of goal
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="mb-1 text-xs text-gray-500">Annual (est.)</p>
            <p className="text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              {formatCompact(annualProjection)}
            </p>
            <p className="mt-1 text-[10px] text-gray-600">projected</p>
          </div>
        </div>

        {/* Progress Bar with Flowing Light */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Monthly Goal
            </span>
            <span className="text-gray-400">
              ${formatCompact(monthEarnings)} / ${formatCompact(monthlyTarget)}
            </span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="live-earnings-progress absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"
              style={{ width: `${monthProgress}%` }}
            >
              {/* Flowing light dot */}
              <span className="live-earnings-flow absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
