"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trophy,
  TrendingUp,
  FileText,
  Rocket,
  ArrowRight,
  Star,
  Clock,
  Users,
  Zap,
  Send,
  Vote,
  Award,
  Gift,
  ChevronRight,
  PenLine,
  Banknote,
} from "lucide-react";
import { LeaderboardTable } from "@/components/creator/LeaderboardTable";
import { CampaignList } from "@/components/campaign/CampaignList";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { USDCBenefits } from "@/components/ui/USDCBenefits";
import { NetworkStats } from "@/components/ui/NetworkStats";
import { LiveEarnings } from "@/components/creator/LiveEarnings";
import { ScrollEarningsCounter } from "@/components/ui/ScrollEarningsCounter";
import { AIAgentSection } from "@/components/ui/AIAgentSection";
import { MCPIntegration } from "@/components/ui/MCPIntegration";
import { useScrollReveal } from "@/lib/useScrollReveal";
import {
  MOCK_CREATORS,
  MOCK_CAMPAIGNS,
  MOCK_SUBMISSIONS,
  MOCK_ACTIVITY,
} from "@/lib/mock-data";
import { shortenAddress, getTimeRemaining } from "@/lib/injective";
import type { Creator, LeaderboardSortBy, Campaign } from "@/types/creator-settlement";

function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2000 }: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function update(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(target * eased));
            if (progress < 1) requestAnimationFrame(update);
            else setCount(target);
          }
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="animate-counter-scale">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const activityIcons: Record<string, typeof Send> = {
  submission: Send,
  vote: Vote,
  settle: Award,
  claim: Gift,
};

const activityColors: Record<string, string> = {
  submission: "text-cyan-400 bg-cyan-500/10",
  vote: "text-emerald-400 bg-emerald-500/10",
  settle: "text-amber-400 bg-amber-500/10",
  claim: "text-purple-400 bg-purple-500/10",
};

function ScrollRevealSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? "is-visible" : ""} ${delay > 0 ? `scroll-reveal-delay-${delay}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function TypewriterText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={done ? "" : "typewriter-cursor"}>
      {displayed}
    </span>
  );
}

export default function HomePage() {
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>("earnings");

  const topCreators = MOCK_CREATORS.slice(0, 5);

  const campaigns: Campaign[] = MOCK_CAMPAIGNS.map((c) => ({
    id: c.id,
    sponsor: c.sponsor,
    title: c.title,
    description: c.description,
    totalReward: c.totalReward,
    deadline: c.deadline,
    submissionCount: c.submissionCount,
    settled: c.settled,
  }));

  // Featured campaign = highest reward active campaign
  const featuredCampaign = MOCK_CAMPAIGNS
    .filter((c) => !c.settled && c.deadline > Math.floor(Date.now() / 1000))
    .sort((a, b) => Number(b.totalReward - a.totalReward))[0];

  const featuredSubmissions = MOCK_SUBMISSIONS[featuredCampaign?.id] ?? [];

  const totalEarnings = MOCK_CREATORS.reduce(
    (sum, c) => sum + c.totalEarnings,
    BigInt(0)
  );
  const totalVotes = MOCK_CREATORS.reduce((sum, c) => sum + c.totalVotes, 0);
  const totalSubmissions = MOCK_CREATORS.reduce(
    (sum, c) => sum + c.totalSubmissions,
    0
  );

  const stats = [
    {
      icon: Trophy,
      value: Number(totalEarnings) / 1e6,
      suffix: "",
      prefix: "$",
      label: "Total USDC Earned",
      color: "text-amber-400",
      glow: "hover:shadow-amber-500/10",
      border: "hover:border-amber-500/20",
    },
    {
      icon: TrendingUp,
      value: totalVotes,
      suffix: "",
      prefix: "",
      label: "Total Votes Cast",
      color: "text-emerald-400",
      glow: "hover:shadow-emerald-500/10",
      border: "hover:border-emerald-500/20",
    },
    {
      icon: FileText,
      value: totalSubmissions,
      suffix: "",
      prefix: "",
      label: "Content Submissions",
      color: "text-cyan-400",
      glow: "hover:shadow-cyan-500/10",
      border: "hover:border-cyan-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-12 lg:px-8 lg:pt-32 lg:pb-16">
        {/* Background gradient layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <div className="h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
          </div>
          <div className="absolute right-0 top-1/3">
            <div className="h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-3xl" />
          </div>
          <div className="absolute bottom-0 left-0">
            <div className="h-[300px] w-[300px] rounded-full bg-purple-600/3 blur-3xl" />
          </div>
          <FloatingParticles count={25} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
              <Rocket className="h-4 w-4" />
              Built on Injective EVM
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Injective{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Creator Hub
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
              <TypewriterText
                text="Decentralized content creation platform. Create campaigns, submit content, earn USDC rewards — all on-chain."
                speed={25}
              />
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/leaderboard"
                className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25"
              >
                View Leaderboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/create"
                className="btn-glow rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 font-semibold text-white hover:bg-white/[0.06]"
              >
                Create Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll-to-Earn Counter (Superfluid-inspired) */}
      <div className="sticky top-20 z-40 flex justify-center px-6 py-3">
        <ScrollEarningsCounter />
      </div>

      {/* Network Stats */}
      <ScrollRevealSection className="px-6 pb-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <NetworkStats />
        </div>
      </ScrollRevealSection>

      {/* Live Earnings Preview */}
      <ScrollRevealSection className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-md">
          <LiveEarnings compact />
        </div>
      </ScrollRevealSection>

      {/* Animated Stats */}
      <ScrollRevealSection className="px-6 pb-12 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`animate-stat-pulse card-hover-glow rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center transition-all ${stat.glow} ${stat.border}`}
            >
              <stat.icon className={`mx-auto mb-2 h-6 w-6 ${stat.color}`} />
              <p className="text-2xl font-bold text-white">
                <AnimatedCounter
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </ScrollRevealSection>

      {/* How It Works */}
      <ScrollRevealSection delay={1} className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white">How It Works</h2>
            <p className="mt-2 text-sm text-gray-500">
              Three steps to earn on-chain rewards
            </p>
          </div>
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Connecting line (desktop) */}
            <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-10 hidden h-0.5 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 sm:block" />

            {[
              {
                icon: PenLine,
                step: "01",
                title: "Create a Campaign",
                desc: "Set a USDC reward pool, define content rules, and launch your bounty to the Injective community.",
                color: "cyan",
                gradient: "from-cyan-500 to-blue-600",
                glow: "shadow-cyan-500/20",
              },
              {
                icon: Send,
                step: "02",
                title: "Submit Content",
                desc: "Creators submit original content — tweets, threads, videos, memes, art — linked on-chain.",
                color: "blue",
                gradient: "from-blue-500 to-indigo-600",
                glow: "shadow-blue-500/20",
              },
              {
                icon: Banknote,
                step: "03",
                title: "Vote & Earn USDC",
                desc: "Community votes decide winners. Rewards are distributed automatically via smart contract.",
                color: "purple",
                gradient: "from-purple-500 to-pink-600",
                glow: "shadow-purple-500/20",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                {/* Step badge */}
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-10 transition-opacity group-hover:opacity-20`}
                  />
                  <item.icon className={`relative h-7 w-7 text-${item.color}-400`} />
                </div>
                <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-gray-600">
                  Step {item.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* USDC Benefits */}
      <ScrollRevealSection delay={1} className="px-6 pb-16 lg:px-8">
        <USDCBenefits />
      </ScrollRevealSection>

      {/* Featured Campaign */}
      {featuredCampaign && (
        <ScrollRevealSection delay={1} className="px-6 pb-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Featured Campaign</h2>
            </div>
            <Link href={`/campaign/${featuredCampaign.id}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-white/[0.02] to-cyan-500/5 p-6 transition-all hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 lg:p-8">
                {/* Glow effect */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">
                        <Zap className="h-3 w-3" />
                        Featured
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                        Active
                      </span>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-white transition group-hover:text-amber-200">
                      {featuredCampaign.title}
                    </h3>
                    <p className="mb-4 max-w-xl text-gray-400">
                      {featuredCampaign.description}
                    </p>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-400" />
                        <span className="text-gray-400">Reward:</span>
                        <span className="font-semibold text-amber-400">
                          {(Number(featuredCampaign.totalReward) / 1e6).toLocaleString()} USDC
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-cyan-400" />
                        <span className="text-gray-400">Deadline:</span>
                        <span className="font-semibold text-white">
                          {getTimeRemaining(featuredCampaign.deadline)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-400">Submissions:</span>
                        <span className="font-semibold text-white">
                          {featuredCampaign.submissionCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top submissions preview */}
                  {featuredSubmissions.length > 0 && (
                    <div className="w-full shrink-0 lg:w-72">
                      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Top Submissions
                      </p>
                      <div className="space-y-2">
                        {featuredSubmissions.slice(0, 3).map((sub, i) => (
                          <div
                            key={sub.id}
                            className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2"
                          >
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              i === 0 ? "bg-amber-500/20 text-amber-400" :
                              i === 1 ? "bg-gray-400/20 text-gray-300" :
                              "bg-orange-500/20 text-orange-400"
                            }`}>
                              {i + 1}
                            </span>
                            <span className="flex-1 truncate text-sm text-gray-300">
                              {shortenAddress(sub.creator)}
                            </span>
                            <span className="text-sm font-medium text-emerald-400">
                              {sub.votes} votes
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-1 text-sm text-amber-400 transition group-hover:gap-2">
                  View campaign details
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </ScrollRevealSection>
      )}

      {/* Top Creators Cards */}
      <ScrollRevealSection delay={2} className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Top Creators</h2>
              <p className="text-sm text-gray-500">Highest earning creators this month</p>
            </div>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 text-sm text-cyan-400 transition hover:text-cyan-300"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {topCreators.map((creator, i) => {
              const rankStyles = [
                "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent",
                "border-gray-400/20 bg-gradient-to-br from-gray-400/5 to-transparent",
                "border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent",
                "border-white/[0.06] bg-white/[0.02]",
                "border-white/[0.06] bg-white/[0.02]",
              ];
              const badgeStyles = [
                "bg-amber-500/20 text-amber-400",
                "bg-gray-400/15 text-gray-300",
                "bg-orange-500/15 text-orange-400",
                "bg-white/[0.06] text-gray-400",
                "bg-white/[0.06] text-gray-400",
              ];
              return (
                <Link
                  key={creator.address}
                  href="/leaderboard"
                  className={`group rounded-xl border p-4 transition-all hover:scale-[1.02] hover:shadow-lg ${rankStyles[i]}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className="h-10 w-10 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(i * 60) % 360}, 70%, 50%), hsl(${(i * 60 + 120) % 360}, 70%, 50%))`,
                      }}
                    />
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeStyles[i]}`}>
                      #{i + 1}
                    </span>
                  </div>
                  <p className="mb-1 truncate font-mono text-sm text-gray-300">
                    {shortenAddress(creator.address)}
                  </p>
                  <p className="text-lg font-bold text-white">
                    {(Number(creator.totalEarnings) / 1e6).toLocaleString()} <span className="text-xs text-gray-500">USDC</span>
                  </p>
                  <div className="mt-2 flex gap-3 text-xs text-gray-500">
                    <span>{creator.totalVotes} votes</span>
                    <span>{creator.totalSubmissions} works</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollRevealSection>

      {/* Recent Activity Feed */}
      <ScrollRevealSection delay={1} className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <p className="text-sm text-gray-500">Latest submissions, votes, and settlements</p>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {MOCK_ACTIVITY.slice(0, 8).map((activity) => {
              const Icon = activityIcons[activity.type] ?? Send;
              const colorClass = activityColors[activity.type] ?? "text-gray-400 bg-gray-500/10";
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 transition hover:bg-white/[0.03]"
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-200">
                      <span className="font-mono text-gray-400">
                        {shortenAddress(activity.creator)}
                      </span>{" "}
                      <span className="text-gray-500">
                        {activity.type === "submission" && "submitted to"}
                        {activity.type === "vote" && "voted in"}
                        {activity.type === "settle" && "settled"}
                        {activity.type === "claim" && "claimed reward from"}
                      </span>{" "}
                      <Link
                        href={`/campaign/${activity.campaignId}`}
                        className="font-medium text-cyan-400 hover:text-cyan-300"
                      >
                        {activity.campaignTitle}
                      </Link>
                    </p>
                    {activity.detail && (
                      <p className="mt-0.5 text-xs text-gray-500">{activity.detail}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-gray-600">
                    {timeAgo(activity.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollRevealSection>

      {/* AI Agent Integration */}
      <ScrollRevealSection delay={1} className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <AIAgentSection />
        </div>
      </ScrollRevealSection>

      {/* Campaigns */}
      <ScrollRevealSection delay={2} className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">All Campaigns</h2>
            <p className="text-sm text-gray-500">Earn USDC by creating content</p>
          </div>
          <CampaignList campaigns={campaigns} />
        </div>
      </ScrollRevealSection>

      {/* Leaderboard Preview */}
      <ScrollRevealSection delay={3} className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
              <p className="text-sm text-gray-500">
                Leading the Injective Creator Hub
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 text-sm text-cyan-400 transition hover:text-cyan-300"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <LeaderboardTable
            creators={topCreators}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </ScrollRevealSection>
    </div>
  );
}
