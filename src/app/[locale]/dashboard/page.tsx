"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  BarChart3,
  Bell,
  Plus,
  Search,
  Trophy,
  Send,
  Zap,
  ExternalLink,
} from "lucide-react";
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
import { AchievementBadges } from "@/components/creator/AchievementBadges";
import { RewardsBreakdown } from "@/components/creator/RewardsBreakdown";
import { SecurityTips } from "@/components/ui/SecurityTips";
import { QuickStats } from "@/components/ui/QuickStats";
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
  reward: "text-[#F0B90B] bg-[#F0B90B]/10",
  vote: "text-[#00D4AA] bg-[#00D4AA]/10",
  deadline: "text-[#F59E0B] bg-[#F59E0B]/10",
  settle: "text-[#00D4AA] bg-[#00D4AA]/10",
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { isConnected, address } = useAccount();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h1 className="mb-2 text-xl font-bold text-[#EAECEF]">{t("title")}</h1>
        <p className="text-sm text-[#848E9C]">
          {isConnected && address
            ? `${t("subtitle")} ${shortenAddress(address)}`
            : t("connect")}
        </p>
      </div>

      {!isConnected ? (
        <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-12 text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-[#848E9C]" />
          <h2 className="mb-2 text-xl font-bold text-[#EAECEF]">
            连接钱包开始赚取收益
          </h2>
          <p className="mb-6 text-[#848E9C]">
            连接钱包以创建活动、提交内容、赚取 USDC 奖励
          </p>
          <div className="mb-8 flex justify-center">
            <ConnectButton />
          </div>
          <div className="mx-auto grid max-w-md grid-cols-3 gap-4 text-center">
            {[
              { step: "1", label: "连接钱包", desc: "MetaMask 或 WalletConnect" },
              { step: "2", label: "参与活动", desc: "浏览活跃赏金" },
              { step: "3", label: "赚取 USDC", desc: "即时到账" },
            ].map((s) => (
              <div key={s.step}>
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#00D4AA]/15 text-sm font-bold text-[#00D4AA]">
                  {s.step}
                </div>
                <p className="text-sm font-medium text-[#EAECEF]">{s.label}</p>
                <p className="text-xs text-[#848E9C]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <QuickStats />

          {/* Quick Actions */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#EAECEF]">
              {t("quickActions")}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/create"
                className="group flex items-center gap-3 rounded-xl border border-[#00D4AA]/20 bg-[#00D4AA]/5 p-4 transition hover:border-[#00D4AA]/40 hover:bg-[#00D4AA]/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00D4AA]/15 text-[#00D4AA] transition group-hover:bg-[#00D4AA]/25">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#EAECEF]">
                    {t("create")}
                  </p>
                  <p className="text-xs text-[#848E9C]">{t("createDesc")}</p>
                </div>
              </Link>
              <Link
                href="/leaderboard"
                className="group flex items-center gap-3 rounded-xl border border-[#F0B90B]/20 bg-[#F0B90B]/5 p-4 transition hover:border-[#F0B90B]/40 hover:bg-[#F0B90B]/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0B90B]/15 text-[#F0B90B] transition group-hover:bg-[#F0B90B]/25">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#EAECEF]">
                    {t("viewLeaderboard")}
                  </p>
                  <p className="text-xs text-[#848E9C]">
                    {t("viewLeaderboardDesc")}
                  </p>
                </div>
              </Link>
              <Link
                href="/campaigns"
                className="group flex items-center gap-3 rounded-xl border border-[#2B3139] bg-[#1E2329] p-4 transition hover:border-[#00D4AA]/20 hover:bg-[#2B3139]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2B3139] text-[#848E9C] transition group-hover:bg-[#00D4AA]/15 group-hover:text-[#00D4AA]">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#EAECEF]">
                    {t("browseCampaigns")}
                  </p>
                  <p className="text-xs text-[#848E9C]">
                    {t("browseCampaignsDesc")}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <LiveEarnings enableViewOnly />
          <CampaignRecommendations />
          <CreatorDashboard address={address as Address} />
          <YieldStaking />
          <CreatorStreak />
          <CreatorAnalytics address={address as Address} />
          <CreatorReputation address={address as Address} />
          <TransactionHistory />
          <GasEstimator />
          <NetworkStatus />
          <AchievementBadges />
          <RewardsBreakdown />
          <SecurityTips />

          {/* Notifications */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[#EAECEF]">
                <Bell className="h-5 w-5 text-[#848E9C]" />
                {t("notifications")}
                {unreadCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F6465D]/20 text-[10px] font-bold text-[#F6465D]">
                    {unreadCount}
                  </span>
                )}
              </h2>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#848E9C] transition hover:text-[#EAECEF]"
                >
                  {t("markAllRead")}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {notifications.map((notif) => {
                const Icon = notifIcons[notif.type] ?? Bell;
                const colorClass =
                  notifColors[notif.type] ?? "text-[#848E9C] bg-[#2B3139]";
                return (
                  <div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      notif.read
                        ? "border-[#2B3139]/50 bg-[#1E2329]/50"
                        : "border-[#00D4AA]/10 bg-[#00D4AA]/[0.03] hover:bg-[#00D4AA]/[0.06]"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${notif.read ? "font-normal text-[#848E9C]" : "font-medium text-[#EAECEF]"}`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-[#848E9C]">{notif.detail}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-xs text-[#848E9C]">
                        {timeAgo(notif.timestamp)}
                      </span>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-[#00D4AA]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#EAECEF]">
              {t("recentActivity")}
            </h2>
            <div className="space-y-2">
              {MOCK_ACTIVITY.slice(0, 6).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 rounded-xl border border-[#2B3139] bg-[#1E2329] px-4 py-3 transition hover:bg-[#2B3139]/50"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      activity.type === "submission"
                        ? "text-[#00D4AA] bg-[#00D4AA]/10"
                        : activity.type === "vote"
                          ? "text-[#00D4AA] bg-[#00D4AA]/10"
                          : activity.type === "settle"
                            ? "text-[#F0B90B] bg-[#F0B90B]/10"
                            : "text-[#00D4AA] bg-[#00D4AA]/10"
                    }`}
                  >
                    {activity.type === "submission" && (
                      <Send className="h-4 w-4" />
                    )}
                    {activity.type === "vote" && <Zap className="h-4 w-4" />}
                    {activity.type === "settle" && <Trophy className="h-4 w-4" />}
                    {activity.type === "claim" && (
                      <Trophy className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#EAECEF]">
                      <span className="text-[#848E9C]">
                        {activity.type === "submission" && t("newSubmission")}
                        {activity.type === "vote" && t("voteIn")}
                        {activity.type === "settle" && t("settledLabel")}
                        {activity.type === "claim" && t("rewardClaimed")}
                      </span>{" "}
                      <Link
                        href={`/campaign/${activity.campaignId}`}
                        className="font-medium text-[#00D4AA] hover:text-[#00D4AA]/80"
                      >
                        {activity.campaignTitle}
                      </Link>
                    </p>
                    {activity.detail && (
                      <p className="text-xs text-[#848E9C]">
                        {activity.detail}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-[#848E9C]">
                    {timeAgo(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#00D4AA] transition hover:text-[#00D4AA]/80"
            >
              {t("viewAllActivity")}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
