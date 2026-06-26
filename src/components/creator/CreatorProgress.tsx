"use client";

import { useState, useEffect, useRef } from "react";
import { DollarSign, ThumbsUp, Palette, Target, Award } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreatorProgressProps {
  /** Current earnings in USDC */
  currentEarnings: number;
  /** Earnings goal in USDC */
  earningsGoal: number;
  /** Current total votes received */
  currentVotes: number;
  /** Votes goal */
  votesGoal: number;
  /** Current number of works/submissions */
  currentWorks: number;
  /** Works goal */
  worksGoal: number;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Animated Number Hook
// ---------------------------------------------------------------------------

function useAnimatedNumber(
  target: number,
  duration = 800,
  decimals = 0
): number {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    if (from === to) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(
        parseFloat((from + (to - from) * eased).toFixed(decimals))
      );
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    prevRef.current = target;
  }, [target, duration, decimals]);

  return display;
}

// ---------------------------------------------------------------------------
// Mini Ring
// ---------------------------------------------------------------------------

function MiniRing({
  percentage,
  color,
  size = 36,
  stroke = 3,
}: {
  percentage: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.min(percentage, 100) / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} className="rotate-[-90deg] shrink-0">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        style={{ filter: `drop-shadow(0 0 4px ${color}50)` }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorProgress({
  currentEarnings,
  earningsGoal,
  currentVotes,
  votesGoal,
  currentWorks,
  worksGoal,
  className = "",
}: CreatorProgressProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const aEarnings = useAnimatedNumber(currentEarnings, 900, 2);
  const aVotes = useAnimatedNumber(currentVotes);
  const aWorks = useAnimatedNumber(currentWorks);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const earningsPercent =
    earningsGoal > 0
      ? Math.min(100, (currentEarnings / earningsGoal) * 100)
      : 0;
  const votesPercent =
    votesGoal > 0 ? Math.min(100, (currentVotes / votesGoal) * 100) : 0;
  const worksPercent =
    worksGoal > 0 ? Math.min(100, (currentWorks / worksGoal) * 100) : 0;

  const goals = [
    {
      icon: DollarSign,
      label: "Earnings Goal",
      current: `$${aEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      target: `$${earningsGoal.toLocaleString()}`,
      percentage: earningsPercent,
      barColor: "bg-gradient-to-r from-emerald-500 to-emerald-400",
      glowColor: "rgba(52,211,153,0.3)",
      ringColor: "#34d399",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: ThumbsUp,
      label: "Votes Goal",
      current: aVotes.toLocaleString(),
      target: votesGoal.toLocaleString(),
      percentage: votesPercent,
      barColor: "bg-gradient-to-r from-cyan-500 to-blue-500",
      glowColor: "rgba(34,211,238,0.3)",
      ringColor: "#22d3ee",
      textColor: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Palette,
      label: "Works Goal",
      current: aWorks.toLocaleString(),
      target: worksGoal.toLocaleString(),
      percentage: worksPercent,
      barColor: "bg-gradient-to-r from-violet-500 to-purple-400",
      glowColor: "rgba(167,139,250,0.3)",
      ringColor: "#a78bfa",
      textColor: "text-violet-400",
      bgColor: "bg-violet-500/10",
    },
  ];

  // Overall completion
  const overallPercent = Math.round(
    (earningsPercent + votesPercent + worksPercent) / 3
  );
  const goalsCompleted = goals.filter((g) => g.percentage >= 100).length;

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Goal Progress
            </h3>
            <p className="text-[10px] text-gray-500">
              {goalsCompleted}/{goals.length} goals reached
            </p>
          </div>
        </div>

        {/* Overall ring */}
        <div className="relative flex items-center justify-center">
          <MiniRing
            percentage={overallPercent}
            color={overallPercent >= 100 ? "#34d399" : "#22d3ee"}
            size={48}
            stroke={4}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-xs font-bold ${
                overallPercent >= 100 ? "text-emerald-400" : "text-cyan-400"
              }`}
            >
              {overallPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Goal items */}
      <div className="space-y-4">
        {goals.map((goal, i) => (
          <div
            key={goal.label}
            className={`rounded-xl bg-white/[0.02] p-3.5 transition-all hover:bg-white/[0.04] ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            {/* Top row: icon + label + ring */}
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${goal.bgColor}`}
                >
                  <goal.icon className={`h-3.5 w-3.5 ${goal.textColor}`} />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-300">
                    {goal.label}
                  </span>
                  <p className="text-[10px] text-gray-600">
                    {goal.current} / {goal.target}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs tabular-nums ${goal.textColor}`}
                >
                  {Math.round(goal.percentage)}%
                </span>
                {goal.percentage >= 100 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                    <Award className="h-3 w-3 text-emerald-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${goal.barColor}`}
                style={{
                  width: isVisible
                    ? `${Math.min(goal.percentage, 100)}%`
                    : "0%",
                  boxShadow: `0 0 10px ${goal.glowColor}`,
                  transitionDelay: `${i * 120 + 200}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-2.5">
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          Overall Progress
        </span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 ease-out"
              style={{
                width: isVisible ? `${overallPercent}%` : "0%",
              }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums text-gray-300">
            {overallPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
