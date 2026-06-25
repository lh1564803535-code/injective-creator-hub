"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Trophy, TrendingUp, FileText, Rocket, ArrowRight } from "lucide-react";
import { LeaderboardTable } from "@/components/creator/LeaderboardTable";
import { CampaignList } from "@/components/campaign/CampaignList";
import { MOCK_CREATORS, MOCK_CAMPAIGNS } from "@/lib/mock-data";
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
              Decentralized content creation platform. Create campaigns, submit
              content, earn USDC rewards — all on-chain.
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

      {/* Animated Stats */}
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat, i) => (
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
      </section>

      {/* Campaigns */}
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Active Campaigns</h2>
            <p className="text-sm text-gray-500">Earn USDC by creating content</p>
          </div>
          <CampaignList campaigns={campaigns} />
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Top Creators</h2>
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
      </section>
    </div>
  );
}
