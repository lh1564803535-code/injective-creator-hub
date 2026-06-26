"use client";

import { Copy, ExternalLink, LogOut } from "lucide-react";

interface WalletInfoProps {
  address: string;
  balance?: string;
  chainId?: number;
  onDisconnect?: () => void;
  className?: string;
}

export function WalletInfo({
  address,
  balance,
  chainId = 1439,
  onDisconnect,
  className = "",
}: WalletInfoProps) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const explorerUrl = chainId === 1439
    ? "https://testnet.blockscout.injective.network/address/"
    : "https://explorer.injective.network/address/";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
            <span className="text-sm font-bold text-white">
              {address.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{shortAddress}</p>
            {balance && (
              <p className="text-xs text-gray-500">{balance}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/[0.04] hover:text-white"
            title="Copy address"
          >
            <Copy className="h-4 w-4" />
          </button>
          <a
            href={`${explorerUrl}${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/[0.04] hover:text-white"
            title="View on explorer"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          {onDisconnect && (
            <button
              onClick={onDisconnect}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
              title="Disconnect"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
