"use client";

import { useState, useRef, useEffect } from "react";
import {
  Gift,
  Users,
  Send,
  Check,
  ExternalLink,
  ChevronDown,
  Loader2,
  AlertCircle,
  Trophy,
  Coins,
  Copy,
  CheckCheck,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Winner {
  rank: number;
  address: string;
  votes: number;
  percentage: number;
  rewardAmount: number;
  avatar: string;
  handle: string;
}

interface Campaign {
  id: number;
  title: string;
  totalPool: number; // USDC
  status: "active" | "ended" | "distributing";
  winnerCount: number;
}

interface TransactionRecord {
  hash: string;
  timestamp: number;
  totalAmount: number;
  recipientCount: number;
  status: "pending" | "confirmed" | "failed";
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 1, title: "XHunt Content Sprint", totalPool: 5000, status: "ended", winnerCount: 5 },
  { id: 2, title: "DeFi Education Series", totalPool: 3000, status: "ended", winnerCount: 3 },
  { id: 3, title: "NFT Art Showcase", totalPool: 8000, status: "ended", winnerCount: 8 },
];

function generateWinners(campaignId: number): Winner[] {
  const names = [
    "artby_injective", "defi_ninja", "crypto_canvas",
    "block_builder", "nft_creator", "web3_artist",
    "yield_farmer", "token_whisperer",
  ];
  const votes = [1240, 890, 650, 420, 310, 240, 180, 120];
  const totalVotes = votes.reduce((s, v) => s + v, 0);

  return Array.from({ length: 5 }, (_, i) => ({
    rank: i + 1,
    address: `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}...${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    votes: votes[i],
    percentage: +((votes[i] / totalVotes) * 100).toFixed(1),
    rewardAmount: 0,
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${names[i]}`,
    handle: names[i],
  }));
}

const MOCK_TX_HASH =
  "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CampaignSelector({
  campaigns,
  selected,
  onSelect,
}: {
  campaigns: Campaign[];
  selected: Campaign | null;
  onSelect: (c: Campaign) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
      >
        <span className="text-sm text-white">
          {selected ? selected.title : "Select a campaign..."}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border border-white/[0.08] bg-[#0d0f13] shadow-xl">
          {campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onSelect(c);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.05] first:rounded-t-xl last:rounded-b-xl"
            >
              <span className="text-gray-200">{c.title}</span>
              <span className="text-[10px] text-gray-500">{c.totalPool} USDC pool</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function WinnerRow({
  winner,
  amount,
  onAmountChange,
  rankColors,
}: {
  winner: Winner;
  amount: string;
  onAmountChange: (v: string) => void;
  rankColors: string[];
}) {
  const medalEmoji = ["🥇", "🥈", "🥉"];

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.05] px-3 py-2.5">
      {/* Rank */}
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
        style={{
          backgroundColor:
            winner.rank <= 3 ? `${rankColors[winner.rank - 1]}20` : "rgba(255,255,255,0.05)",
          color: winner.rank <= 3 ? rankColors[winner.rank - 1] : "#9ca3af",
        }}
      >
        {winner.rank <= 3 ? medalEmoji[winner.rank - 1] : `#${winner.rank}`}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-white truncate">{winner.handle}</span>
          <span className="text-[10px] text-gray-500 font-mono">{winner.address}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-500">
            {winner.votes.toLocaleString()} votes
          </span>
          <span className="text-[10px] text-gray-600">|</span>
          <span className="text-[10px] text-emerald-400/80">{winner.percentage}%</span>
        </div>
      </div>

      {/* Reward Input */}
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className="w-20 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-right text-xs text-white placeholder-gray-600 outline-none focus:border-emerald-500/50 transition-colors"
        />
        <span className="text-[10px] text-gray-500">USDC</span>
      </div>
    </div>
  );
}

function TxStatus({ record }: { record: TransactionRecord }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(record.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-3 w-3 text-emerald-400" />
        </div>
        <span className="text-sm font-semibold text-emerald-400">
          Distribution Successful
        </span>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Recipients</span>
          <span className="text-white font-medium">{record.recipientCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total Sent</span>
          <span className="text-white font-medium">{record.totalAmount} USDC</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Tx Hash</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-mono text-[10px]">
              {record.hash.slice(0, 10)}...{record.hash.slice(-6)}
            </span>
            <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
              {copied ? (
                <CheckCheck className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      <a
        href={`https://testnet.explorer.injective.network/transaction/${record.hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        View on Explorer
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function RewardDistributor() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [amounts, setAmounts] = useState<string[]>([]);
  const [distributing, setDistributing] = useState(false);
  const [txRecord, setTxRecord] = useState<TransactionRecord | null>(null);
  const [mode, setMode] = useState<"manual" | "proportional" | "ranking">("manual");
  const [totalPoolInput, setTotalPoolInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const rankColors = ["#fbbf24", "#94a3b8", "#cd7f32"];

  useEffect(() => {
    if (!selectedCampaign) return;
    const w = generateWinners(selectedCampaign.id);
    setWinners(w);
    setAmounts(w.map(() => ""));
    setTxRecord(null);
  }, [selectedCampaign]);

  const totalReward = amounts.reduce((s, a) => s + (parseFloat(a) || 0), 0);

  // Auto-calculate by ranking: 50/30/20
  const applyRankingDistribution = () => {
    const pool = parseFloat(totalPoolInput);
    if (!pool || winners.length === 0) return;
    const shares = [0.5, 0.3, 0.2];
    const newAmounts = winners.map((w, i) => {
      if (i < 3) return (pool * shares[i]).toFixed(2);
      return "0";
    });
    setAmounts(newAmounts);
  };

  // Auto-calculate by proportional votes
  const applyProportionalDistribution = () => {
    const pool = parseFloat(totalPoolInput);
    if (!pool || winners.length === 0) return;
    const totalVotes = winners.reduce((s, w) => s + w.votes, 0);
    const newAmounts = winners.map((w) => ((w.votes / totalVotes) * pool).toFixed(2));
    setAmounts(newAmounts);
  };

  // Mock distribute
  const handleDistribute = async () => {
    setDistributing(true);
    // Simulate blockchain tx
    await new Promise((r) => setTimeout(r, 2500));
    setTxRecord({
      hash: MOCK_TX_HASH,
      timestamp: Date.now(),
      totalAmount: totalReward,
      recipientCount: amounts.filter((a) => parseFloat(a) > 0).length,
      status: "confirmed",
    });
    setDistributing(false);
  };

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
          <Gift className="h-4.5 w-4.5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Reward Distributor</h3>
          <p className="text-xs text-gray-500">Distribute rewards to campaign winners</p>
        </div>
      </div>

      {/* Campaign Selector */}
      <CampaignSelector
        campaigns={MOCK_CAMPAIGNS}
        selected={selectedCampaign}
        onSelect={setSelectedCampaign}
      />

      {selectedCampaign && (
        <>
          {/* Distribution Mode */}
          <div className="flex gap-2">
            {(["manual", "proportional", "ranking"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  if (m === "proportional") applyProportionalDistribution();
                  if (m === "ranking") applyRankingDistribution();
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === m
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.05]"
                }`}
              >
                {m === "manual"
                  ? "Manual"
                  : m === "proportional"
                  ? "By Votes"
                  : "By Ranking"}
              </button>
            ))}
          </div>

          {/* Pool Input (for auto modes) */}
          {mode !== "manual" && (
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-gray-500" />
              <input
                type="number"
                value={totalPoolInput}
                onChange={(e) => setTotalPoolInput(e.target.value)}
                placeholder="Total pool (USDC)"
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500/50 transition-colors"
              />
              <button
                onClick={
                  mode === "proportional"
                    ? applyProportionalDistribution
                    : applyRankingDistribution
                }
                className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/25 transition-colors"
              >
                Calculate
              </button>
            </div>
          )}

          {/* Winners List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-gray-500" />
                Winners ({winners.length})
              </h4>
              <span className="text-[10px] text-gray-500">
                Pool: {selectedCampaign.totalPool} USDC
              </span>
            </div>
            <div className="space-y-1.5">
              {winners.map((w, i) => (
                <WinnerRow
                  key={w.address}
                  winner={w}
                  amount={amounts[i]}
                  onAmountChange={(v) => {
                    const next = [...amounts];
                    next[i] = v;
                    setAmounts(next);
                  }}
                  rankColors={rankColors}
                />
              ))}
            </div>
          </div>

          {/* Summary + Distribute */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Recipients</span>
              <span className="text-white">
                {amounts.filter((a) => parseFloat(a) > 0).length} / {winners.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Total Reward</span>
              <span className="text-emerald-400 font-semibold">
                {totalReward.toFixed(2)} USDC
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Remaining Pool</span>
              <span className={selectedCampaign.totalPool - totalReward >= 0 ? "text-white" : "text-red-400"}>
                {(selectedCampaign.totalPool - totalReward).toFixed(2)} USDC
              </span>
            </div>
          </div>

          <button
            onClick={handleDistribute}
            disabled={distributing || totalReward === 0 || totalReward > selectedCampaign.totalPool}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {distributing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Distributing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Distribute Rewards
              </>
            )}
          </button>

          {totalReward > selectedCampaign.totalPool && (
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              Total reward exceeds campaign pool
            </div>
          )}

          {/* Tx Result */}
          {txRecord && <TxStatus record={txRecord} />}
        </>
      )}
    </div>
  );
}
