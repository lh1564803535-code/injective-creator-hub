"use client";

import { useState } from "react";
import {
  Award,
  Lock,
  Star,
  Zap,
  Trophy,
  Target,
  Flame,
  Crown,
  HandCoins,
  Vote,
  Upload,
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof Award;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
  unlockedAt?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-submit",
    name: "First Steps",
    description: "Submit your first campaign entry",
    icon: Upload,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rarity: "common",
    xp: 10,
    unlockedAt: "2026-06-01",
  },
  {
    id: "first-vote",
    name: "Voice Heard",
    description: "Cast your first vote on a submission",
    icon: Vote,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rarity: "common",
    xp: 10,
    unlockedAt: "2026-06-02",
  },
  {
    id: "first-tip",
    name: "Generous Soul",
    description: "Send your first tip to a creator",
    icon: HandCoins,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "common",
    xp: 15,
  },
  {
    id: "five-campaigns",
    name: "Campaign Hopper",
    description: "Participate in 5 different campaigns",
    icon: Target,
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    rarity: "rare",
    xp: 50,
  },
  {
    id: "streak-7",
    name: "On Fire",
    description: "Maintain a 7-day activity streak",
    icon: Flame,
    unlocked: false,
    progress: 4,
    maxProgress: 7,
    rarity: "rare",
    xp: 75,
  },
  {
    id: "top-creator",
    name: "Rising Star",
    description: "Reach the top 10 on the leaderboard",
    icon: Star,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "epic",
    xp: 200,
  },
  {
    id: "earnings-100",
    name: "Century Club",
    description: "Earn 100 USDC in total rewards",
    icon: Trophy,
    unlocked: false,
    progress: 42,
    maxProgress: 100,
    rarity: "epic",
    xp: 150,
  },
  {
    id: "legend",
    name: "Injective Legend",
    description: "Unlock all other achievements",
    icon: Crown,
    unlocked: false,
    progress: 2,
    maxProgress: 7,
    rarity: "legendary",
    xp: 500,
  },
];

const rarityColors: Record<Achievement["rarity"], string> = {
  common: "border-gray-500/20 bg-gray-500/5",
  rare: "border-cyan-500/20 bg-cyan-500/5",
  epic: "border-purple-500/20 bg-purple-500/5",
  legendary: "border-amber-500/20 bg-amber-500/5",
};

const rarityText: Record<Achievement["rarity"], string> = {
  common: "text-gray-400",
  rare: "text-cyan-400",
  epic: "text-purple-400",
  legendary: "text-amber-400",
};

const rarityBadge: Record<Achievement["rarity"], string> = {
  common: "bg-gray-500/10 text-gray-400",
  rare: "bg-cyan-500/10 text-cyan-400",
  epic: "bg-purple-500/10 text-purple-400",
  legendary: "bg-amber-500/10 text-amber-400",
};

function UnlockAnimation({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 animate-[shimmer_2s_ease-in-out]" />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export function AchievementSystem() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  const totalXP = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((s, a) => s + a.xp, 0);
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  const handleSimulateUnlock = (id: string) => {
    setJustUnlocked(id);
    setTimeout(() => setJustUnlocked(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Achievements</h3>
        </div>
        <span className="text-xs text-gray-600">
          {unlockedCount}/{ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-3 w-3 text-amber-400" />
        <span className="text-xs text-gray-500">{totalXP} XP earned</span>
      </div>

      <div className="space-y-2">
        {ACHIEVEMENTS.map((ach) => {
          const Icon = ach.icon;
          const pct = ach.maxProgress > 0 ? (ach.progress / ach.maxProgress) * 100 : 0;
          const isExpanded = expandedId === ach.id;

          return (
            <div
              key={ach.id}
              className={`relative rounded-xl border p-3 transition cursor-pointer ${
                ach.unlocked
                  ? rarityColors[ach.rarity]
                  : "border-white/[0.04] bg-white/[0.01] opacity-60"
              } hover:opacity-100`}
              onClick={() => setExpandedId(isExpanded ? null : ach.id)}
            >
              <UnlockAnimation show={justUnlocked === ach.id} />

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    ach.unlocked
                      ? rarityBadge[ach.rarity]
                      : "bg-white/[0.04] text-gray-600"
                  }`}
                >
                  {ach.unlocked ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        ach.unlocked ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {ach.name}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase ${rarityBadge[ach.rarity]}`}
                    >
                      {ach.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">
                    {ach.description}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium ${
                    ach.unlocked ? rarityText[ach.rarity] : "text-gray-600"
                  }`}
                >
                  +{ach.xp} XP
                </span>
              </div>

              {!ach.unlocked && ach.maxProgress > 0 && (
                <div className="mt-2.5 ml-12">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-600">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {Math.round(pct)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        ach.rarity === "legendary"
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : ach.rarity === "epic"
                          ? "bg-gradient-to-r from-purple-500 to-violet-400"
                          : ach.rarity === "rare"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-400"
                          : "bg-gray-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {isExpanded && (
                <div className="mt-3 ml-12 pt-3 border-t border-white/[0.04]">
                  {ach.unlocked && ach.unlockedAt && (
                    <p className="text-[10px] text-gray-600">
                      Unlocked on {ach.unlockedAt}
                    </p>
                  )}
                  {!ach.unlocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulateUnlock(ach.id);
                      }}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Preview unlock animation
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
