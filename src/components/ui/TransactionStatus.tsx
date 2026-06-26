"use client";

import { CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react";

interface TransactionStatusProps {
  status: "pending" | "confirmed" | "failed";
  hash?: string;
  chainId?: number;
  className?: string;
}

const statusConfig = {
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Confirmed" },
  failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Failed" },
};

export function TransactionStatus({
  status,
  hash,
  chainId = 1439,
  className = "",
}: TransactionStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const explorerUrl = chainId === 1439
    ? "https://testnet.blockscout.injective.network/tx/"
    : "https://explorer.injective.network/tx/";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${config.bg}`}>
        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
      </div>
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
      {hash && (
        <a
          href={`${explorerUrl}${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400"
        >
          {hash.slice(0, 6)}...{hash.slice(-4)}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
