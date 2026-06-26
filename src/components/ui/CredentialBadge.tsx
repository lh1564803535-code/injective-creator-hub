"use client";

import { Award, Shield, ExternalLink } from "lucide-react";

interface CredentialBadgeProps {
  name: string;
  issuer: string;
  type: "achievement" | "membership" | "skill" | "attendance";
  verified?: boolean;
  explorerUrl?: string;
  className?: string;
}

const typeConfig = {
  achievement: { icon: Award, color: "text-amber-400 bg-amber-500/10" },
  membership: { icon: Shield, color: "text-cyan-400 bg-cyan-500/10" },
  skill: { icon: Award, color: "text-emerald-400 bg-emerald-500/10" },
  attendance: { icon: Award, color: "text-purple-400 bg-purple-500/10" },
};

export function CredentialBadge({
  name,
  issuer,
  type,
  verified = false,
  explorerUrl,
  className = "",
}: CredentialBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${
      verified ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/[0.06] bg-white/[0.02]"
    } ${className}`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-white">{name}</p>
        <p className="text-[10px] text-gray-500">by {issuer}</p>
      </div>
      {verified && <Shield className="h-4 w-4 text-emerald-400" />}
      {explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
