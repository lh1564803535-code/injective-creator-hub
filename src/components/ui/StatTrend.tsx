"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatTrendProps {
  /** Percentage change, e.g. 12.5 or -3.2 */
  value: number;
  /** Optional label suffix, default: "vs last week" */
  label?: string;
  /** Size variant */
  size?: "sm" | "md";
}

/**
 * Inline trend indicator showing percentage change with a sparkline icon.
 * Used in stat cards to show growth/decline over time.
 */
export function StatTrend({
  value,
  label = "vs last week",
  size = "sm",
}: StatTrendProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const colorClass = isNeutral
    ? "text-gray-500"
    : isPositive
      ? "text-emerald-400"
      : "text-red-400";

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  const sizeClasses = size === "sm" ? "text-[11px] gap-1" : "text-xs gap-1.5";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} ${colorClass}`}
    >
      <Icon className={iconSize} />
      <span className="font-medium">
        {isPositive ? "+" : ""}
        {value.toFixed(1)}%
      </span>
      <span className="text-gray-600">{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Mini Sparkline (pure SVG, no deps)
// ---------------------------------------------------------------------------

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

/**
 * Tiny inline sparkline chart. Pure SVG, zero dependencies.
 * `data` is an array of numeric values; the component auto-scales.
 */
export function Sparkline({
  data,
  width = 64,
  height = 24,
  color = "#22c55e",
  className = "",
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  // Gradient fill area
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sparkline-fill-${color.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#sparkline-fill-${color.replace("#", "")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
