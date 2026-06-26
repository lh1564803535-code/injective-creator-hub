"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Heart,
  Repeat2,
  Users,
  Clock,
  BarChart3,
  Calendar,
  Loader2,
  Check,
  Unlink,
} from "lucide-react";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import {
  connectTwitter,
  getTwitterStats,
  getRecentTweets,
  type TwitterProfile,
  type TwitterStats,
} from "@/lib/twitter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BindState = "idle" | "loading" | "bound";

interface BestTime {
  day: string;
  hour: string;
  score: number;
}

// ---------------------------------------------------------------------------
// Mock best posting times
// ---------------------------------------------------------------------------

const BEST_TIMES: BestTime[] = [
  { day: "Mon", hour: "9:00 AM", score: 92 },
  { day: "Wed", hour: "12:00 PM", score: 88 },
  { day: "Thu", hour: "6:00 PM", score: 85 },
  { day: "Fri", hour: "3:00 PM", score: 80 },
  { day: "Sat", hour: "10:00 AM", score: 76 },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SocialDashboard() {
  const [state, setState] = useState<BindState>("idle");
  const [profile, setProfile] = useState<TwitterProfile | null>(null);
  const [stats, setStats] = useState<TwitterStats | null>(null);
  const [tweets, setTweets] = useState<Awaited<ReturnType<typeof getRecentTweets>>>([]);

  const handleConnect = async () => {
    setState("loading");
    try {
      const p = await connectTwitter();
      setProfile(p);
      const s = await getTwitterStats(p.id);
      setStats(s);
      const t = await getRecentTweets(p.id);
      setTweets(t);
      setState("bound");
    } catch {
      setState("idle");
    }
  };

  const handleDisconnect = () => {
    setState("idle");
    setProfile(null);
    setStats(null);
    setTweets([]);
  };

  // ---- Unbound state ----
  if (state === "idle") {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
        <div className="mb-2 flex items-center gap-3">
          <TwitterIcon className="h-5 w-5 text-[#1DA1F2]" />
          <h3 className="text-lg font-semibold text-white">Social Dashboard</h3>
        </div>
        <p className="mb-6 text-sm text-gray-400">
          Connect your Twitter account to view social analytics, engagement metrics, and optimal posting times.
        </p>
        <button
          onClick={handleConnect}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1DA1F2] px-6 py-3 font-medium text-white transition-all hover:bg-[#1a8cd8] hover:shadow-[0_0_20px_rgba(29,161,242,0.3)]"
        >
          <TwitterIcon className="h-5 w-5" />
          Connect Twitter
        </button>
      </div>
    );
  }

  // ---- Loading state ----
  if (state === "loading") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-12">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#1DA1F2]" />
        <p className="text-sm text-gray-400">Connecting to Twitter...</p>
      </div>
    );
  }

  // ---- Bound state ----
  return (
    <div className="space-y-4">
      {/* Twitter binding status */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TwitterIcon className="h-5 w-5 text-[#1DA1F2]" />
            <h3 className="text-lg font-semibold text-white">Social Dashboard</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 rounded-full bg-[#1DA1F2]/10 px-3 py-1 text-xs font-medium text-[#1DA1F2]">
              <Check className="h-3 w-3" />
              Connected
            </span>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20"
            >
              <Unlink className="h-3 w-3" />
              Disconnect
            </button>
          </div>
        </div>

        {/* Profile info */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9] text-lg font-bold text-white">
            {profile?.displayName?.charAt(0) ?? "?"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{profile?.displayName}</span>
              {profile?.verified && (
                <Check className="h-4 w-4 rounded-full bg-[#1DA1F2] p-0.5 text-white" />
              )}
            </div>
            <span className="text-sm text-gray-400">@{profile?.username}</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span className="font-medium text-white">{profile?.followers.toLocaleString()}</span>
            <span>followers</span>
          </div>
        </div>
      </div>

      {/* Stats overview */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Posts This Week"
            value={stats.tweetsThisWeek}
            icon={<MessageCircle className="h-4 w-4" />}
            color="text-[#1DA1F2]"
            trend={null}
          />
          <StatCard
            label="Engagement Rate"
            value={`${stats.engagementRate}%`}
            icon={<Heart className="h-4 w-4" />}
            color="text-rose-400"
            trend={{ value: 1.2, up: true }}
          />
          <StatCard
            label="Mentions"
            value={stats.mentionsThisWeek}
            icon={<Repeat2 className="h-4 w-4" />}
            color="text-emerald-400"
            trend={null}
          />
          <StatCard
            label="Follower Growth"
            value={`+${stats.growthRate}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            color="text-purple-400"
            trend={{ value: stats.growthRate, up: true }}
          />
        </div>
      )}

      {/* Recent tweets */}
      {tweets.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
          <h4 className="mb-4 text-sm font-medium text-gray-400">Recent Posts</h4>
          <div className="space-y-3">
            {tweets.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
              >
                <p className="mb-3 text-sm text-gray-200">{t.text}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-400" />
                    {t.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Repeat2 className="h-3 w-3 text-emerald-400" />
                    {t.retweets}
                  </span>
                  <span className="ml-auto">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best posting times */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-400" />
          <h4 className="text-sm font-medium text-gray-400">Recommended Posting Times</h4>
        </div>
        <div className="space-y-2">
          {BEST_TIMES.map((bt) => (
            <div
              key={bt.day + bt.hour}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-sm text-gray-300">
                  {bt.day} {bt.hour}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1DA1F2] to-cyan-400"
                    style={{ width: `${bt.score}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-gray-400">
                  {bt.score}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-gray-600">
          Scores based on historical engagement patterns of your audience.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend: { value: number; up: boolean } | null;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className={`${color}`}>{icon}</div>
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-[11px] font-medium ${
              trend.up ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {trend.up ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}%
          </span>
        )}
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="mt-0.5 text-xs text-gray-500">{label}</div>
    </div>
  );
}
