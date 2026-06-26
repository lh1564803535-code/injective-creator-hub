"use client";

import { useState, useEffect, useRef } from "react";
import {
  Twitter,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  Eye,
  Heart,
  Repeat2,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Calendar,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DailyTweetData {
  day: string;
  tweets: number;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
}

interface EngagementPoint {
  day: string;
  rate: number;
}

interface FollowerGrowthPoint {
  day: string;
  count: number;
}

interface BestTimeSlot {
  hour: string;
  label: string;
  score: number; // 0-100
  engagement: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

function generateTweetData(): DailyTweetData[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    tweets: Math.floor(Math.random() * 8) + 2,
    impressions: Math.floor(Math.random() * 5000) + 1000,
    likes: Math.floor(Math.random() * 200) + 50,
    retweets: Math.floor(Math.random() * 80) + 10,
    replies: Math.floor(Math.random() * 40) + 5,
  }));
}

function generateEngagementData(): EngagementPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const base = 4.2;
  return days.map((day, i) => ({
    day,
    rate: +(base + Math.sin(i * 0.8) * 1.5 + (Math.random() - 0.5) * 0.8).toFixed(1),
  }));
}

function generateFollowerData(): FollowerGrowthPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let count = 12380;
  return days.map((day) => {
    count += Math.floor(Math.random() * 60) + 15;
    return { day, count };
  });
}

const BEST_TIMES: BestTimeSlot[] = [
  { hour: "09:00", label: "Morning", score: 92, engagement: "6.8%" },
  { hour: "12:30", label: "Lunch", score: 78, engagement: "5.2%" },
  { hour: "18:00", label: "Evening", score: 95, engagement: "7.4%" },
  { hour: "21:00", label: "Night", score: 70, engagement: "4.6%" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function BarChart({
  data,
  animated,
}: {
  data: { label: string; value: number; color: string }[];
  animated: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((d, i) => {
        const height = (d.value / max) * 100;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] text-gray-400 font-mono">{d.value}</span>
            <div className="w-full rounded-t-md relative" style={{ height: "100px" }}>
              <div
                className="absolute bottom-0 w-full rounded-t-md transition-all duration-700 ease-out"
                style={{
                  height: animated ? `${height}%` : "0%",
                  backgroundColor: d.color,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
            <span className="text-[10px] text-gray-500">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({
  data,
  animated,
}: {
  data: { label: string; value: number }[];
  animated: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const width = 100;
  const height = 60;
  const padding = 4;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <div className="relative h-20">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
        </defs>
        <path
          d={areaD}
          fill="url(#lineGrad)"
          className={`transition-opacity duration-1000 ${animated ? "opacity-100" : "opacity-0"}`}
        />
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-opacity duration-700 ${animated ? "opacity-100" : "opacity-0"}`}
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] text-gray-500">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
        <Icon className="h-4 w-4 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
      <div
        className={`flex items-center gap-0.5 text-xs font-medium ${
          positive ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {positive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        {change}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TwitterAnalytics() {
  const [animated, setAnimated] = useState(false);
  const [tweetData] = useState(generateTweetData);
  const [engagementData] = useState(generateEngagementData);
  const [followerData] = useState(generateFollowerData);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) setAnimated(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animated]);

  const totalTweets = tweetData.reduce((s, d) => s + d.tweets, 0);
  const totalImpressions = tweetData.reduce((s, d) => s + d.impressions, 0);
  const totalLikes = tweetData.reduce((s, d) => s + d.likes, 0);
  const avgEngagement = engagementData.reduce((s, d) => s + d.rate, 0) / engagementData.length;
  const followerGrowth =
    ((followerData[followerData.length - 1].count - followerData[0].count) /
      followerData[0].count) *
    100;

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10">
            <Twitter className="h-4.5 w-4.5 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Twitter Analytics</h3>
            <p className="text-xs text-gray-500">7-day performance overview</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
          Connected
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <MiniStat
          icon={MessageSquare}
          label="Tweets"
          value={String(totalTweets)}
          change="+18%"
          positive
        />
        <MiniStat
          icon={Eye}
          label="Impressions"
          value={`${(totalImpressions / 1000).toFixed(1)}K`}
          change="+24%"
          positive
        />
        <MiniStat
          icon={Heart}
          label="Engagement"
          value={`${avgEngagement.toFixed(1)}%`}
          change="+0.6%"
          positive
        />
        <MiniStat
          icon={Users}
          label="Followers"
          value={`${(followerData[followerData.length - 1].count / 1000).toFixed(1)}K`}
          change={`+${followerGrowth.toFixed(1)}%`}
          positive
        />
      </div>

      {/* Tweet Volume Chart */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-gray-500" />
            Tweet Volume
          </h4>
          <span className="text-[10px] text-gray-500">Last 7 days</span>
        </div>
        <BarChart
          animated={animated}
          data={tweetData.map((d) => ({
            label: d.day,
            value: d.tweets,
            color: "rgba(56,189,248,0.7)",
          }))}
        />
      </div>

      {/* Engagement Rate */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
            Engagement Rate
          </h4>
          <span className="text-[10px] text-gray-500">
            Avg: {avgEngagement.toFixed(1)}%
          </span>
        </div>
        <LineChart
          animated={animated}
          data={engagementData.map((d) => ({ label: d.day, value: d.rate }))}
        />
      </div>

      {/* Follower Growth */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gray-500" />
            Follower Growth
          </h4>
          <span className="text-[10px] text-gray-500">
            {followerData[0].count.toLocaleString()} &rarr;{" "}
            {followerData[followerData.length - 1].count.toLocaleString()}
          </span>
        </div>
        <LineChart
          animated={animated}
          data={followerData.map((d) => ({ label: d.day, value: d.count }))}
        />
      </div>

      {/* Best Time to Tweet */}
      <div>
        <h4 className="text-xs font-medium text-gray-300 flex items-center gap-1.5 mb-3">
          <Clock className="h-3.5 w-3.5 text-gray-500" />
          Recommended Post Times
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {BEST_TIMES.map((slot) => (
            <div
              key={slot.hour}
              className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md ${
                  slot.score >= 90
                    ? "bg-emerald-500/15"
                    : slot.score >= 75
                    ? "bg-blue-500/15"
                    : "bg-gray-500/15"
                }`}
              >
                <span
                  className={`text-[10px] font-bold ${
                    slot.score >= 90
                      ? "text-emerald-400"
                      : slot.score >= 75
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {slot.score}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white">{slot.hour}</p>
                <p className="text-[10px] text-gray-500">
                  {slot.label} &middot; {slot.engagement}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Tweets */}
      <div>
        <h4 className="text-xs font-medium text-gray-300 flex items-center gap-1.5 mb-3">
          <Calendar className="h-3.5 w-3.5 text-gray-500" />
          Top Tweets This Week
        </h4>
        <div className="space-y-2">
          {[
            {
              text: "Just submitted my artwork to the Injective contest! 🎨",
              likes: 256,
              retweets: 64,
              impressions: "8.2K",
            },
            {
              text: "Real-time earnings are amazing - watching my USDC grow every second 💰",
              likes: 128,
              retweets: 32,
              impressions: "4.5K",
            },
            {
              text: "The AI assistant helped me create a wallet in 2 minutes 🤖",
              likes: 89,
              retweets: 21,
              impressions: "3.1K",
            },
          ].map((tweet, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/10 text-[10px] font-bold text-sky-400 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 leading-relaxed truncate">
                  {tweet.text}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                    <Heart className="h-2.5 w-2.5" /> {tweet.likes}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                    <Repeat2 className="h-2.5 w-2.5" /> {tweet.retweets}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                    <Eye className="h-2.5 w-2.5" /> {tweet.impressions}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
