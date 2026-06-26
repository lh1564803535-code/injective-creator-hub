"use client";

import { Clock, Users, CheckCircle, XCircle, ExternalLink } from "lucide-react";

interface ProposalCardProps {
  title: string;
  description: string;
  status: "active" | "passed" | "failed" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVoters: number;
  endDate?: string;
  explorerUrl?: string;
  className?: string;
}

const statusConfig = {
  active: { icon: Clock, color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Active" },
  passed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Passed" },
  failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Failed" },
  pending: { icon: Clock, color: "text-gray-400", bg: "bg-gray-500/10", label: "Pending" },
};

export function ProposalCard({
  title,
  description,
  status,
  votesFor,
  votesAgainst,
  totalVoters,
  endDate,
  explorerUrl,
  className = "",
}: ProposalCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const totalVotes = votesFor + votesAgainst;
  const forPercent = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 50;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{description}</p>
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${config.bg}`}>
          <Icon className={`h-3 w-3 ${config.color}`} />
          <span className={`text-[10px] font-medium ${config.color}`}>{config.label}</span>
        </div>
      </div>

      {/* Vote bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-[10px]">
          <span className="text-emerald-400">For: {votesFor}</span>
          <span className="text-red-400">Against: {votesAgainst}</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="bg-emerald-500 transition-all"
            style={{ width: `${forPercent}%` }}
          />
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${100 - forPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{totalVoters} voters</span>
        </div>
        {endDate && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{endDate}</span>
          </div>
        )}
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-500 hover:text-cyan-400"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
