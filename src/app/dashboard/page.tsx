"use client";

import { ArrowLeft, BarChart3, Bell, Plus, Search, Trophy, Send, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { YieldStaking } from "@/components/creator/YieldStaking";
import { CreatorReputation } from "@/components/creator/CreatorReputation";
import { CreatorStreak } from "@/components/creator/CreatorStreak";
import { CreatorAnalytics } from "@/components/creator/CreatorAnalytics";
import { CampaignRecommendations } from "@/components/creator/CampaignRecommendations";
import { LiveEarnings } from "@/components/creator/LiveEarnings";
import { TransactionHistory } from "@/components/creator/TransactionHistory";
import { GasEstimator } from "@/components/ui/GasEstimator";
import { NetworkStatus } from "@/components/ui/NetworkStatus";
import { WalletOnboarding } from "@/components/ui/WalletOnboarding";
import { AchievementBadges } from "@/components/creator/AchievementBadges";
import { RewardsBreakdown } from "@/components/creator/RewardsBreakdown";
import { SecurityTips } from "@/components/ui/SecurityTips";
import { shortenAddress } from "@/lib/injective";
import { MOCK_ACTIVITY, MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { useNotifications } from "@/components/ui/NotificationCenter";
import type { Address } from "viem";

const now = Math.floor(Date.now() / 1000);

function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const notifIcons: Record<string, typeof Trophy> = {
  reward: Trophy,
  vote: Send,
  deadline: Zap,
  settle: Trophy,
};

const notifColors: Record<string, string> = {
  reward: "text-amber-400 bg-amber-500/10",
  vote: "text-emerald-400 bg-emerald-500/10",
  deadline: "text-orange-400 bg-orange-500/10",
  settle: "text-cyan-400 bg-cyan-500/10",
};

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const activeCampaigns = MOCK_CAMPAIGNS.filter(
    (c) => !c.settled && c.deadline > now
  );

  return (
    <div className="min-h-screen bg-[#08080f] p-6 pt-22 lg:p-8 lg:pt-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-white">
            Creator Dashboard
          </h1>
          <p className="text-gray-400">
            {isConnected && address
              ? `Viewing dashboard for ${shortenAddress(address)}`
              : "Connect your wallet to view your submissions and earnings"}
          </p>
        </div>

        {!isConnected ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-12 text-center backdrop-blur-sm">
            <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-4 text-gray-400">
              Connect your wallet to access your dashboard
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Link
                  href="/create"
                  className="group flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 transition hover:border-cyan-500/40 hover:bg-cyan-500/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 transition group-hover:bg-cyan-500/25">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Create Campaign</p>
                    <p className="text-xs text-gray-500">Launch a new bounty</p>
                  </div>
                </Link>
                <Link
                  href="/leaderboard"
                  className="group flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 transition hover:border-amber-500/40 hover:bg-amber-500/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 transition group-hover:bg-amber-500/25">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">View Leaderboard</p>
                    <p className="text-xs text-gray-500">See top creators</p>
                  </div>
                </Link>
                <Link
                  href="/campaigns"
                  className="group flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 transition group-hover:bg-emerald-500/25">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Browse Campaigns</p>
                    <p className="text-xs text-gray-500">Find content to create</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Live Earnings — Real-time streaming display */}
            <LiveEarnings enableViewOnly />

            {/* AI Campaign Recommendations */}
            <CampaignRecommendations />

            {/* Main Dashboard */}
            <CreatorDashboard address={address as Address} />

            {/* Yield Staking */}
            <YieldStaking />

            {/* Creator Streak & Gamification */}
            <CreatorStreak />

            {/* Creator Analytics */}
            <CreatorAnalytics address={address as Address} />

            {/* On-Chain Reputation */}
            <CreatorReputation address={address as Address} />

            {/* Transaction History */}
            <TransactionHistory />

            {/* Gas Estimator */}
            <GasEstimator />

            {/* Network Status */}
            <NetworkStatus />

            {/* Achievement Badges */}
            <AchievementBadges />

            {/* Rewards Breakdown */}
            <RewardsBreakdown />

            {/* Security Tips */}
            <SecurityTips />

            {/* Notifications */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Bell className="h-5 w-5 text-gray-400" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">
                      {unreadCount}
                    </span>
                  )}
                </h2>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-gray-500 transition hover:text-gray-300"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {notifications.map((notif) => {
                  const Icon = notifIcons[notif.type] ?? Bell;
                  const colorClass = notifColors[notif.type] ?? "text-gray-400 bg-gray-500/10";
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        notif.read
                          ? "border-white/[0.04] bg-white/[0.015]"
                          : "border-cyan-500/10 bg-cyan-500/[0.03] hover:bg-cyan-500/[0.06]"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${notif.read ? "font-normal text-gray-400" : "font-medium text-gray-200"}`}>{notif.title}</p>
                        <p className="text-xs text-gray-500">{notif.detail}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-xs text-gray-600">{timeAgo(notif.timestamp)}</span>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
              <div className="space-y-2">
                {MOCK_ACTIVITY.slice(0, 6).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3 transition hover:bg-white/[0.03]"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      activity.type === "submission" ? "text-cyan-400 bg-cyan-500/10" :
                      activity.type === "vote" ? "text-emerald-400 bg-emerald-500/10" :
                      activity.type === "settle" ? "text-amber-400 bg-amber-500/10" :
                      "text-purple-400 bg-purple-500/10"
                    }`}>
                      {activity.type === "submission" && <Send className="h-4 w-4" />}
                      {activity.type === "vote" && <Zap className="h-4 w-4" />}
                      {activity.type === "settle" && <Trophy className="h-4 w-4" />}
                      {activity.type === "claim" && <Trophy className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-300">
                        <span className="text-gray-500">
                          {activity.type === "submission" && "New submission in"}
                          {activity.type === "vote" && "Vote in"}
                          {activity.type === "settle" && "Settled:"}
                          {activity.type === "claim" && "Reward claimed from"}
                        </span>{" "}
                        <Link
                          href={`/campaign/${activity.campaignId}`}
                          className="font-medium text-cyan-400 hover:text-cyan-300"
                        >
                          {activity.campaignTitle}
                        </Link>
                      </p>
                      {activity.detail && (
                        <p className="text-xs text-gray-600">{activity.detail}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-gray-600">
                      {timeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/"
                className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-400 transition hover:text-cyan-300"
              >
                View all activity
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
