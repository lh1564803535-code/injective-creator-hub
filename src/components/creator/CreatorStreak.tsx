"use client";

import { useState, useEffect, useRef } from "react";
import {
  Flame,
  Zap,
  TrendingUp,
  CheckCircle2,
  Star,
  Target,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Gamification data model
// ---------------------------------------------------------------------------

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  xp: number;
  level: number;
  weeklyActivity: number[][]; // 4 weeks x 7 days (0=none, 1-4=intensity)
  todayCheckedIn: boolean;
  totalActions: number;
}

const LEVEL_TIERS = [
  { name: "Newcomer", minXP: 0, color: "text-gray-400", icon: "🌱" },
  { name: "Contributor", minXP: 100, color: "text-emerald-400", icon: "🌿" },
  { name: "Creator", minXP: 300, color: "text-cyan-400", icon: "⚡" },
  { name: "Veteran", minXP: 650, color: "text-purple-400", icon: "🔮" },
  { name: "Legend", minXP: 1100, color: "text-amber-400", icon: "👑" },
];

function getLevelThresholds(level: number): { current: number; next: number } {
  // Fibonacci-like XP curve: 100, 200, 350, 550, 900...
  const thresholds = [0];
  let a = 100,
    b = 200;
  for (let i = 0; i < 10; i++) {
    thresholds.push(a + b);
    const next = a + b;
    a = b;
    b = next;
  }
  return {
    current: thresholds[level] ?? 0,
    next: thresholds[level + 1] ?? thresholds[thresholds.length - 1],
  };
}

function getTier(level: number) {
  return LEVEL_TIERS[Math.min(level, LEVEL_TIERS.length - 1)];
}

// ---------------------------------------------------------------------------
// Mock streak data
// ---------------------------------------------------------------------------

const MOCK_STREAK: StreakData = {
  currentStreak: 12,
  longestStreak: 28,
  xp: 480,
  level: 2,
  weeklyActivity: [
    [1, 0, 2, 1, 0, 0, 1],
    [0, 1, 1, 3, 2, 0, 0],
    [2, 1, 0, 1, 2, 3, 1],
    [1, 2, 1, 0, 0, 0, 0], // current week (today = last non-zero)
  ],
  todayCheckedIn: false,
  totalActions: 47,
};

// ---------------------------------------------------------------------------
// Animated XP counter
// ---------------------------------------------------------------------------

function AnimatedXP({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target]);

  return <>{value}</>;
}

// ---------------------------------------------------------------------------
// Fire streak animation (pure CSS)
// ---------------------------------------------------------------------------

function StreakFlame({ streak }: { streak: number }) {
  const intensity = Math.min(streak / 30, 1); // 0-1 based on streak length
  const scale = 0.8 + intensity * 0.6; // 0.8 to 1.4
  const glowOpacity = 0.2 + intensity * 0.4;

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute rounded-full blur-xl transition-all duration-1000"
        style={{
          width: `${40 + intensity * 30}px`,
          height: `${40 + intensity * 30}px`,
          background: `radial-gradient(circle, rgba(249,115,22,${glowOpacity}), transparent)`,
        }}
      />
      <div
        className="relative animate-pulse"
        style={{ transform: `scale(${scale})` }}
      >
        <Flame
          className="h-8 w-8 text-orange-400 drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 ${4 + intensity * 8}px rgba(249,115,22,0.6))`,
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// XP Progress Bar
// ---------------------------------------------------------------------------

function XPProgressBar({
  xp,
  level,
}: {
  xp: number;
  level: number;
}) {
  const { current, next } = getLevelThresholds(level);
  const progress = next > current ? ((xp - current) / (next - current)) * 100 : 100;
  const tier = getTier(level);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(progress), 300);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5">
          <span className="text-base">{tier.icon}</span>
          <span className={`font-semibold ${tier.color}`}>
            Lv.{level} {tier.name}
          </span>
        </span>
        <span className="text-gray-500">
          <AnimatedXP target={xp} /> / {next} XP
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out"
          style={{ width: `${animatedWidth}%` }}
        />
        {/* Shimmer effect */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            width: `${animatedWidth}%`,
            animation: "xp-shimmer 2s ease-in-out infinite",
          }}
        />
      </div>
      <p className="text-[10px] text-gray-600">
        {next - xp} XP to next level
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weekly Activity Heatmap
// ---------------------------------------------------------------------------

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEK_LABELS = ["4w ago", "3w ago", "2w ago", "This week"];

function ActivityHeatmap({ data }: { data: number[][] }) {
  const intensityColors = [
    "bg-white/[0.04]", // 0
    "bg-emerald-500/20", // 1
    "bg-emerald-500/40", // 2
    "bg-emerald-500/60", // 3
    "bg-emerald-500/80", // 4+
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Target className="h-3 w-3" />
        <span>Activity (last 4 weeks)</span>
      </div>
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-1">
          {DAY_LABELS.map((d, i) => (
            <span
              key={i}
              className="flex h-5 w-4 items-center justify-center text-[9px] text-gray-600"
            >
              {d}
            </span>
          ))}
        </div>
        {/* Grid */}
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                className={`h-5 w-5 rounded-sm transition-all hover:scale-110 hover:ring-1 hover:ring-emerald-500/30 ${
                  intensityColors[Math.min(day, 4)]
                }`}
                title={`${WEEK_LABELS[wi]}, ${DAY_LABELS[di]}: ${day} action${day !== 1 ? "s" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1 text-[9px] text-gray-600">
        <span>Less</span>
        {intensityColors.map((c, i) => (
          <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Daily Check-In Button
// ---------------------------------------------------------------------------

function CheckInButton({
  checkedIn,
  onCheckIn,
}: {
  checkedIn: boolean;
  onCheckIn: () => void;
}) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (checkedIn || animating) return;
    setAnimating(true);
    setTimeout(() => {
      onCheckIn();
      setAnimating(false);
    }, 600);
  };

  if (checkedIn) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        Checked in today
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={animating}
      className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-xl hover:shadow-orange-500/30 disabled:opacity-70"
    >
      {animating ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Checking in...
        </>
      ) : (
        <>
          <Zap className="h-4 w-4 transition-transform group-hover:scale-110" />
          Daily Check-in
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface CreatorStreakProps {
  streak?: StreakData;
}

export function CreatorStreak({ streak = MOCK_STREAK }: CreatorStreakProps) {
  const [data, setData] = useState(streak);
  const [xpGain, setXpGain] = useState<number | null>(null);

  const handleCheckIn = () => {
    const gainedXP = 15;
    setData((prev) => ({
      ...prev,
      todayCheckedIn: true,
      currentStreak: prev.currentStreak + 1,
      longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
      xp: prev.xp + gainedXP,
      totalActions: prev.totalActions + 1,
      weeklyActivity: prev.weeklyActivity.map((week, wi) =>
        wi === prev.weeklyActivity.length - 1
          ? week.map((day, di) => (di === 6 ? day + 1 : day))
          : week
      ),
    }));

    // Show XP gain animation
    setXpGain(gainedXP);
    setTimeout(() => setXpGain(null), 1500);

    // Check for level up
    const { next } = getLevelThresholds(data.level);
    if (data.xp + gainedXP >= next) {
      setData((prev) => ({ ...prev, level: prev.level + 1 }));
    }
  };

  const tier = getTier(data.level);

  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-orange-500/20">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Star className="h-5 w-5 text-orange-400" />
          Creator Streak
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <TrendingUp className="h-3 w-3" />
          {data.totalActions} total actions
        </div>
      </div>

      {/* Streak + Check-in row */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Current streak */}
          <div className="flex items-center gap-3">
            <StreakFlame streak={data.currentStreak} />
            <div>
              <p className="text-3xl font-bold text-white">
                {data.currentStreak}
              </p>
              <p className="text-xs text-gray-500">day streak</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-white/[0.06]" />

          {/* Longest streak */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-300">
              {data.longestStreak}
            </p>
            <p className="text-[10px] text-gray-600">best streak</p>
          </div>
        </div>

        {/* Check-in button with XP gain animation */}
        <div className="relative">
          <CheckInButton
            checkedIn={data.todayCheckedIn}
            onCheckIn={handleCheckIn}
          />
          {xpGain !== null && (
            <div
              className="pointer-events-none absolute -top-2 right-0 text-sm font-bold text-amber-400"
              style={{
                animation: "xp-float 1.5s ease-out forwards",
              }}
            >
              +{xpGain} XP
            </div>
          )}
        </div>
      </div>

      {/* XP Progress */}
      <div className="mb-5">
        <XPProgressBar xp={data.xp} level={data.level} />
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap data={data.weeklyActivity} />

      {/* Streak milestones */}
      <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4">
        {[3, 7, 14, 30].map((milestone) => {
          const reached = data.currentStreak >= milestone;
          return (
            <div
              key={milestone}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all ${
                reached
                  ? "bg-orange-500/15 text-orange-400"
                  : "bg-white/[0.04] text-gray-600"
              }`}
            >
              <Flame className={`h-3 w-3 ${reached ? "text-orange-400" : "text-gray-700"}`} />
              {milestone}d
            </div>
          );
        })}
      </div>
    </div>
  );
}
