"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "active" | "pending" | "ended" | "error" | "success";
  size?: "sm" | "md";
  label?: string;
}

const statusConfig = {
  active: {
    icon: CheckCircle,
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    defaultLabel: "Active",
  },
  pending: {
    icon: Clock,
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    defaultLabel: "Pending",
  },
  ended: {
    icon: XCircle,
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/20",
    defaultLabel: "Ended",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    defaultLabel: "Error",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    defaultLabel: "Success",
  },
};

export function StatusBadge({ status, size = "sm", label }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${config.bg} ${config.border} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
    >
      <Icon className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} ${config.text}`} />
      <span className={`font-medium ${config.text}`}>{displayLabel}</span>
    </span>
  );
}
