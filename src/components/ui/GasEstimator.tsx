"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Fuel, Zap, TrendingDown, Activity } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GasEstimatorProps {
  /** Transaction type for estimation */
  type?: "vote" | "submit" | "claim" | "transfer" | "deploy";
  className?: string;
}

interface GasEstimate {
  gas: string;
  usd: string;
  speed: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GAS_ESTIMATES: Record<string, GasEstimate> = {
  vote: { gas: "0.001", usd: "0.02", speed: "instant" },
  submit: { gas: "0.002", usd: "0.04", speed: "instant" },
  claim: { gas: "0.001", usd: "0.02", speed: "instant" },
  transfer: { gas: "0.001", usd: "0.02", speed: "instant" },
  deploy: { gas: "0.05", usd: "1.00", speed: "~5s" },
};

// ---------------------------------------------------------------------------
// Animated Number
// ---------------------------------------------------------------------------

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 3,
}: {
  value: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = parseFloat(prevRef.current) || 0;
    const to = parseFloat(value) || 0;
    if (from === to) return;

    const duration = 600;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = from + (to - from) * eased;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    prevRef.current = value;
  }, [value, decimals]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GasEstimator({ type = "transfer", className = "" }: GasEstimatorProps) {
  const [estimate, setEstimate] = useState(GAS_ESTIMATES[type]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEstimate(GAS_ESTIMATES[type]);
  }, [type]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      label: "Gas Cost",
      value: estimate.gas,
      suffix: " INJ",
      color: "text-emerald-400",
    },
    {
      label: "USD Equiv",
      value: estimate.usd,
      prefix: "$",
      color: "text-white",
    },
    {
      label: "Speed",
      value: null as string | null,
      display: estimate.speed,
      color: "text-amber-400",
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${className}`}
    >
      {/* Header with green indicator */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
            <Fuel className="h-4 w-4 text-emerald-400" />
            {/* Green indicator light */}
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Gas Estimate</p>
            <p className="text-[10px] text-gray-500">Injective EVM</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1">
          <Activity className="h-3 w-3 text-emerald-400" />
          <span className="text-[10px] font-medium text-emerald-400">Live</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-white/[0.02] p-2.5 text-center transition hover:bg-white/[0.04]"
          >
            <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
              {stat.label}
            </p>
            {stat.value !== null ? (
              <p className={`font-mono text-base font-bold ${stat.color}`}>
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" />
                <p className="text-sm font-medium text-amber-400">
                  {stat.display}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Near-zero gas hint */}
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
        <TrendingDown className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
        <p className="text-[11px] leading-tight text-emerald-400">
          Near-zero gas fees on Injective &mdash; 99% cheaper than Ethereum
        </p>
      </div>
    </div>
  );
}
