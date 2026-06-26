"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  className = "",
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

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
      <p className="text-2xl font-bold text-white">{value}</p>
      {change !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-emerald-400" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-400" />
          )}
          <span className={`text-xs ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{change}%
          </span>
        </div>
      )}
    </div>
  );
}
