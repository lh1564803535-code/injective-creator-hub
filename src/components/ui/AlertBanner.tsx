"use client";

import { useState } from "react";
import { X, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface AlertBannerProps {
  type: "info" | "warning" | "success";
  message: string;
  dismissible?: boolean;
  className?: string;
}

const typeConfig = {
  info: { icon: Info, bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  success: { icon: CheckCircle, bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
};

export function AlertBanner({
  type,
  message,
  dismissible = true,
  className = "",
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border ${config.border} ${config.bg} px-4 py-3 ${className}`}
    >
      <Icon className={`h-5 w-5 ${config.text}`} />
      <p className="flex-1 text-sm text-white">{message}</p>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-500 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
