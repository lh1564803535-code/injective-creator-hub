"use client";

import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
}

const variantConfig = {
  info: { icon: Info, bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
  success: { icon: CheckCircle, bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  error: { icon: AlertCircle, bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
};

export function Alert({ variant = "info", title, children }: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.text}`} />
        <div>
          {title && <p className={`mb-1 font-medium ${config.text}`}>{title}</p>}
          <div className="text-sm text-gray-400">{children}</div>
        </div>
      </div>
    </div>
  );
}
