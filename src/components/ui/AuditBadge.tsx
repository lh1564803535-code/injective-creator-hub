"use client";

import { Shield, CheckCircle, ExternalLink } from "lucide-react";

interface AuditBadgeProps {
  auditor: string;
  date?: string;
  status: "passed" | "pending" | "failed";
  reportUrl?: string;
  className?: string;
}

const statusConfig = {
  passed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Audited" },
  pending: { icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10", label: "Pending" },
  failed: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10", label: "Failed" },
};

export function AuditBadge({
  auditor,
  date,
  status,
  reportUrl,
  className = "",
}: AuditBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${
      status === "passed" ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/[0.06] bg-white/[0.02]"
    } ${className}`}>
      <Icon className={`h-4 w-4 ${config.color}`} />
      <div>
        <p className="text-xs font-medium text-white">{auditor}</p>
        {date && <p className="text-[10px] text-gray-500">{date}</p>}
      </div>
      {reportUrl && (
        <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
