"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DollarSign, TrendingUp, Target, ChevronUp, Calendar, Eye, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface LiveEarningsProps {
  compact?: boolean;
  initialTotal?: number;
  ratePerSecond?: number;
  monthlyTarget?: number;
  enableViewOnly?: boolean;
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

function generateWeeklyData(): number[] {
  const base = [8.2, 11.4, 9.8, 14.2, 12.1, 13.5, 12.45];
  return base.map((v) => v + (Math.random() - 0.5) * 2);
}

function generateDataFromAddress(address: string) {
  const hash = address.toLowerCase().replace(/[^0-9a-f]/g, "");
  const seed = parseInt(hash.slice(0, 8), 16);
  const rate = 0.0001 + (seed % 1000) / 1000000;
  const total = 10 + (seed % 5000) / 100;
  return { rate, total };
}

function SparklineChart({ data, color = "#f59e0b" }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const step = w / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  const trend = data[data.length - 1] > data[0];
  const trendColor = trend ? "#22c55e" : "#ef4444";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-grad)" />
      <path d={linePath} fill="none" stroke={trendColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={parseFloat(points[points.length - 1].split(",")[1])} r="2.5" fill={trendColor} />
    </svg>
  );
}

export function LiveEarnings({
  compact = false,
  initialTotal = 42.5837,
  ratePerSecond = 0.0003,
  monthlyTarget = 2000,
  enableViewOnly = false,
}: LiveEarningsProps) {
  const [viewAddress, setViewAddress] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [viewData, setViewData] = useState({ rate: ratePerSecond, total: initialTotal });

  const effectiveRate = viewMode ? viewData.rate : ratePerSecond;
  const effectiveInitial = viewMode ? viewData.total : initialTotal;

  const [total, setTotal] = useState(effectiveInitial);
  const [todayEarnings] = useState(viewMode ? viewData.total * 0.3 : 12.45);
  const [monthEarnings, setMonthEarnings] = useState(viewMode ? viewData.total * 8.5 : 1245.67);
  const [prevTotal, setPrevTotal] = useState(effectiveInitial);
  const [animating, setAnimating] = useState(false);
  const [weeklyData] = useState(generateWeeklyData);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const accumulatedRef = useRef(0);

  const handleViewAddress = () => {
    const addr = viewAddress.trim();
    if (!addr || addr.length < 10) return;
    const data = generateDataFromAddress(addr);
    setViewData(data);
    setViewMode(true);
    setTotal(data.total);
    setPrevTotal(data.total);
    setMonthEarnings(data.total * 8.5);
  };

  const exitViewMode = () => {
    setViewMode(false);
    setViewAddress("");
    setTotal(initialTotal);
    setPrevTotal(initialTotal);
    setMonthEarnings(1245.67);
  };

  const tick = useCallback(
    (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const randomMultiplier = 0.3 + Math.random() * 3;
      const increment = effectiveRate * delta * randomMultiplier;

      accumulatedRef.current += increment;

      if (accumulatedRef.current > effectiveRate * 0.1) {
        setPrevTotal((prev) => {
          setTotal((t) => {
            const newTotal = t + accumulatedRef.current;
            setMonthEarnings((m) => m + accumulatedRef.current);
            accumulatedRef.current = 0;
            return newTotal;
          });
          return prev;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [effectiveRate]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

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
      <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-[#1a1a1a] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
        <div className="relative">
          <div className="mb-1 flex items-center gap-2 text-sm text-[#848E9C]">
            <DollarSign className="h-4 w-4 text-[#F0B90B]" />
            Live Earnings
          </div>
          <div className="flex items-baseline gap-3">
            <span className="live-earnings-digit font-mono text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              ${formatUSDC(total)}
            </span>
            <span className="live-earnings-rate text-sm font-medium text-[#00D4AA]">
              +${effectiveRate.toFixed(4)}/s
            </span>
          </div>
          <p className="mt-1 text-xs text-[#848E9C]">USDC earned in real-time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-[#1a1a1a]">
      <div className="absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-amber-500/8 blur-3xl" />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <DollarSign className="h-5 w-5 text-[#F0B90B]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#EAECEF]">
                {viewMode ? "Viewing Address" : "Live Earnings"}
                <span className="ml-2 inline-flex items-center rounded-full bg-gray-700/50 px-2 py-0.5 text-[10px] font-medium text-[#848E9C] uppercase tracking-wider">Demo</span>
              </h2>
              <p className="text-xs text-[#848E9C]">
                {viewMode
                  ? `${viewAddress.slice(0, 6)}...${viewAddress.slice(-4)}`
                  : "Real-time USDC streaming"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewMode && (
              <button
                onClick={exitViewMode}
                className="rounded-lg bg-[#2B3139] px-3 py-1.5 text-xs text-[#848E9C] transition hover:bg-white/[0.1] hover:text-[#EAECEF]"
              >
                Exit View
              </button>
            )}
            <div className="flex items-center gap-1 rounded-full bg-[#00D4AA]/10 px-3 py-1">
              <span className="live-earnings-pulse h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-[#00D4AA]">
                {viewMode ? "View-only" : "Streaming"}
              </span>
            </div>
          </div>
        </div>

        {/* View-only Address Input */}
        {enableViewOnly && !viewMode && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#2B3139] bg-[#1E2329] p-3">
            <Eye className="h-4 w-4 shrink-0 text-[#848E9C]" />
            <input
              type="text"
              value={viewAddress}
              onChange={(e) => setViewAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleViewAddress()}
              placeholder="View any address (0x...)"
              className="flex-1 bg-transparent text-sm text-[#EAECEF] outline-none placeholder:text-[#848E9C]"
            />
            <button
              onClick={handleViewAddress}
              disabled={!viewAddress.trim() || viewAddress.trim().length < 10}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-[#F0B90B] transition hover:bg-amber-500/25 disabled:opacity-30"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        )}

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
            <TrendingUp className="h-4 w-4 text-[#00D4AA]" />
            <span className="live-earnings-rate text-sm font-medium text-[#00D4AA]">
              +${effectiveRate.toFixed(4)}/s
            </span>
            <span className="text-xs text-[#848E9C]">USDC</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-4 text-center">
            <p className="mb-1 text-xs text-[#848E9C]">Today</p>
            <p className="text-lg font-bold text-[#00D4AA]">
              +${todayEarnings.toFixed(2)}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-emerald-500">
              <ChevronUp className="h-3 w-3" />
              <span>+8.3%</span>
            </div>
          </div>
          <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-4 text-center">
            <p className="mb-1 text-xs text-[#848E9C]">This Month</p>
            <p className="text-lg font-bold text-[#EAECEF]">
              ${formatCompact(monthEarnings)}
            </p>
            <p className="mt-1 text-[10px] text-[#848E9C]">
              {monthProgress.toFixed(0)}% of goal
            </p>
          </div>
          <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-4 text-center">
            <p className="mb-1 text-xs text-[#848E9C]">Annual (est.)</p>
            <p className="text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              {formatCompact(annualProjection)}
            </p>
            <p className="mt-1 text-[10px] text-[#848E9C]">projected</p>
          </div>
        </div>

        {/* 7-Day Trend + 30-Day Forecast */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-[#848E9C]">7-Day Trend</p>
              {weeklyData[weeklyData.length - 1] > weeklyData[0] ? (
                <span className="flex items-center gap-0.5 text-[10px] text-[#00D4AA]">
                  <ArrowUpRight className="h-3 w-3" /> +12%
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-[10px] text-[#F6465D]">
                  <ArrowDownRight className="h-3 w-3" /> -5%
                </span>
              )}
            </div>
            <SparklineChart data={weeklyData} />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-[#848E9C]">Mon</span>
              <span className="text-[10px] text-[#848E9C]">Today</span>
            </div>
          </div>
          <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-4">
            <p className="mb-2 flex items-center gap-1 text-xs text-[#848E9C]">
              <Calendar className="h-3 w-3" />
              30-Day Forecast
            </p>
            <p className="text-2xl font-bold text-[#EAECEF]">
              {formatCompact(effectiveRate * 86400 * 30)}
            </p>
            <p className="mt-1 text-[10px] text-[#848E9C]">
              Based on current streaming rate
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2B3139]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                style={{ width: `${Math.min(monthProgress, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-[#848E9C]">{monthProgress.toFixed(0)}% to monthly goal</p>
          </div>
        </div>

        {/* Progress Bar with Flowing Light */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#848E9C] flex items-center gap-1">
              <Target className="h-3 w-3" />
              Monthly Goal
            </span>
            <span className="text-[#848E9C]">
              ${formatCompact(monthEarnings)} / ${formatCompact(monthlyTarget)}
            </span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-[#2B3139]">
            <div
              className="live-earnings-progress absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"
              style={{ width: `${monthProgress}%` }}
            >
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
