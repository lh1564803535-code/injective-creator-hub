"use client";

import { useState } from "react";
import { Award, Lock, Star, Zap, Trophy, Target, Flame, Crown } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof Award;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-campaign",
    name: "First Steps",
    description: "Join your first campaign",
    icon: Target,
    unlocked: true,
    rarity: "common",
    xp: 10,
  },
  {
    id: "first-vote",
    name: "Voice Heard",
    description: "Cast your first vote",
    icon: Star,
    unlocked: true,
    rarity: "common",
    xp: 10,
  },
  {
    id: "earn-100",
    name: "Century Club",
    description: "Earn 100 USDC",
    icon: Trophy,
    unlocked: true,
    progress: 100,
    maxProgress: 100,
    rarity: "rare",
    xp: 50,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "7-day activity streak",
    icon: Flame,
    unlocked: true,
    progress: 7,
    maxProgress: 7,
    rarity: "rare",
    xp: 50,
  },
  {
    id: "earn-1000",
    name: "Grand Earner",
    description: "Earn 1,000 USDC",
    icon: Crown,
    unlocked: false,
    progress: 245,
    maxProgress: 1000,
    rarity: "epic",
    xp: 200,
  },
  {
    id: "top-10",
    name: "Top 10",
    description: "Reach top 10 on leaderboard",
    icon: Zap,
    unlocked: false,
    progress: 42,
    maxProgress: 10,
    rarity: "epic",
    xp: 200,
  },
  {
    id: "win-5",
    name: "Campaign Champion",
    description: "Win 5 campaigns",
    icon: Trophy,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    rarity: "legendary",
    xp: 500,
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "30-day activity streak",
    icon: Flame,
    unlocked: false,
    progress: 12,
    maxProgress: 30,
    rarity: "legendary",
    xp: 500,
  },
];

const rarityColors = {
  common: { border: "border-gray-500/30", bg: "bg-gray-500/10", text: "text-gray-400", glow: "" },
  rare: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "shadow-cyan-500/10" },
  epic: { border: "border-purple-500/30", bg: "bg-purple-500/10", text: "text-purple-400", glow: "shadow-purple-500/10" },
  legendary: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-amber-500/10" },
};

export function AchievementBadges() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const totalXP = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Award className="h-5 w-5 text-amber-400" />
          Achievements
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {unlockedCount}/{ACHIEVEMENTS.length} unlocked
          </span>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
            {totalXP} XP
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {ACHIEVEMENTS.map((achievement) => {
          const Icon = achievement.icon;
          const colors = rarityColors[achievement.rarity];
          const isSelected = selectedId === achievement.id;

          return (
            <button
              key={achievement.id}
              onClick={() => setSelectedId(isSelected ? null : achievement.id)}
              className={`group relative flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
                achievement.unlocked
                  ? `${colors.border} ${colors.bg} hover:scale-105`
                  : "border-white/[0.04] bg-white/[0.02] opacity-50"
              } ${isSelected ? "ring-2 ring-cyan-500/50" : ""}`}
            >
              {achievement.unlocked ? (
                <Icon className={`h-6 w-6 ${colors.text}`} />
              ) : (
                <Lock className="h-6 w-6 text-gray-600" />
              )}
              <span className="text-[9px] text-gray-500 text-center leading-tight">
                {achievement.name}
              </span>

              {/* Progress indicator */}
              {achievement.progress !== undefined && !achievement.unlocked && (
                <div className="absolute bottom-1 left-1 right-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${colors.bg.replace("/10", "/40")}`}
                    style={{
                      width: `${Math.min(
                        (achievement.progress / (achievement.maxProgress || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected achievement detail */}
      {selectedId && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          {(() => {
            const achievement = ACHIEVEMENTS.find((a) => a.id === selectedId);
            if (!achievement) return null;
            const colors = rarityColors[achievement.rarity];
            const Icon = achievement.icon;

            return (
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}>
                  {achievement.unlocked ? (
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  ) : (
                    <Lock className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{achievement.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${colors.bg} ${colors.text}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{achievement.description}</p>

                  {achievement.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500`}
                          style={{
                            width: `${Math.min(
                              (achievement.progress / (achievement.maxProgress || 1)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <p className="mt-2 text-xs text-amber-400">+{achievement.xp} XP</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
