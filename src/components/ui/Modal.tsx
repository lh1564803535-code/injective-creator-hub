"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: ModalAction[];
  size?: "sm" | "md" | "lg" | "xl";
  closeable?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const actionVariantClasses = {
  primary:
    "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90",
  secondary:
    "border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]",
  ghost: "text-gray-400 hover:text-white hover:bg-white/[0.04]",
  danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  size = "md",
  closeable = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeable) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, closeable]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === overlayRef.current && closeable && onClose()}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-2xl border border-white/[0.08] bg-[#1a1a1a] shadow-2xl animate-in zoom-in-95 fade-in duration-200`}
      >
        {/* Header */}
        {(title || closeable) && (
          <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-4">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-white">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
            {closeable && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer Actions */}
        {actions && actions.length > 0 && (
          <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                disabled={action.loading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  actionVariantClasses[action.variant || "primary"]
                } ${action.loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {action.loading && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                )}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
