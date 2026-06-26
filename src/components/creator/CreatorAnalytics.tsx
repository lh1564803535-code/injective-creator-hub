"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  PieChart,
  Target,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  ArrowUpRight,
  Share2,
} from "lucide-react";
import { MOCK_CAMPAIGNS, MOCK_SUBMISSIONS, MOCK_CREATORS } from "@/lib/mock-data";
import { shortenAddress } from "@/lib/injective";
import type { Address } from "viem";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignPerformance {
  id: number;
  title: string;
  earnings: number;
  votes: number;
  submissions: number;
  winRate: number;
  color: string;
}

interface ReferralEntry {
  address: string;
  conversions: number;
  commission: number;
}

// ---------------------------------------------------------------------------
// SVG Donut Chart
// ---------------------------------------------------------------------------

function DonutChart({
  data,
  size = 140,
  strokeWidth = 20,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) setAnimated(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animated]);

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const percent = d.value / total;
    const offset = circumference * (1 - cumulative);
    const dashArray = `${circumference * percent} ${circumference * (1 - percent)}`;
    cumulative += percent;
    return { ...d, offset, dashArray, percent, index: i };
  });

  return (
    <div className="relative flex items-center gap-6">
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={hoveredIndex === seg.index ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={seg.dashArray}
            strokeDashoffset={animated ? seg.offset : circumference}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out cursor-pointer"
            style={{ transitionDelay: `${seg.index * 120}ms` }}
            onMouseEnter={() => setHoveredIndex(seg.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
        {/* Center text */}
        <text
          x={center}
          y={center - 6}
          textAnchor="middle"
          className="fill-white text-lg font-bold"
          style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
        >
          {total.toLocaleString()}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="fill-gray-500 text-[10px]"
          style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
        >
          USDC
        </text>
      </svg>

      {/* Legend */}
      <div className="space-y-2">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`flex items-center gap-2 text-xs transition-opacity ${
              hoveredIndex !== null && hoveredIndex !== seg.index ? "opacity-40" : ""
            }`}
          >
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-gray-400 truncate max-w-[120px]">{seg.label}</span>
            <span className="font-medium text-white ml-auto">
              {(seg.percent * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated Metric Card
// ---------------------------------------------------------------------------

function MetricCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  prefix = "",
  trend,
  color,
}: {
  icon: typeof Target;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: number;
  color: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function update(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / 1500, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(value * eased));
            if (progress < 1) requestAnimationFrame(update);
            else setDisplayValue(value);
          }
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.1] hover:bg-white/[0.04]"
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-4 w-4 ${color}`} />
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-[10px] font-medium ${
              trend >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <ArrowUpRight
              className={`h-3 w-3 ${trend < 0 ? "rotate-90" : ""}`}
            />
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-white">
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Referral Tracker
// ---------------------------------------------------------------------------

function ReferralTracker({ referrals }: { referrals: ReferralEntry[] }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="h-4 w-4 text-purple-400" />
        <h4 className="text-sm font-semibold text-white">Referral Conversions</h4>
      </div>
      <div className="space-y-2">
        {referrals.map((ref, i) => (
          <div
            key={ref.address}
            className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.04]"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-[10px] font-bold text-purple-400">
              {i + 1}
            </span>
            <span className="flex-1 truncate font-mono text-xs text-gray-300">
              {shortenAddress(ref.address)}
            </span>
            <div className="text-right">
              <p className="text-xs font-medium text-white">{ref.conversions} refs</p>
              <p className="text-[10px] text-emerald-400">
                +{ref.commission.toLocaleString()} USDC
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CreatorAnalytics({ address }: { address: Address }) {
  // Derive analytics from mock data
  const analytics = useMemo(() => {
    const creatorSubmissions = Object.values(MOCK_SUBMISSIONS)
      .flat()
      .filter((s) => s.creator.toLowerCase() === address.toLowerCase());

    const totalEarnings = creatorSubmissions.reduce(
      (sum, s) => sum + Number(s.reward) / 1e6,
      0
    );
    const totalVotes = creatorSubmissions.reduce((sum, s) => sum + s.votes, 0);
    const avgVotes =
      creatorSubmissions.length > 0 ? totalVotes / creatorSubmissions.length : 0;
    const winRate =
      creatorSubmissions.length > 0
        ? (creatorSubmissions.filter((s) => Number(s.reward) > 0).length /
            creatorSubmissions.length) *
          100
        : 0;

    // Campaign performance breakdown
    const campaignMap = new Map<
      number,
      { title: string; earnings: number; votes: number; submissions: number }
    >();
    creatorSubmissions.forEach((s) => {
      const campaign = MOCK_CAMPAIGNS.find((c) => c.id === s.campaignId);
      if (!campaign) return;
      const existing = campaignMap.get(s.campaignId) ?? {
        title: campaign.title,
        earnings: 0,
        votes: 0,
        submissions: 0,
      };
      existing.earnings += Number(s.reward) / 1e6;
      existing.votes += s.votes;
      existing.submissions += 1;
      campaignMap.set(s.campaignId, existing);
    });

    const colors = [
      "#22c55e",
      "#06b6d4",
      "#8b5cf6",
      "#f59e0b",
      "#ec4899",
      "#14b8a6",
      "#f97316",
      "#6366f1",
    ];

    const campaignPerformance: CampaignPerformance[] = Array.from(
      campaignMap.entries()
    )
      .map(([id, data], i) => ({
        id,
        ...data,
        winRate: data.submissions > 0 ? (data.earnings > 0 ? 100 : 0) : 0,
        color: colors[i % colors.length],
      }))
      .sort((a, b) => b.earnings - a.earnings);

    // Mock monthly data (last 6 months)
    const monthlyEarnings = [
      { label: "Jan", value: Math.floor(totalEarnings * 0.08) },
      { label: "Feb", value: Math.floor(totalEarnings * 0.12) },
      { label: "Mar", value: Math.floor(totalEarnings * 0.15) },
      { label: "Apr", value: Math.floor(totalEarnings * 0.18) },
      { label: "May", value: Math.floor(totalEarnings * 0.22) },
      { label: "Jun", value: Math.floor(totalEarnings * 0.25) },
    ];

    // Projected earnings (next month based on trend)
    const lastTwo = monthlyEarnings.slice(-2);
    const growthRate =
      lastTwo[0].value > 0
        ? (lastTwo[1].value - lastTwo[0].value) / lastTwo[0].value
        : 0;
    const projected = Math.floor(lastTwo[1].value * (1 + growthRate));

    // Mock referral data
    const referrals: ReferralEntry[] = [
      { address: "0xaaaa1111bbbb2222cccc3333dddd4444eeee5555", conversions: 8, commission: 120 },
      { address: "0xbbbb2222cccc3333dddd4444eeee5555ffff6666", conversions: 5, commission: 75 },
      { address: "0xcccc3333dddd4444eeee5555ffff6666aaaa7777", conversions: 3, commission: 45 },
    ];

    return {
      totalEarnings,
      totalVotes,
      avgVotes,
      winRate,
      campaignPerformance,
      monthlyEarnings,
      projected,
      referrals,
      totalSubmissions: creatorSubmissions.length,
    };
  }, [address]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <PieChart className="h-5 w-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Creator Analytics</h2>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          icon={DollarSign}
          label="Total Earnings"
          value={Math.floor(analytics.totalEarnings)}
          prefix="$"
          trend={12.5}
          color="text-amber-400"
        />
        <MetricCard
          icon={Users}
          label="Total Votes"
          value={analytics.totalVotes}
          trend={8.3}
          color="text-emerald-400"
        />
        <MetricCard
          icon={Target}
          label="Avg Votes / Sub"
          value={Math.floor(analytics.avgVotes * 10) / 10}
          trend={3.2}
          color="text-cyan-400"
        />
        <MetricCard
          icon={Award}
          label="Win Rate"
          value={Math.floor(analytics.winRate)}
          suffix="%"
          trend={5.0}
          color="text-purple-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Earnings Breakdown Donut */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <h3 className="mb-4 text-sm font-semibold text-white">
            Earnings by Campaign
          </h3>
          {analytics.campaignPerformance.length > 0 ? (
            <DonutChart
              data={analytics.campaignPerformance.map((c) => ({
                label: c.title.length > 20 ? c.title.slice(0, 20) + "..." : c.title,
                value: c.earnings,
                color: c.color,
              }))}
            />
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No earnings data yet
            </p>
          )}
        </div>

        {/* Monthly Earnings Bars */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Monthly Trend</h3>
            <span className="text-xs text-gray-500">
              Projected: <span className="text-emerald-400 font-medium">${analytics.projected.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {analytics.monthlyEarnings.map((m, i) => {
              const maxVal = Math.max(...analytics.monthlyEarnings.map((d) => d.value), 1);
              const height = (m.value / maxVal) * 100;
              const isLast = i === analytics.monthlyEarnings.length - 1;
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full flex items-end" style={{ height: "100%" }}>
                    <div
                      className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                        isLast
                          ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                          : "bg-gradient-to-t from-white/[0.06] to-white/[0.1]"
                      }`}
                      style={{
                        height: `${height}%`,
                        transitionDelay: `${i * 80}ms`,
                        boxShadow: isLast ? "0 0 12px rgba(34, 197, 94, 0.15)" : "none",
                      }}
                    />
                  </div>
                  <span className="mt-2 text-[10px] text-gray-600">{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Campaign Performance List */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">
          Campaign Performance
        </h3>
        <div className="space-y-2">
          {analytics.campaignPerformance.map((cp) => (
            <div
              key={cp.id}
              className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2.5 transition hover:bg-white/[0.04]"
            >
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: cp.color }}
              />
              <span className="flex-1 truncate text-sm text-gray-300">
                {cp.title}
              </span>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">
                  {cp.submissions} subs
                </span>
                <span className="text-gray-500">
                  {cp.votes} votes
                </span>
                <span className="font-medium text-emerald-400 min-w-[70px] text-right">
                  ${cp.earnings.toLocaleString()} USDC
                </span>
              </div>
            </div>
          ))}
          {analytics.campaignPerformance.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No campaign data yet
            </p>
          )}
        </div>
      </div>

      {/* Referral Tracking */}
      <ReferralTracker referrals={analytics.referrals} />
    </div>
  );
}
