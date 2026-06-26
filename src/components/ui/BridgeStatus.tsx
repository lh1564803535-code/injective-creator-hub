"use client";

import { ArrowRightLeft, CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";

interface BridgeStatusProps {
  fromChain: string;
  toChain: string;
  amount: string;
  token: string;
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
  className?: string;
}

const statusConfig = {
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", label: "Bridging..." },
  confirmed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Complete" },
  failed: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", label: "Failed" },
};

export function BridgeStatus({
  fromChain,
  toChain,
  amount,
  token,
  status,
  txHash,
  className = "",
}: BridgeStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-400">Bridge Transfer</span>
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${config.bg}`}>
          <Icon className={`h-3 w-3 ${config.color}`} />
          <span className={`text-[10px] font-medium ${config.color}`}>{config.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-lg bg-white/[0.04] p-2 text-center">
          <p className="text-[10px] text-gray-500">From</p>
          <p className="text-xs font-medium text-white">{fromChain}</p>
        </div>
        <ArrowRightLeft className="h-4 w-4 text-gray-600" />
        <div className="flex-1 rounded-lg bg-white/[0.04] p-2 text-center">
          <p className="text-[10px] text-gray-500">To</p>
          <p className="text-xs font-medium text-white">{toChain}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-medium text-white">{amount} {token}</span>
        {txHash && (
          <a
            href={`https://testnet.blockscout.injective.network/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400"
          >
            View tx
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
