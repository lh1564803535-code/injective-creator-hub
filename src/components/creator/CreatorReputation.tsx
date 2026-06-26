"use client";

import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Star,
  Flame,
  Trophy,
  Target,
  Zap,
  Award,
  TrendingUp,
  Crown,
  Gem,
  Heart,
  Rocket,
  Lock,
  CheckCircle2,
} from "lucide-react";
import type { Address } from "viem";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  bgColor: string;
  borderColor: string;
  unlocked: boolean;
  progress?: number; // 0-100
  requirement?: string;
}

interface ReputationBreakdown {
  earnings: number; // 0-100
  consistency: number; // 0-100
  engagement: number; // 0-100
  quality: number; // 0-100
  longevity: number; // 0-100
}

interface ReputationData {
  score: number; // 0-100
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  breakdown: ReputationBreakdown;
  achievements: Achievement[];
  streakDays: number;
  totalCampaigns: number;
  winRate: number; // percentage
}

// ---------------------------------------------------------------------------
// Mock reputation data per address
// ---------------------------------------------------------------------------

const MOCK_REPUTATION: Record<string, ReputationData> = {
  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e": {
    score: 92,
    tier: "Diamond",
    breakdown: { earnings: 95, consistency: 88, engagement: 90, quality: 94, longevity: 85 },
    achievements: [
      { id: "first-sub", name: "First Steps", description: "Submit your first content", icon: Rocket, color: "text-cyan-400", bgColor: "bg-cyan-500/15", borderColor: "border-cyan-500/30", unlocked: true },
      { id: "top-voter", name: "Community Voice", description: "Receive 100+ votes", icon: Heart, color: "text-pink-400", bgColor: "bg-pink-500/15", borderColor: "border-pink-500/30", unlocked: true },
      { id: "high-earner", name: "USDC Whale", description: "Earn 1000+ USDC", icon: Gem, color: "text-amber-400", bgColor: "bg-amber-500/15", borderColor: "border-amber-500/30", unlocked: true },
      { id: "streak-7", name: "On Fire", description: "7-day submission streak", icon: Flame, color: "text-orange-400", bgColor: "bg-orange-500/15", borderColor: "border-orange-500/30", unlocked: true },
      { id: "campaign-10", name: "Veteran", description: "Participate in 10 campaigns", icon: Shield, color: "text-emerald-400", bgColor: "bg-emerald-500/15", borderColor: "border-emerald-500/30", unlocked: true },
      { id: "top-3", name: "Podium Finish", description: "Finish top 3 in any campaign", icon: Crown, color: "text-yellow-400", bgColor: "bg-yellow-500/15", borderColor: "border-yellow-500/30", unlocked: true },
      { id: "perfect-score", name: "Flawless", description: "Get a 5-star average rating", icon: Star, color: "text-purple-400", bgColor: "bg-purple-500/15", borderColor: "border-purple-500/30", unlocked: false, progress: 80, requirement: "5-star avg rating" },
      { id: "streak-30", name: "Unstoppable", description: "30-day submission streak", icon: Target, color: "text-red-400", bgColor: "bg-red-500/15", borderColor: "border-red-500/30", unlocked: false, progress: 23, requirement: "30-day streak" },
    ],
    streakDays: 7,
    totalCampaigns: 12,
    winRate: 75,
  },
  default: {
    score: 45,
    tier: "Silver",
    breakdown: { earnings: 40, consistency: 55, engagement: 42, quality: 48, longevity: 35 },
    achievements: [
      { id: "first-sub", name: "First Steps", description: "Submit your first content", icon: Rocket, color: "text-cyan-400", bgColor: "bg-cyan-500/15", borderColor: "border-cyan-500/30", unlocked: true },
      { id: "top-voter", name: "Community Voice", description: "Receive 100+ votes", icon: Heart, color: "text-pink-400", bgColor: "bg-pink-500/15", borderColor: "border-pink-500/30", unlocked: false, progress: 32, requirement: "100 votes" },
      { id: "high-earner", name: "USDC Whale", description: "Earn 1000+ USDC", icon: Gem, color: "text-amber-400", bgColor: "bg-amber-500/15", borderColor: "border-amber-500/30", unlocked: false, progress: 50, requirement: "1000 USDC" },
      { id: "streak-7", name: "On Fire", description: "7-day submission streak", icon: Flame, color: "text-orange-400", bgColor: "bg-orange-500/15", borderColor: "border-orange-500/30", unlocked: false, progress: 42, requirement: "7-day streak" },
      { id: "campaign-10", name: "Veteran", description: "Participate in 10 campaigns", icon: Shield, color: "text-emerald-400", bgColor: "bg-emerald-500/15", borderColor: "border-emerald-500/30", unlocked: false, progress: 30, requirement: "10 campaigns" },
      { id: "top-3", name: "Podium Finish", description: "Finish top 3 in any campaign", icon: Crown, color: "text-yellow-400", bgColor: "bg-yellow-500/15", borderColor: "border-yellow-500/30", unlocked: false, progress: 0, requirement: "Top 3 finish" },
    ],
    streakDays: 3,
    totalCampaigns: 3,
    winRate: 33,
  },
};

// ---------------------------------------------------------------------------
// Radar Chart (SVG)
// ---------------------------------------------------------------------------

function RadarChart({ breakdown, animated }: { breakdown: ReputationBreakdown; animated: boolean }) {
  const center = 100;
  const maxRadius = 80;
  const labels = ["Earnings", "Consistency", "Engagement", "Quality", "Longevity"];
  const values = [breakdown.earnings, breakdown.consistency, breakdown.engagement, breakdown.quality, breakdown.longevity];
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, value: number) {
    const angle = startAngle + index * angleStep;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  }

  // Grid circles
  const gridLevels = [20, 40, 60, 80, 100];

  // Data polygon
  const dataPoints = values.map((v, i) => getPoint(i, animated ? v : 0));
  const pathD = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = Array.from({ length: 5 }, (_, i) => getPoint(i, level));
        const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={level} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />;
      })}

      {/* Axes */}
      {values.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />;
      })}

      {/* Data area */}
      <path
        d={pathD}
        fill="url(#radarGradient)"
        stroke="rgba(34,211,238,0.6)"
        strokeWidth="1.5"
        style={{
          transition: animated ? "all 1s cubic-bezier(0.4,0,0.2,1)" : "none",
        }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#22d3ee"
          stroke="#0a0a0a"
          strokeWidth="1.5"
          style={{
            transition: animated ? "all 1s cubic-bezier(0.4,0,0.2,1)" : "none",
          }}
        />
      ))}

      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(i, 115);
        return (
          <text
            key={label}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-500 text-[8px]"
          >
            {label}
          </text>
        );
      })}

      <defs>
        <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.15)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.02)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Animated Score Ring
// ---------------------------------------------------------------------------

function ScoreRing({ score, tier, animated }: { score: number; tier: string; animated: boolean }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? (score / 100) * circumference : 0);

  const tierColors: Record<string, { stroke: string; text: string; glow: string }> = {
    Bronze: { stroke: "#cd7f32", text: "text-orange-400", glow: "shadow-orange-500/20" },
    Silver: { stroke: "#c0c0c0", text: "text-gray-300", glow: "shadow-gray-400/20" },
    Gold: { stroke: "#ffd700", text: "text-yellow-400", glow: "shadow-yellow-500/20" },
    Platinum: { stroke: "#e5e4e2", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
    Diamond: { stroke: "#b9f2ff", text: "text-cyan-400", glow: "shadow-cyan-500/30" },
  };

  const colors = tierColors[tier] ?? tierColors.Bronze;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="130" height="130" className="-rotate-90">
        {/* Background ring */}
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        {/* Score ring */}
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" : "none",
            filter: `drop-shadow(0 0 6px ${colors.stroke}40)`,
          }}
        />
      </svg>
      <div className="absolute text-center">
        <p className={`text-3xl font-bold ${colors.text}`}>{score}</p>
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
          {tier}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Achievement Badge
// ---------------------------------------------------------------------------

function AchievementBadge({ achievement, index }: { achievement: Achievement; index: number }) {
  const Icon = achievement.icon;

  if (!achievement.unlocked && achievement.progress !== undefined) {
    return (
      <div
        className={`group relative flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]`}
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] opacity-40">
            <Icon className="h-5 w-5 text-gray-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0a0a0a]">
            <Lock className="h-2.5 w-2.5 text-gray-600" />
          </div>
        </div>
        <p className="text-center text-[10px] font-medium text-gray-500">{achievement.name}</p>
        {/* Progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
            style={{ width: `${achievement.progress}%` }}
          />
        </div>
        <p className="text-[9px] text-gray-600">{achievement.progress}% &middot; {achievement.requirement}</p>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex flex-col items-center gap-2 rounded-xl border ${achievement.borderColor} ${achievement.bgColor} p-3 transition-all hover:scale-105 ${
        achievement.unlocked ? "" : "opacity-30"
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${achievement.bgColor}`}>
        <Icon className={`h-5 w-5 ${achievement.color}`} />
      </div>
      <p className="text-center text-[10px] font-medium text-gray-300">{achievement.name}</p>
      {achievement.unlocked && (
        <CheckCircle2 className="absolute -right-1 -top-1 h-4 w-4 text-emerald-400" />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CreatorReputation({ address }: { address: Address }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const data = MOCK_REPUTATION[address] ?? MOCK_REPUTATION.default;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const unlockedCount = data.achievements.filter((a) => a.unlocked).length;
  const totalCount = data.achievements.length;

  return (
    <div ref={ref} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">On-Chain Reputation</h2>
        <span className="ml-auto rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
          {unlockedCount}/{totalCount} Badges
        </span>
      </div>

      {/* Score + Radar */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Score Ring + Stats */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <ScoreRing score={data.score} tier={data.tier} animated={animated} />

          <div className="grid w-full grid-cols-3 gap-3">
            {[
              { label: "Streak", value: `${data.streakDays}d`, icon: Flame, color: "text-orange-400" },
              { label: "Campaigns", value: String(data.totalCampaigns), icon: Target, color: "text-cyan-400" },
              { label: "Win Rate", value: `${data.winRate}%`, icon: TrendingUp, color: "text-emerald-400" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.03] p-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <p className="text-sm font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-600">
            Reputation Breakdown
          </p>
          <div className="h-48 w-48">
            <RadarChart breakdown={data.breakdown} animated={animated} />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-400">Achievements</p>
          <p className="text-xs text-gray-600">
            <span className="text-emerald-400">{unlockedCount}</span> unlocked
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.achievements.map((achievement, i) => (
            <AchievementBadge key={achievement.id} achievement={achievement} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
