"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  prefix,
  suffix,
  className = "",
}: MetricCardProps) {
  const changeColor =
    change !== undefined
      ? change > 0
        ? "text-emerald-400"
        : change < 0
        ? "text-red-400"
        : "text-gray-400"
      : "";

  const ChangeIcon =
    change !== undefined
      ? change > 0
        ? TrendingUp
        : change < 0
        ? TrendingDown
        : Minus
      : null;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white">
        {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
      </p>
      {change !== undefined && (
        <div className={`mt-1 flex items-center gap-1 ${changeColor}`}>
          {ChangeIcon && <ChangeIcon className="h-3 w-3" />}
          <span className="text-xs">
            {change > 0 ? "+" : ""}{change.toFixed(2)}%
          </span>
          {changeLabel && <span className="text-xs text-gray-500">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
