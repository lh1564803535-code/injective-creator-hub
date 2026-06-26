"use client";

import { LoadingSpinner } from "./LoadingSpinner";
import { Progress } from "./Progress";

// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

function SkeletonLine({ width = "100%", height = "16px", className = "" }: SkeletonLineProps) {
  return (
    <div
      className={`animate-pulse rounded bg-white/[0.06] ${className}`}
      style={{ width, height }}
    />
  );
}

// ---------------------------------------------------------------------------
// Skeleton screens
// ---------------------------------------------------------------------------

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
      <SkeletonLine width="40%" height="20px" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={`${60 + Math.random() * 30}%`}
          height="14px"
        />
      ))}
    </div>
  );
}

export function SkeletonCampaignCard() {
  return (
    <div className="min-w-[280px] max-w-[340px] rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
      {/* Status + timer */}
      <div className="flex items-center justify-between">
        <SkeletonLine width="60px" height="24px" className="rounded-full" />
        <SkeletonLine width="80px" height="14px" />
      </div>
      {/* Title */}
      <SkeletonLine width="75%" height="22px" />
      {/* Description */}
      <SkeletonLine width="100%" height="14px" />
      <SkeletonLine width="60%" height="14px" />
      {/* Stats */}
      <div className="flex gap-4 pt-2">
        <SkeletonLine width="80px" height="20px" />
        <SkeletonLine width="40px" height="20px" />
      </div>
    </div>
  );
}

export function SkeletonCreatorRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      {/* Rank */}
      <SkeletonLine width="32px" height="32px" className="rounded-full" />
      {/* Avatar */}
      <SkeletonLine width="40px" height="40px" className="rounded-full" />
      {/* Info */}
      <div className="flex-1 space-y-2">
        <SkeletonLine width="120px" height="14px" />
        <SkeletonLine width="80px" height="12px" />
      </div>
      {/* Earnings */}
      <SkeletonLine width="80px" height="16px" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading overlay with spinner + message
// ---------------------------------------------------------------------------

interface LoadingOverlayProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "amber" | "emerald";
}

export function LoadingOverlay({
  message = "Loading...",
  size = "md",
  color = "cyan",
}: LoadingOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <LoadingSpinner size={size} color={color} />
      <p className="text-sm text-gray-500 animate-pulse">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full-page loading state
// ---------------------------------------------------------------------------

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-500 animate-pulse">{message}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress-based loading
// ---------------------------------------------------------------------------

interface LoadingProgressProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  color?: "cyan" | "amber" | "emerald" | "purple";
}

export function LoadingProgress({
  value,
  label,
  showPercentage = true,
  color = "cyan",
}: LoadingProgressProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-gray-400">{label}</span>}
          {showPercentage && (
            <span className="text-gray-500 tabular-nums">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <Progress value={percentage} color={color} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline loading dots animation
// ---------------------------------------------------------------------------

export function LoadingDots({ color = "cyan" }: { color?: "cyan" | "amber" | "emerald" }) {
  const dotColor = {
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
    emerald: "bg-emerald-400",
  }[color];

  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-bounce`}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
