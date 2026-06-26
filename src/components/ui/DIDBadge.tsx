"use client";

import { Shield, CheckCircle, ExternalLink } from "lucide-react";

interface DIDBadgeProps {
  did: string;
  verified?: boolean;
  label?: string;
  explorerUrl?: string;
  className?: string;
}

export function DIDBadge({
  did,
  verified = false,
  label,
  explorerUrl,
  className = "",
}: DIDBadgeProps) {
  const shortDid = did.length > 30 ? `${did.slice(0, 15)}...${did.slice(-10)}` : did;

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${
      verified
        ? "border-emerald-500/20 bg-emerald-500/5"
        : "border-white/[0.06] bg-white/[0.02]"
    } ${className}`}>
      <Shield className={`h-4 w-4 ${verified ? "text-emerald-400" : "text-gray-400"}`} />
      <div>
        {label && <p className="text-[10px] text-gray-500">{label}</p>}
        <p className="text-xs font-mono text-white">{shortDid}</p>
      </div>
      {verified && (
        <CheckCircle className="h-4 w-4 text-emerald-400" />
      )}
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-cyan-400"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
