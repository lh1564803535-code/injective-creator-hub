"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Target,
  Clock,
  DollarSign,
  ChevronRight,
  Zap,
  TrendingUp,
  Star,
  Brain,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { formatUSDC, getTimeRemaining } from "@/lib/injective";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Campaign } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignRecommendation {
  campaign: Campaign;
  matchScore: number; // 0-100
  reasons: string[];
  skills: string[];
  estimatedEarnings: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// ---------------------------------------------------------------------------
// Mock AI recommendations
// ---------------------------------------------------------------------------

function generateRecommendations(): CampaignRecommendation[] {
  const now = Math.floor(Date.now() / 1000);

  const campaigns: Campaign[] = [
    {
      id: 1,
      sponsor: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
      title: "XHunt Content Sprint",
      description:
        "Create viral content about Injective's XHunt ecosystem. Best content wins USDC prizes.",
      totalReward: BigInt(5000000000),
      deadline: now + 86400 * 7,
      submissionCount: 23,
      settled: false,
    },
    {
      id: 4,
      sponsor: "0x1234567890abcdef1234567890abcdef12345678",
      title: "Build on Injective Hackathon",
      description:
        "Build innovative dApps on Injective EVM. Top 3 projects split the prize pool.",
      totalReward: BigInt(10000000000),
      deadline: now + 86400 * 30,
      submissionCount: 8,
      settled: false,
    },
    {
      id: 3,
      sponsor: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      title: "Meme Contest #42",
      description:
        "Funniest Injective meme wins! Community votes decide the winner.",
      totalReward: BigInt(1000000000),
      deadline: now + 86400 * 14,
      submissionCount: 67,
      settled: false,
    },
  ];

  return [
    {
      campaign: campaigns[0],
      matchScore: 94,
      reasons: [
        "Your X/Twitter content style aligns with viral campaign goals",
        "Past submissions show strong engagement metrics",
        "High reward-to-competition ratio (217 USDC per submission)",
      ],
      skills: ["Content Creation", "Social Media", "Viral Marketing"],
      estimatedEarnings: "800-2,500 USDC",
      difficulty: "intermediate",
    },
    {
      campaign: campaigns[1],
      matchScore: 87,
      reasons: [
        "Your GitHub profile shows Solidity and React experience",
        "Hackathon has low competition (8 submissions vs 23+ in others)",
        "Highest reward pool on the platform (10,000 USDC)",
      ],
      skills: ["Solidity", "React", "DeFi", "Smart Contracts"],
      estimatedEarnings: "1,500-5,000 USDC",
      difficulty: "advanced",
    },
    {
      campaign: campaigns[2],
      matchScore: 72,
      reasons: [
        "Meme creation has lower barrier to entry",
        "High community engagement potential",
        "Quick turnaround — submit within hours",
      ],
      skills: ["Graphic Design", "Humor", "Community"],
      estimatedEarnings: "100-500 USDC",
      difficulty: "beginner",
    },
  ];
}

// ---------------------------------------------------------------------------
// Match score ring (animated SVG)
// ---------------------------------------------------------------------------

function MatchScoreRing({
  score,
  animate,
}: {
  score: number;
  animate: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;

  useEffect(() => {
    if (!animate || prefersReduced) {
      setDisplayScore(score);
      return;
    }

    let current = 0;
    const step = score / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(interval);
  }, [score, animate, prefersReduced]);

  const color =
    score >= 90
      ? "#22c55e"
      : score >= 80
        ? "#06b6d4"
        : score >= 70
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="68" height="68" className="-rotate-90">
        <circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        <circle
          cx="34"
          cy="34"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="text-lg font-bold"
          style={{ color }}
        >
          {displayScore}
        </span>
        <span className="text-[9px] text-gray-500 uppercase">match</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Difficulty badge
// ---------------------------------------------------------------------------

function DifficultyBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; color: string }> = {
    beginner: {
      label: "Beginner",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    intermediate: {
      label: "Intermediate",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    advanced: {
      label: "Advanced",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  };

  const c = config[level] ?? config.beginner;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${c.color}`}
    >
      {c.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Skill tag
// ---------------------------------------------------------------------------

function SkillTag({ skill, delay }: { skill: string; delay: number }) {
  const prefersReduced = useReducedMotion();

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-gray-400 border border-white/[0.06] ${
        prefersReduced ? "" : "animate-fade-in-up"
      }`}
      style={prefersReduced ? {} : { animationDelay: `${delay}ms` }}
    >
      <Zap className="h-2.5 w-2.5 text-purple-400" />
      {skill}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Recommendation card
// ---------------------------------------------------------------------------

function RecommendationCard({
  rec,
  index,
  isVisible,
}: {
  rec: CampaignRecommendation;
  index: number;
  isVisible: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const timeRemaining = getTimeRemaining(rec.campaign.deadline);
  const rewardPerSub =
    Number(rec.campaign.totalReward) / 1e6 / Math.max(rec.campaign.submissionCount, 1);

  return (
    <div
      className={`group relative rounded-2xl border bg-white/[0.02] transition-all duration-300 ${
        hovered
          ? "border-cyan-500/20 bg-white/[0.04] shadow-lg shadow-cyan-500/5"
          : "border-white/[0.06]"
      } ${prefersReduced || !isVisible ? "opacity-100" : "animate-card-enter"}`}
      style={
        prefersReduced || !isVisible
          ? {}
          : { animationDelay: `${index * 150}ms`, animationFillMode: "both" }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Match score glow effect */}
      {rec.matchScore >= 90 && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100 blur-sm" />
      )}

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          {/* Match score ring */}
          <MatchScoreRing score={rec.matchScore} animate={isVisible} />

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {rec.campaign.title}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                  {rec.campaign.description}
                </p>
              </div>
              <DifficultyBadge level={rec.difficulty} />
            </div>

            {/* Stats row */}
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <DollarSign className="h-3 w-3" />
                {formatUSDC(rec.campaign.totalReward)} USDC pool
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="h-3 w-3" />
                {timeRemaining}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Target className="h-3 w-3" />
                {rec.campaign.submissionCount} submissions
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <TrendingUp className="h-3 w-3" />
                ~{Math.round(rewardPerSub)} USDC/sub
              </span>
            </div>

            {/* Skills */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {rec.skills.map((skill, i) => (
                <SkillTag key={skill} skill={skill} delay={index * 150 + i * 80} />
              ))}
            </div>

            {/* AI reasoning (expandable) */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-[11px] text-purple-400 transition hover:text-purple-300"
            >
              <Brain className="h-3 w-3" />
              {expanded ? "Hide" : "Show"} AI reasoning
              <ChevronRight
                className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </button>

            {expanded && (
              <div className="mt-2 space-y-1.5 rounded-lg bg-purple-500/[0.04] border border-purple-500/10 p-3">
                {rec.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />
                    <span>{reason}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-2 border-t border-white/[0.04] pt-2">
                  <Star className="h-3 w-3 text-amber-400" />
                  <span className="text-xs text-amber-400">
                    Est. earnings: {rec.estimatedEarnings}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
          <div className="flex items-center gap-1.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                rec.matchScore >= 90
                  ? "bg-emerald-400 animate-pulse"
                  : rec.matchScore >= 80
                    ? "bg-cyan-400"
                    : "bg-gray-500"
              }`}
            />
            <span className="text-[10px] text-gray-500">
              {rec.matchScore >= 90
                ? "Top match for your profile"
                : rec.matchScore >= 80
                  ? "Strong match"
                  : "Potential match"}
            </span>
          </div>
          <Link
            href={`/campaign/${rec.campaign.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:from-cyan-500/20 hover:to-purple-500/20 hover:text-cyan-300"
          >
            View Campaign
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CampaignRecommendations() {
  const [recommendations, setRecommendations] = useState<CampaignRecommendation[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Generate recommendations on mount
  useEffect(() => {
    setRecommendations(generateRecommendations());
  }, []);

  // IntersectionObserver for entry animation
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsVisible(false);
    setTimeout(() => {
      setRecommendations(generateRecommendations());
      setIsRefreshing(false);
      // Re-trigger animation
      requestAnimationFrame(() => setIsVisible(true));
    }, 800);
  };

  return (
    <div ref={containerRef} className="content-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              AI Campaign Matches
            </h2>
            <p className="text-xs text-gray-500">
              Personalized recommendations based on your creator profile
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-gray-400 transition hover:border-purple-500/20 hover:text-purple-400 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* AI analysis indicator */}
      <div
        className={`mb-4 flex items-center gap-2 rounded-lg border border-purple-500/10 bg-purple-500/[0.03] px-4 py-2.5 ${
          prefersReduced ? "" : "shimmer-border"
        }`}
      >
        <Brain className="h-4 w-4 text-purple-400" />
        <div className="flex-1">
          <p className="text-xs text-gray-400">
            <span className="font-medium text-purple-400">AI Analysis:</span>{" "}
            Based on your submission history, voting patterns, and content
            style — 3 active campaigns match your creator profile with 72-94%
            confidence.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400">Live</span>
        </div>
      </div>

      {/* Recommendation cards */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.campaign.id}
            rec={rec}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>

      {/* Footer insight */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-600">
        <Sparkles className="h-3 w-3" />
        <span>
          Recommendations update every 24h based on your on-chain activity
        </span>
      </div>
    </div>
  );
}
