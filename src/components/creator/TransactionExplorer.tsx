"use client";

import { useState } from "react";
import {
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Fuel,
  Box,
  Copy,
  Check,
} from "lucide-react";

type TxStatus = "success" | "failed" | "pending";

interface TransactionInfo {
  hash: string;
  status: TxStatus;
  blockNumber: number;
  gasUsed: string;
  timestamp: number;
  from: string;
  to: string;
  amount: string;
  token: string;
}

// Mock 交易数据
const MOCK_TX_DATA: Record<string, TransactionInfo> = {
  "0xabc123def456": {
    hash: "0xabc123def456789012345678901234567890abcdef1234567890abcdef123456",
    status: "success",
    blockNumber: 5892341,
    gasUsed: "0.0021 INJ",
    timestamp: Date.now() - 3600000,
    from: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    to: "0x1234567890abcdef1234567890abcdef12345678",
    amount: "50.00",
    token: "USDC",
  },
  "0xdef456abc789": {
    hash: "0xdef456abc789012345678901234567890abcdef9876543210fedcba98765432",
    status: "failed",
    blockNumber: 5892280,
    gasUsed: "0.0015 INJ",
    timestamp: Date.now() - 7200000,
    from: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    to: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    amount: "25.00",
    token: "USDC",
  },
  "0x789abc012def": {
    hash: "0x789abc012def3456789012345678901234567890abcdef1234567890abcdef01",
    status: "pending",
    blockNumber: 0,
    gasUsed: "~0.0018 INJ",
    timestamp: Date.now() - 300000,
    from: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    to: "0x9876543210fedcba9876543210fedcba98765432",
    amount: "100.00",
    token: "USDC",
  },
};

const BLOCKSCOUT_BASE = "https://testnet.blockscout.injective.network/tx";

const statusConfig: Record<TxStatus, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "交易成功",
  },
  failed: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    label: "交易失败",
  },
  pending: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "待确认",
  },
};

function shortenHash(hash: string) {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function timeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface TransactionExplorerProps {
  txHash?: string;
}

export function TransactionExplorer({ txHash }: TransactionExplorerProps) {
  const [inputHash, setInputHash] = useState(txHash ?? "");
  const [copied, setCopied] = useState(false);

  // 查找交易数据
  const matchedKey = Object.keys(MOCK_TX_DATA).find((k) =>
    inputHash.toLowerCase().includes(k.toLowerCase())
  );
  const tx = matchedKey ? MOCK_TX_DATA[matchedKey] : null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <ExternalLink className="h-5 w-5 text-gray-400" />
        交易浏览器
      </h3>

      {/* 搜索框 */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="输入交易哈希 (0x...)"
          value={inputHash}
          onChange={(e) => setInputHash(e.target.value)}
          className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#1DA1F2]/40"
        />
        <a
          href={inputHash ? `${BLOCKSCOUT_BASE}/${inputHash}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1a8cd8]"
        >
          <ExternalLink className="h-4 w-4" />
          查看
        </a>
      </div>

      {/* 交易详情 */}
      {tx ? (
        <div className="space-y-3">
          {/* 状态 */}
          <div
            className={`flex items-center gap-3 rounded-lg ${statusConfig[tx.status].bg} p-3`}
          >
            {(() => {
              const Icon = statusConfig[tx.status].icon;
              return <Icon className={`h-5 w-5 ${statusConfig[tx.status].color}`} />;
            })()}
            <span className={`text-sm font-medium ${statusConfig[tx.status].color}`}>
              {statusConfig[tx.status].label}
            </span>
            <span className="ml-auto text-xs text-gray-500">{timeAgo(tx.timestamp)}</span>
          </div>

          {/* 详细信息 */}
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <DetailRow label="交易哈希">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-300">{shortenHash(tx.hash)}</span>
                <button
                  onClick={() => handleCopy(tx.hash)}
                  className="text-gray-500 transition-colors hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </DetailRow>

            <DetailRow label="区块号">
              <span className="flex items-center gap-1.5 text-sm text-gray-300">
                <Box className="h-3.5 w-3.5 text-gray-500" />
                {tx.blockNumber > 0 ? `#${tx.blockNumber.toLocaleString()}` : "等待打包"}
              </span>
            </DetailRow>

            <DetailRow label="Gas 用量">
              <span className="flex items-center gap-1.5 text-sm text-gray-300">
                <Fuel className="h-3.5 w-3.5 text-gray-500" />
                {tx.gasUsed}
              </span>
            </DetailRow>

            <DetailRow label="金额">
              <span className="text-sm font-medium text-white">
                {tx.amount} {tx.token}
              </span>
            </DetailRow>
          </div>

          {/* 区块浏览器链接 */}
          <a
            href={`${BLOCKSCOUT_BASE}/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 transition-all hover:border-[#1DA1F2]/30 hover:bg-white/[0.06] hover:text-[#1DA1F2]"
          >
            <ExternalLink className="h-4 w-4" />
            在 Blockscout 上查看完整详情
          </a>
        </div>
      ) : inputHash ? (
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-gray-500">未找到匹配的交易记录</p>
          <p className="mt-1 text-xs text-gray-600">试试：0xabc123 / 0xdef456 / 0x789abc</p>
        </div>
      ) : (
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-gray-500">输入交易哈希以查看详情</p>
          <p className="mt-1 text-xs text-gray-600">示例：0xabc123def456</p>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      {children}
    </div>
  );
}
