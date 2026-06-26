"use client";

import { useState } from "react";
import {
  Trophy,
  Users,
  Send,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Gift,
  Award,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Campaign {
  id: number;
  title: string;
  status: "active" | "ended" | "upcoming";
  submissions: number;
  prize: string;
  deadline: string;
}

interface Creator {
  id: number;
  address: string;
  twitterHandle: string;
  displayName: string;
  followers: number;
  submissions: number;
  totalEarned: string;
  selected: boolean;
}

interface RewardRecord {
  id: number;
  txHash: string;
  recipient: string;
  amount: string;
  campaign: string;
  status: "success" | "pending" | "failed";
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 1, title: "DeFi Content Challenge", status: "active", submissions: 48, prize: "5,000 USDC", deadline: "2026-07-15" },
  { id: 2, title: "NFT Art Showcase", status: "active", submissions: 32, prize: "3,000 USDC", deadline: "2026-07-10" },
  { id: 3, title: "Web3 Developer Tools", status: "ended", submissions: 65, prize: "8,000 USDC", deadline: "2026-06-20" },
  { id: 4, title: "Community Education Series", status: "upcoming", submissions: 0, prize: "2,000 USDC", deadline: "2026-08-01" },
];

const MOCK_CREATORS: Creator[] = [
  { id: 1, address: "0x742d...bD3e", twitterHandle: "@creator_demo", displayName: "创作者演示", followers: 12500, submissions: 5, totalEarned: "450.00", selected: false },
  { id: 2, address: "0x1234...5678", twitterHandle: "@web3artist", displayName: "Web3 艺术家", followers: 8900, submissions: 3, totalEarned: "280.00", selected: false },
  { id: 3, address: "0xabcd...efgh", twitterHandle: "@defi_writer", displayName: "DeFi 写手", followers: 21000, submissions: 7, totalEarned: "920.00", selected: false },
  { id: 4, address: "0x9876...5432", twitterHandle: "@nft_creator", displayName: "NFT 创作者", followers: 5600, submissions: 2, totalEarned: "150.00", selected: false },
  { id: 5, address: "0xdef0...1234", twitterHandle: "@crypto_educator", displayName: "加密教育者", followers: 34000, submissions: 10, totalEarned: "1,200.00", selected: false },
];

const MOCK_REWARD_RECORDS: RewardRecord[] = [
  { id: 1, txHash: "0xabc123def456", recipient: "0x742d...bD3e", amount: "50.00", campaign: "DeFi Content Challenge", status: "success", timestamp: Date.now() - 3600000 },
  { id: 2, txHash: "0xdef456abc789", recipient: "0xabcd...efgh", amount: "120.00", campaign: "Web3 Developer Tools", status: "success", timestamp: Date.now() - 7200000 },
  { id: 3, txHash: "0x789abc012def", recipient: "0x1234...5678", amount: "75.00", campaign: "NFT Art Showcase", status: "pending", timestamp: Date.now() - 300000 },
  { id: 4, txHash: "0x456def789abc", recipient: "0x9876...5432", amount: "200.00", campaign: "DeFi Content Challenge", status: "success", timestamp: Date.now() - 86400000 },
  { id: 5, txHash: "0xfedcba987654", recipient: "0xdef0...1234", amount: "300.00", campaign: "Web3 Developer Tools", status: "failed", timestamp: Date.now() - 172800000 },
];

const BLOCKSCOUT_BASE = "https://testnet.blockscout.injective.network/tx";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "进行中" },
  ended: { color: "text-gray-400", bg: "bg-gray-500/10", label: "已结束" },
  upcoming: { color: "text-blue-400", bg: "bg-blue-500/10", label: "即将开始" },
  success: { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "成功" },
  pending: { color: "text-amber-400", bg: "bg-amber-500/10", label: "待确认" },
  failed: { color: "text-red-400", bg: "bg-red-500/10", label: "失败" },
};

// ---------------------------------------------------------------------------
// Admin Page
// ---------------------------------------------------------------------------

type Tab = "campaigns" | "creators" | "rewards" | "records";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("campaigns");
  const [creators, setCreators] = useState(MOCK_CREATORS);
  const [rewardAmount, setRewardAmount] = useState("");
  const [rewarding, setRewarding] = useState(false);
  const [rewardDone, setRewardDone] = useState(false);
  const [recordsExpanded, setRecordsExpanded] = useState(true);

  const selectedCount = creators.filter((c) => c.selected).length;

  const toggleCreator = (id: number) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const selectAll = () => {
    const allSelected = creators.every((c) => c.selected);
    setCreators((prev) => prev.map((c) => ({ ...c, selected: !allSelected })));
  };

  const handleDistribute = async () => {
    if (!rewardAmount || selectedCount === 0) return;
    setRewarding(true);
    await new Promise((r) => setTimeout(r, 2000));
    setRewarding(false);
    setRewardDone(true);
    setTimeout(() => setRewardDone(false), 3000);
    setCreators((prev) => prev.map((c) => ({ ...c, selected: false })));
    setRewardAmount("");
  };

  const tabs: { key: Tab; label: string; icon: typeof Trophy }[] = [
    { key: "campaigns", label: "活动管理", icon: Trophy },
    { key: "creators", label: "创作者列表", icon: Users },
    { key: "rewards", label: "批量发奖励", icon: Gift },
    { key: "records", label: "交易记录", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0d0d0d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
            <div className="h-4 w-px bg-white/[0.1]" />
            <h1 className="text-lg font-bold">管理后台</h1>
          </div>
          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
            Admin
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Tab Nav */}
        <div className="mb-8 flex gap-1 rounded-xl border border-white/[0.06] bg-[#1a1a1a] p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-white/[0.08] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ---- Campaigns Tab ---- */}
        {tab === "campaigns" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">所有活动</h2>
              <button className="flex items-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1a8cd8]">
                <Plus className="h-4 w-4" />
                创建新活动
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {MOCK_CAMPAIGNS.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-5 transition-all hover:border-white/[0.1]"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-medium text-white">{c.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[c.status].bg} ${statusStyles[c.status].color}`}
                    >
                      {statusStyles[c.status].label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{c.submissions}</div>
                      <div className="text-xs text-gray-500">提交数</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-400">{c.prize}</div>
                      <div className="text-xs text-gray-500">奖池</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-300">{c.deadline}</div>
                      <div className="text-xs text-gray-500">截止日期</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- Creators Tab ---- */}
        {tab === "creators" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">绑定 Twitter 的创作者</h2>
              <span className="text-sm text-gray-500">{creators.length} 位创作者</span>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-xs text-gray-500">
                    <th className="px-5 py-3 font-medium">创作者</th>
                    <th className="px-5 py-3 font-medium">Twitter</th>
                    <th className="px-5 py-3 font-medium">粉丝</th>
                    <th className="px-5 py-3 font-medium">提交数</th>
                    <th className="px-5 py-3 font-medium">总收入</th>
                  </tr>
                </thead>
                <tbody>
                  {creators.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-bold">
                            {c.displayName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white">{c.displayName}</div>
                            <div className="text-xs text-gray-500">{c.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#1DA1F2]">{c.twitterHandle}</td>
                      <td className="px-5 py-4 text-gray-300">{c.followers.toLocaleString()}</td>
                      <td className="px-5 py-4 text-gray-300">{c.submissions}</td>
                      <td className="px-5 py-4 font-medium text-emerald-400">{c.totalEarned} USDC</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---- Rewards Tab ---- */}
        {tab === "rewards" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">批量发放奖励</h2>

            {/* 选择获奖者 */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-400">
                  选择获奖者 ({selectedCount} 已选)
                </h3>
                <button
                  onClick={selectAll}
                  className="text-xs text-[#1DA1F2] transition-colors hover:text-[#1a8cd8]"
                >
                  {creators.every((c) => c.selected) ? "取消全选" : "全选"}
                </button>
              </div>

              <div className="space-y-2">
                {creators.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCreator(c.id)}
                    className={`flex w-full items-center gap-4 rounded-lg border p-3 text-left transition-all ${
                      c.selected
                        ? "border-[#1DA1F2]/30 bg-[#1DA1F2]/5"
                        : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        c.selected
                          ? "border-[#1DA1F2] bg-[#1DA1F2]"
                          : "border-gray-600"
                      }`}
                    >
                      {c.selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-white">{c.displayName}</span>
                      <span className="ml-2 text-xs text-gray-500">{c.twitterHandle}</span>
                    </div>
                    <span className="text-sm text-gray-400">{c.address}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 输入金额 & 发放 */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
              <h3 className="mb-4 text-sm font-medium text-gray-400">发放金额</h3>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="输入 USDC 金额"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 pr-16 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#1DA1F2]/40"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    USDC
                  </span>
                </div>
                <button
                  onClick={handleDistribute}
                  disabled={rewarding || !rewardAmount || selectedCount === 0}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {rewarding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : rewardDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {rewarding ? "发放中..." : rewardDone ? "已完成" : "一键发放"}
                </button>
              </div>
              {selectedCount > 0 && rewardAmount && (
                <p className="mt-3 text-xs text-gray-500">
                  将向 {selectedCount} 位创作者各发放 {rewardAmount} USDC，总计{" "}
                  {(Number(rewardAmount) * selectedCount).toFixed(2)} USDC
                </p>
              )}
            </div>
          </div>
        )}

        {/* ---- Records Tab ---- */}
        {tab === "records" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">发放记录</h2>
              <span className="text-sm text-gray-500">{MOCK_REWARD_RECORDS.length} 条记录</span>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-xs text-gray-500">
                    <th className="px-5 py-3 font-medium">交易</th>
                    <th className="px-5 py-3 font-medium">接收者</th>
                    <th className="px-5 py-3 font-medium">金额</th>
                    <th className="px-5 py-3 font-medium">活动</th>
                    <th className="px-5 py-3 font-medium">状态</th>
                    <th className="px-5 py-3 font-medium">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_REWARD_RECORDS.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <a
                          href={`${BLOCKSCOUT_BASE}/${r.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono text-xs text-[#1DA1F2] transition-colors hover:text-[#1a8cd8]"
                        >
                          {r.txHash.slice(0, 10)}...
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-300">{r.recipient}</td>
                      <td className="px-5 py-4 font-medium text-white">{r.amount} USDC</td>
                      <td className="px-5 py-4 text-gray-400">{r.campaign}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[r.status].bg} ${statusStyles[r.status].color}`}
                        >
                          {statusStyles[r.status].label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">{timeAgo(r.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
