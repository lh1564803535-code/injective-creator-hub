"use client";

import { Star, Shield, TrendingUp } from "lucide-react";

interface ReputationScoreProps {
  score: number;
  tier?: string;
  change?: number;
  className?: string;
}

const tierConfig: Record<string, { color: string; label: string }> = {
  bronze: { color: "text-orange-400 bg-orange-500/10", label: "Bronze" },
  silver: { color: "text-gray-300 bg-gray-500/10", label: "Silver" },
  gold: { color: "text-amber-400 bg-amber-500/10", label: "Gold" },
  platinum: { color: "text-cyan-400 bg-cyan-500/10", label: "Platinum" },
  diamond: { color: "text-purple-400 bg-purple-500/10", label: "Diamond" },
};

export function ReputationScore({
  score,
  tier,
  change,
  className = "",
}: ReputationScoreProps) {
  const tierConfig_ = tier ? tierConfig[tier] : null;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium text-white">Reputation</span>
        </div>
        {tierConfig_ && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tierConfig_.color}`}>
            {tierConfig_.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
        <div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(score / 20) ? "text-amber-400" : "text-gray-600"}`}
                fill={i < Math.floor(score / 20) ? "currentColor" : "none"}
              />
            ))}
          </div>
          {change !== undefined && (
            <div className={`mt-1 flex items-center gap-1 ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs">{change >= 0 ? "+" : ""}{change}% this week</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
