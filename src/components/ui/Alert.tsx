"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

const variantConfig: Record<
  AlertVariant,
  { icon: typeof CheckCircle; bg: string; border: string; text: string; iconBg: string }
> = {
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-500/[0.08]",
    border: "border-emerald-500/25",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-500/[0.08]",
    border: "border-red-500/25",
    text: "text-red-400",
    iconBg: "bg-red-500/15",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/[0.08]",
    border: "border-amber-500/25",
    text: "text-amber-400",
    iconBg: "bg-amber-500/15",
  },
  info: {
    icon: Info,
    bg: "bg-cyan-500/[0.08]",
    border: "border-cyan-500/25",
    text: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
  },
};

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------

export function Alert({
  variant = "info",
  title,
  children,
  closable = false,
  onClose,
  className = "",
}: AlertProps) {
  const [visible, setVisible] = useState(true);
  const config = variantConfig[variant];
  const Icon = config.icon;

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div
      role="alert"
      className={`relative overflow-hidden rounded-xl border ${config.border} ${config.bg} p-4 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${config.text}`} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {title && (
            <p className={`mb-1 text-sm font-semibold ${config.text}`}>
              {title}
            </p>
          )}
          <div className="text-sm leading-relaxed text-gray-400">
            {children}
          </div>
        </div>

        {/* Close button */}
        {closable && (
          <button
            onClick={handleClose}
            className="shrink-0 rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Bottom accent bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
          variant === "success"
            ? "bg-emerald-500/30"
            : variant === "error"
              ? "bg-red-500/30"
              : variant === "warning"
                ? "bg-amber-500/30"
                : "bg-cyan-500/30"
        }`}
      />
    </div>
  );
}
