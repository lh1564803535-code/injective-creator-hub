"use client";

import { useState } from "react";
import {
  Wallet,
  Vote,
  FileText,
  ExternalLink,
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
} from "lucide-react";
import { formatUSDC } from "@/lib/injective";
import { useToast } from "@/components/ui/Toast";
import { StatTrend, Sparkline } from "@/components/ui/StatTrend";
import type { Address } from "viem";

// ---------------------------------------------------------------------------
// Mock dashboard data
// ---------------------------------------------------------------------------

interface DashboardSubmission {
  id: number;
  campaignId: number;
  campaignTitle: string;
  contentURI: string;
  votes: number;
  reward: bigint;
  claimed: boolean;
  settled: boolean;
  submittedAt: number;
}

const MOCK_DASHBOARD_DATA: Record<
  string,
  {
    totalEarnings: bigint;
    totalVotes: number;
    submissions: DashboardSubmission[];
  }
> = {
  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e": {
    totalEarnings: BigInt(4500000000),
    totalVotes: 156,
    submissions: [
      {
        id: 1,
        campaignId: 1,
        campaignTitle: "XHunt Content Sprint",
        contentURI: "https://twitter.com/user/status/101",
        votes: 42,
        reward: BigInt(0),
        claimed: false,
        settled: false,
        submittedAt: Date.now() / 1000 - 86400 * 3,
      },
      {
        id: 8,
        campaignId: 3,
        campaignTitle: "Meme Contest #42",
        contentURI: "https://imgur.com/meme-3",
        votes: 45,
        reward: BigInt(0),
        claimed: false,
        settled: false,
        submittedAt: Date.now() / 1000 - 86400 * 5,
      },
      {
        id: 13,
        campaignId: 5,
        campaignTitle: "Community Art Drop",
        contentURI: "https://opensea.io/art-winner",
        votes: 180,
        reward: BigInt(1800000000),
        claimed: false,
        settled: true,
        submittedAt: Date.now() / 1000 - 86400 * 20,
      },
    ],
  },
};

// Default data for any connected wallet
const DEFAULT_DATA = {
  totalEarnings: BigInt(750000000),
  totalVotes: 43,
  submissions: [
    {
      id: 100,
      campaignId: 2,
      campaignTitle: "DeFi Tutorial Challenge",
      contentURI: "https://medium.com/@user/tutorial",
      votes: 28,
      reward: BigInt(500000000),
      claimed: false,
      settled: true,
      submittedAt: Date.now() / 1000 - 86400 * 10,
    },
    {
      id: 101,
      campaignId: 4,
      campaignTitle: "Build on Injective Hackathon",
      contentURI: "https://github.com/user/project",
      votes: 15,
      reward: BigInt(0),
      claimed: false,
      settled: false,
      submittedAt: Date.now() / 1000 - 86400 * 2,
    },
    {
      id: 102,
      campaignId: 1,
      campaignTitle: "XHunt Content Sprint",
      contentURI: "https://youtube.com/watch?v=demo",
      votes: 8,
      reward: BigInt(250000000),
      claimed: true,
      settled: true,
      submittedAt: Date.now() / 1000 - 86400 * 15,
    },
  ],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CreatorDashboardProps {
  address: Address;
}

export function CreatorDashboard({ address }: CreatorDashboardProps) {
  const data = MOCK_DASHBOARD_DATA[address] || DEFAULT_DATA;
  const { toast } = useToast();
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleClaim = (submissionId: number, reward: bigint) => {
    setClaimingId(submissionId);
    toast({
      variant: "pending",
      title: "Claiming reward...",
      description: `${formatUSDC(reward)} USDC is being transferred`,
      duration: 0,
    });
    setTimeout(() => {
      setClaimedIds((prev) => new Set([...prev, submissionId]));
      setClaimingId(null);
      toast({
        variant: "success",
        title: "Reward claimed!",
        description: `${formatUSDC(reward)} USDC has been sent to your wallet`,
      });
    }, 2000);
  };

  const totalClaimable = data.submissions
    .filter(
      (s) => s.settled && s.reward > BigInt(0) && !s.claimed && !claimedIds.has(s.id)
    )
    .reduce((sum, s) => sum + s.reward, BigInt(0));

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() / 1000 - timestamp;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-emerald-500/20">
          <div className="mb-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-400" />
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Total Earnings
            </p>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-emerald-400">
              {formatUSDC(data.totalEarnings)} USDC
            </p>
            <Sparkline
              data={[30, 45, 25, 60, 55, 70, 85]}
              color="#22c55e"
              width={56}
              height={20}
            />
          </div>
          <div className="mt-2">
            <StatTrend value={18.2} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-cyan-500/20">
          <div className="mb-2 flex items-center gap-2">
            <Vote className="h-4 w-4 text-cyan-400" />
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Total Votes
            </p>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-cyan-400">
              {data.totalVotes.toLocaleString()}
            </p>
            <Sparkline
              data={[10, 22, 18, 35, 28, 42, 38]}
              color="#06b6d4"
              width={56}
              height={20}
            />
          </div>
          <div className="mt-2">
            <StatTrend value={12.5} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-purple-500/20">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-400" />
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Submissions
            </p>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-purple-400">
              {data.submissions.length}
            </p>
            <Sparkline
              data={[1, 2, 1, 3, 2, 4, 3]}
              color="#8b5cf6"
              width={56}
              height={20}
            />
          </div>
          <div className="mt-2">
            <StatTrend value={5.3} />
          </div>
        </div>
      </div>

      {/* Claimable rewards banner */}
      {totalClaimable > BigInt(0) && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-300">
                  Rewards Available
                </p>
                <p className="text-xs text-gray-400">
                  {formatUSDC(totalClaimable)} USDC ready to claim
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions list */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Your Submissions
        </h2>

        <div className="space-y-3">
          {data.submissions
            .sort((a, b) => b.submittedAt - a.submittedAt)
            .map((sub) => {
              const isExpanded = expandedId === sub.id;
              const isClaimable =
                sub.settled &&
                sub.reward > BigInt(0) &&
                !sub.claimed &&
                !claimedIds.has(sub.id);
              const isClaimed = sub.claimed || claimedIds.has(sub.id);

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]"
                >
                  {/* Main row */}
                  <div
                    className="flex cursor-pointer items-center justify-between p-4"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : sub.id)
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="truncate text-sm font-medium text-white">
                          {sub.campaignTitle}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            sub.settled
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {sub.settled ? "Settled" : "Active"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Vote className="h-3 w-3" />
                          {sub.votes} votes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(sub.submittedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {sub.reward > BigInt(0) && (
                        <p
                          className={`text-sm font-semibold ${
                            isClaimed
                              ? "text-gray-500 line-through"
                              : "text-emerald-400"
                          }`}
                        >
                          {formatUSDC(sub.reward)} USDC
                        </p>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-white/[0.06] px-4 py-3">
                      <div className="flex items-center justify-between">
                        <a
                          href={sub.contentURI}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-cyan-400 transition hover:bg-cyan-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Content
                        </a>

                        <div className="flex items-center gap-2">
                          {isClaimed && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                              <Check className="h-3 w-3" />
                              Claimed
                            </span>
                          )}

                          {isClaimable && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClaim(sub.id, sub.reward);
                              }}
                              disabled={claimingId === sub.id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-xl disabled:opacity-50"
                            >
                              {claimingId === sub.id ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Claiming...
                                </>
                              ) : (
                                <>
                                  <Wallet className="h-3 w-3" />
                                  Claim {formatUSDC(sub.reward)} USDC
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
