"use client";

import { useState } from "react";
import { Search, ExternalLink, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { getTransactionStatus } from "@/lib/agent-tools";

interface TxResult {
  success: boolean;
  status: string;
  blockNumber?: number;
  gasUsed?: string;
  explorerLink?: string;
  message?: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "成功") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
        <CheckCircle className="h-3 w-3" />
        成功
      </span>
    );
  }
  if (status === "失败") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-400">
        <XCircle className="h-3 w-3" />
        失败
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
      <Clock className="h-3 w-3 animate-pulse" />
      查询中
    </span>
  );
}

export function BlockchainExplorer() {
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TxResult | null>(null);

  const handleSearch = async () => {
    const trimmed = hash.trim();
    if (!trimmed || !trimmed.startsWith("0x")) return;

    setLoading(true);
    setResult(null);

    try {
      const txResult = await getTransactionStatus(trimmed);
      setResult(txResult as TxResult);
    } catch {
      setResult({ success: false, status: "查询失败", message: "请检查交易哈希是否正确" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-white/[0.02] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10">
          <Search className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">区块浏览器</h3>
      </div>

      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="输入交易哈希 (0x...)"
          className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-white/[0.15] focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !hash.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Search className="h-3.5 w-3.5" />
          )}
          查询
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-3 space-y-2 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500">交易状态</span>
            <StatusBadge status={result.status} />
          </div>

          {result.success && result.blockNumber !== undefined && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">区块高度</span>
                <span className="text-xs font-medium text-white tabular-nums">
                  #{result.blockNumber.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Gas 消耗</span>
                <span className="text-xs font-medium text-white tabular-nums">
                  {result.gasUsed}
                </span>
              </div>
            </>
          )}

          {result.message && (
            <p className="text-[11px] text-gray-500">{result.message}</p>
          )}

          {result.explorerLink && (
            <a
              href={result.explorerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-[11px] text-cyan-400 transition-colors hover:text-cyan-300"
            >
              <ExternalLink className="h-3 w-3" />
              在区块浏览器查看
            </a>
          )}
        </div>
      )}
    </div>
  );
}
