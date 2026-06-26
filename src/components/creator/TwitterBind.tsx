"use client";

import { useState } from "react";
import {
  Loader2,
  Check,
  ExternalLink,
  TrendingUp,
  MessageCircle,
  Heart,
  Repeat2,
  Unlink,
  Users,
  Tweet,
  BarChart3,
} from "lucide-react";
import {
  connectTwitter,
  getTwitterStats,
  getRecentTweets,
  type TwitterProfile,
  type TwitterStats,
} from "@/lib/twitter";

type BindState = "idle" | "loading" | "bound";

export function TwitterBind() {
  const [state, setState] = useState<BindState>("idle");
  const [profile, setProfile] = useState<TwitterProfile | null>(null);
  const [stats, setStats] = useState<TwitterStats | null>(null);
  const [tweets, setTweets] = useState<Awaited<ReturnType<typeof getRecentTweets>>>([]);
  const [showStats, setShowStats] = useState(false);

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
    setShowStats(false);
  };

  // ---- 未绑定 ----
  if (state === "idle") {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">社交账号绑定</h3>
        <p className="mb-6 text-sm text-gray-400">
          绑定 Twitter 账号以展示社交影响力，解锁更多活动参与资格。
        </p>
        <button
          onClick={handleConnect}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1DA1F2] px-6 py-3 font-medium text-white transition-all hover:bg-[#1a8cd8] hover:shadow-[0_0_20px_rgba(29,161,242,0.3)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          绑定 Twitter 账号
        </button>
      </div>
    );
  }

  // ---- 绑定中 ----
  if (state === "loading") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-10">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#1DA1F2]" />
        <p className="text-sm text-gray-400">正在连接 Twitter...</p>
      </div>
    );
  }

  // ---- 已绑定 ----
  return (
    <div className="space-y-4">
      {/* 账号卡片 */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6 transition-all hover:border-[#1DA1F2]/20 hover:shadow-[0_0_20px_rgba(29,161,242,0.1)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Twitter 账号</h3>
          <span className="flex items-center gap-1 rounded-full bg-[#1DA1F2]/10 px-3 py-1 text-xs font-medium text-[#1DA1F2]">
            <Check className="h-3 w-3" />
            已绑定
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* 头像 */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9] text-xl font-bold text-white">
            {profile?.displayName?.charAt(0) ?? "?"}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{profile?.displayName}</span>
              {profile?.verified && (
                <Check className="h-4 w-4 rounded-full bg-[#1DA1F2] p-0.5 text-white" />
              )}
            </div>
            <span className="text-sm text-gray-400">@{profile?.username}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span className="font-medium text-white">{profile?.followers.toLocaleString()}</span>
            <span>粉丝</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/[0.06]"
          >
            <BarChart3 className="h-4 w-4" />
            {showStats ? "隐藏数据" : "查看社交数据"}
          </button>
          <button
            onClick={handleDisconnect}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Unlink className="h-4 w-4" />
            解绑
          </button>
        </div>
      </div>

      {/* 社交数据面板 */}
      {showStats && stats && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
          <h4 className="mb-4 text-sm font-medium text-gray-400">本周社交数据</h4>
          <div className="mb-4 grid grid-cols-3 gap-4">
            <StatCard
              icon={<Tweet className="h-4 w-4" />}
              label="发推数"
              value={stats.tweetsThisWeek}
              color="text-[#1DA1F2]"
            />
            <StatCard
              icon={<MessageCircle className="h-4 w-4" />}
              label="被提及"
              value={stats.mentionsThisWeek}
              color="text-purple-400"
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4" />}
              label="互动率"
              value={`${stats.engagementRate}%`}
              color="text-emerald-400"
            />
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="mb-1 text-xs text-gray-500">增长趋势</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">+{stats.growthRate}%</span>
              <span className="text-xs text-gray-500">本周粉丝增长</span>
            </div>
          </div>
        </div>
      )}

      {/* 最近推文 */}
      {showStats && tweets.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
          <h4 className="mb-4 text-sm font-medium text-gray-400">最近推文</h4>
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
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
      <div className={`mb-1 flex justify-center ${color}`}>{icon}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
