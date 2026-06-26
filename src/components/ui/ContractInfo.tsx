"use client";

import { FileCode, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ContractInfoProps {
  address: string;
  name?: string;
  chainId?: number;
  verified?: boolean;
  explorerUrl?: string;
  className?: string;
}

export function ContractInfo({
  address,
  name,
  chainId = 1439,
  verified = false,
  explorerUrl,
  className = "",
}: ContractInfoProps) {
  const [copied, setCopied] = useState(false);
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const defaultExplorerUrl = chainId === 1439
    ? `https://testnet.blockscout.injective.network/address/${address}`
    : `https://explorer.injective.network/address/${address}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 ${className}`}>
      <FileCode className={`h-4 w-4 ${verified ? "text-emerald-400" : "text-gray-400"}`} />
      <div className="flex-1">
        {name && <p className="text-xs font-medium text-white">{name}</p>}
        <p className="text-[10px] font-mono text-gray-500">{shortAddress}</p>
      </div>
      {verified && (
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
          Verified
        </span>
      )}
      <button
        onClick={handleCopy}
        className="text-gray-500 hover:text-white"
        title="Copy address"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <a
        href={explorerUrl || defaultExplorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-cyan-400"
        title="View on explorer"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
