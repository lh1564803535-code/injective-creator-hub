"use client";

import { Star, Zap } from "lucide-react";

interface LevelBadgeProps {
  level: number;
  xp?: number;
  maxXp?: number;
  showProgress?: boolean;
  className?: string;
}

const levelColors: Record<number, string> = {
  1: "text-gray-400 bg-gray-500/10",
  2: "text-green-400 bg-green-500/10",
  3: "text-blue-400 bg-blue-500/10",
  4: "text-purple-400 bg-purple-500/10",
  5: "text-amber-400 bg-amber-500/10",
};

export function LevelBadge({
  level,
  xp,
  maxXp,
  showProgress = false,
  className = "",
}: LevelBadgeProps) {
  const color = levelColors[Math.min(level, 5)] || levelColors[5];
  const percentage = xp && maxXp ? (xp / maxXp) * 100 : 0;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${color}`}>
        <Star className="h-3 w-3" />
        Lv.{level}
      </span>
      {showProgress && xp !== undefined && maxXp !== undefined && (
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500">{xp}/{maxXp} XP</span>
        </div>
      )}
    </div>
  );
}
