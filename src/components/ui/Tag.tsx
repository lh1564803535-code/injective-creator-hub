"use client";

import { X } from "lucide-react";

interface TagProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  onRemove?: () => void;
}

const variantClasses = {
  default: "bg-white/[0.06] text-gray-400",
  success: "bg-emerald-500/10 text-emerald-400",
  warning: "bg-amber-500/10 text-amber-400",
  error: "bg-red-500/10 text-red-400",
  info: "bg-cyan-500/10 text-cyan-400",
};

export function Tag({ label, variant = "default", onRemove }: TagProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${variantClasses[variant]}`}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70"
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
