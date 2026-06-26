"use client";

import { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProgressVariant = "linear" | "circular";
type ProgressColor = "cyan" | "emerald" | "amber" | "violet" | "blue";

interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Visual variant */
  variant?: ProgressVariant;
  /** Color theme */
  color?: ProgressColor;
  /** Show percentage label */
  showPercentage?: boolean;
  /** Custom label text (overrides percentage) */
  label?: string;
  /** Size for linear: sm/md/lg; for circular: pixel diameter */
  size?: "sm" | "md" | "lg" | number;
  /** Animate on intersection */
  animate?: boolean;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Color Map
// ---------------------------------------------------------------------------

const gradientMap: Record<ProgressColor, string> = {
  cyan: "from-cyan-500 to-blue-500",
  emerald: "from-emerald-500 to-emerald-400",
  amber: "from-amber-500 to-yellow-400",
  violet: "from-violet-500 to-purple-400",
  blue: "from-blue-500 to-indigo-400",
};

const strokeMap: Record<ProgressColor, string> = {
  cyan: "#22d3ee",
  emerald: "#34d399",
  amber: "#fbbf24",
  violet: "#a78bfa",
  blue: "#60a5fa",
};

const linearSizeMap = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

// ---------------------------------------------------------------------------
// Linear Progress
// ---------------------------------------------------------------------------

function LinearProgress({
  percentage,
  color,
  size,
  showPercentage,
  label,
  animated,
}: {
  percentage: number;
  color: ProgressColor;
  size: "sm" | "md" | "lg";
  showPercentage: boolean;
  label?: string;
  animated: boolean;
}) {
  return (
    <div className="w-full">
      {(showPercentage || label) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-gray-400">{label ?? "Progress"}</span>
          <span className="font-mono tabular-nums text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-white/[0.06] ${linearSizeMap[size]}`}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientMap[color]} transition-all duration-1000 ease-out`}
          style={{
            width: animated ? `${percentage}%` : "0%",
            boxShadow: `0 0 12px ${strokeMap[color]}40`,
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Circular Progress
// ---------------------------------------------------------------------------

function CircularProgress({
  percentage,
  color,
  diameter,
  showPercentage,
  label,
  animated,
}: {
  percentage: number;
  color: ProgressColor;
  diameter: number;
  showPercentage: boolean;
  label?: string;
  animated: boolean;
}) {
  const stroke = Math.max(4, diameter * 0.08);
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.min(animated ? percentage : 0, 100) / 100) * circumference;
  const center = diameter / 2;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: diameter, height: diameter }}
    >
      <svg
        width={diameter}
        height={diameter}
        className="rotate-[-90deg]"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeMap[color]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${strokeMap[color]}50)`,
          }}
        />
      </svg>
      {/* Center label */}
      {(showPercentage || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-bold tabular-nums"
            style={{
              fontSize: Math.max(10, diameter * 0.18),
              color: strokeMap[color],
            }}
          >
            {Math.round(percentage)}%
          </span>
          {label && (
            <span
              className="text-gray-500"
              style={{ fontSize: Math.max(8, diameter * 0.1) }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ProgressBar({
  value,
  max = 100,
  variant = "linear",
  color = "cyan",
  showPercentage = false,
  label,
  size = "md",
  animate = true,
  className = "",
}: ProgressBarProps) {
  const [animated, setAnimated] = useState(!animate);
  const ref = useRef<HTMLDivElement>(null);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (!animate) return;
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div ref={ref} className={className}>
      {variant === "linear" ? (
        <LinearProgress
          percentage={percentage}
          color={color}
          size={typeof size === "string" ? size : "md"}
          showPercentage={showPercentage}
          label={label}
          animated={animated}
        />
      ) : (
        <CircularProgress
          percentage={percentage}
          color={color}
          diameter={typeof size === "number" ? size : 80}
          showPercentage={showPercentage}
          label={label}
          animated={animated}
        />
      )}
    </div>
  );
}
