"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Clock, Blocks, Zap, Globe } from "lucide-react";

// ---------------------------------------------------------------------------
// Simulated Injective chain metrics (would be live in production)
// ---------------------------------------------------------------------------

interface ChainMetric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon: React.ElementType;
  color: string;
  decimals?: number;
}

const BASE_METRICS: Omit<ChainMetric, "value">[] = [
  {
    label: "Block Time",
    suffix: "s",
    icon: Clock,
    color: "text-cyan-400",
    decimals: 1,
  },
  {
    label: "Total TPS",
    suffix: "",
    icon: Zap,
    color: "text-amber-400",
  },
  {
    label: "Validators",
    suffix: "",
    icon: Blocks,
    color: "text-emerald-400",
  },
  {
    label: "Chains Connected",
    suffix: "",
    icon: Globe,
    color: "text-purple-400",
  },
  {
    label: "Uptime",
    suffix: "%",
    icon: Activity,
    color: "text-rose-400",
    decimals: 2,
  },
];

const TARGET_VALUES = [0.64, 12500, 40, 25, 99.99];

// ---------------------------------------------------------------------------
// Animated value hook
// ---------------------------------------------------------------------------

function useAnimatedValue(target: number, decimals = 0, duration = 2000) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const start = performance.now();
    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((target * eased).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(update);
      else setValue(target);
    }
    requestAnimationFrame(update);
  }, [target, decimals, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Single metric
// ---------------------------------------------------------------------------

function MetricCard({ metric, index }: { metric: ChainMetric; index: number }) {
  const animatedValue = useAnimatedValue(
    metric.value,
    metric.decimals ?? 0,
    1500 + index * 200
  );

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 transition-all hover:border-white/[0.08] hover:bg-white/[0.04]">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] ${metric.color} transition-all group-hover:scale-110`}
      >
        <metric.icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-600 uppercase tracking-wider">
          {metric.label}
        </p>
        <p className="text-sm font-semibold text-white tabular-nums">
          {metric.prefix ?? ""}
          {animatedValue.toLocaleString(undefined, {
            minimumFractionDigits: metric.decimals ?? 0,
            maximumFractionDigits: metric.decimals ?? 0,
          })}
          {metric.suffix && (
            <span className="ml-0.5 text-xs text-gray-500">
              {metric.suffix}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NetworkStats() {
  const metrics: ChainMetric[] = BASE_METRICS.map((base, i) => ({
    ...base,
    value: TARGET_VALUES[i],
  }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-r from-white/[0.02] via-white/[0.01] to-white/[0.02] p-4">
      {/* Subtle background pulse */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/[0.02] via-transparent to-purple-500/[0.02]" />

      <div className="relative">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-2 w-2 items-center justify-center">
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Injective Network
          </span>
          <span className="ml-auto text-[10px] text-gray-600">
            Live Metrics
          </span>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
