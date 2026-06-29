"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Vote,
  Trophy,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "send" | "receive" | "vote" | "claim" | "submit";
  amount: string;
  token: string;
  from?: string;
  to?: string;
  timestamp: number;
  hash: string;
  status: "confirmed" | "pending";
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "claim",
    amount: "50.00",
    token: "USDC",
    from: "Campaign: DeFi Content Challenge",
    timestamp: Date.now() - 3600000,
    hash: "0xabc...def",
    status: "confirmed",
  },
  {
    id: "2",
    type: "vote",
    amount: "0",
    token: "INJ",
    to: "Campaign: NFT Art Showcase",
    timestamp: Date.now() - 7200000,
    hash: "0x123...456",
    status: "confirmed",
  },
  {
    id: "3",
    type: "receive",
    amount: "125.50",
    token: "USDC",
    from: "0x1234...5678",
    timestamp: Date.now() - 86400000,
    hash: "0x789...012",
    status: "confirmed",
  },
  {
    id: "4",
    type: "send",
    amount: "10.00",
    token: "USDC",
    to: "0xabcd...efgh",
    timestamp: Date.now() - 172800000,
    hash: "0xdef...abc",
    status: "confirmed",
  },
  {
    id: "5",
    type: "submit",
    amount: "0",
    token: "INJ",
    to: "Campaign: Web3 Developer Tools",
    timestamp: Date.now() - 259200000,
    hash: "0x456...789",
    status: "confirmed",
  },
];

const typeConfig = {
  send: {
    icon: ArrowUpRight,
    color: "text-[#F6465D]",
    bg: "bg-[#F6465D]/10",
    label: "Sent",
  },
  receive: {
    icon: ArrowDownLeft,
    color: "text-[#00D4AA]",
    bg: "bg-[#00D4AA]/10",
    label: "Received",
  },
  vote: {
    icon: Vote,
    color: "text-[#00D4AA]",
    bg: "bg-[#00D4AA]/10",
    label: "Voted",
  },
  claim: {
    icon: Trophy,
    color: "text-[#F0B90B]",
    bg: "bg-[#F0B90B]/10",
    label: "Claimed",
  },
  submit: {
    icon: ArrowUpRight,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    label: "Submitted",
  },
};

function timeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function TransactionHistory() {
  const [expanded, setExpanded] = useState(false);
  const transactions = expanded
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.slice(0, 3);

  return (
    <div className="rounded-xl border border-[#2B3139] bg-[#1a1a1a] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#EAECEF]">
          <Clock className="h-5 w-5 text-[#848E9C]" />
          Transaction History
        </h3>
        <span className="text-xs text-[#848E9C]">
          {MOCK_TRANSACTIONS.length} transactions
        </span>
      </div>

      <div className="space-y-2">
        {transactions.map((tx) => {
          const config = typeConfig[tx.type];
          const Icon = config.icon;

          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-xl border border-[#2B3139] bg-[#1E2329] p-3 transition hover:bg-[#2B3139]"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
              >
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#EAECEF]">
                    {config.label}
                  </p>
                  {tx.amount !== "0" && (
                    <p
                      className={`font-mono text-sm font-medium ${
                        tx.type === "send" ? "text-[#F6465D]" : "text-[#00D4AA]"
                      }`}
                    >
                      {tx.type === "send" ? "-" : "+"}
                      {tx.amount} {tx.token}
                    </p>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="truncate text-xs text-[#848E9C]">
                    {tx.from || tx.to}
                  </p>
                  <span className="text-xs text-[#848E9C]">
                    {timeAgo(tx.timestamp)}
                  </span>
                </div>
              </div>

              <a
                href={`https://testnet.blockscout.injective.network/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[#848E9C] transition hover:text-[#00D4AA]"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          );
        })}
      </div>

      {MOCK_TRANSACTIONS.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-[#2B3139] py-2 text-xs text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF]"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show all ({MOCK_TRANSACTIONS.length}){" "}
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
