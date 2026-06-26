"use client";

import { ArrowUpRight, ArrowDownRight, Clock, Shield } from "lucide-react";

interface TradeCardProps {
  type: "buy" | "sell";
  asset: string;
  amount: string;
  price: string;
  total: string;
  status?: "pending" | "confirmed" | "failed";
  timestamp?: string;
  protected?: boolean;
  className?: string;
}

const statusConfig = {
  pending: { color: "text-amber-400", bg: "bg-amber-500/10" },
  confirmed: { color: "text-emerald-400", bg: "bg-emerald-500/10" },
  failed: { color: "text-red-400", bg: "bg-red-500/10" },
};

export function TradeCard({
  type,
  asset,
  amount,
  price,
  total,
  status = "confirmed",
  timestamp,
  protected: isProtected = false,
  className = "",
}: TradeCardProps) {
  const config = statusConfig[status];
  const isBuy = type === "buy";

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isBuy ? "bg-emerald-500/15" : "bg-red-500/15"
          }`}>
            {isBuy ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{isBuy ? "Buy" : "Sell"} {asset}</p>
            <p className="text-xs text-gray-500">{amount}</p>
          </div>
        </div>
        <div className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div>
          <p className="text-gray-500">Price</p>
          <p className="font-medium text-white">{price}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Total</p>
          <p className="font-medium text-white">{total}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {timestamp && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{timestamp}</span>
          </div>
        )}
        {isProtected && (
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Shield className="h-3 w-3" />
            <span>Protected</span>
          </div>
        )}
      </div>
    </div>
  );
}
