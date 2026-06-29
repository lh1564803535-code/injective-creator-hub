"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Check,
  X,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastVariant = "success" | "error" | "warning" | "info" | "pending";

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number; // ms, 0 = persistent
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

const variantConfig: Record<
  ToastVariant,
  { icon: typeof Check; border: string; bg: string; iconColor: string }
> = {
  success: {
    icon: Check,
    border: "border-emerald-500/30",
    bg: "bg-[#00D4AA]/10",
    iconColor: "text-[#00D4AA]",
  },
  error: {
    icon: X,
    border: "border-red-500/30",
    bg: "bg-[#F6465D]/10",
    iconColor: "text-[#F6465D]",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500/30",
    bg: "bg-[#F0B90B]/10",
    iconColor: "text-[#F0B90B]",
  },
  info: {
    icon: Info,
    border: "border-cyan-500/30",
    bg: "bg-[#00D4AA]/10",
    iconColor: "text-[#00D4AA]",
  },
  pending: {
    icon: Loader2,
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    iconColor: "text-purple-400",
  },
};

// ---------------------------------------------------------------------------
// Individual toast item
// ---------------------------------------------------------------------------

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const config = variantConfig[t.variant];
  const Icon = config.icon;

  return (
    <div
      className={`animate-toast-in flex items-start gap-3 rounded-xl border ${config.border} ${config.bg} p-4 backdrop-blur-xl shadow-lg shadow-black/20 pointer-events-auto max-w-sm w-full`}
      role="alert"
    >
      <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
        <Icon
          className={`h-4 w-4 ${t.variant === "pending" ? "animate-spin" : ""}`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#EAECEF]">{t.title}</p>
        {t.description && (
          <p className="mt-0.5 text-xs text-[#848E9C]">{t.description}</p>
        )}
      </div>
      {t.variant !== "pending" && (
        <button
          onClick={() => onDismiss(t.id)}
          className="shrink-0 text-[#848E9C] transition hover:text-[#EAECEF]"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = `toast-${++toastCounter}`;
      const duration = t.duration ?? (t.variant === "pending" ? 0 : 4000);

      setToasts((prev) => [...prev, { ...t, id }]);

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  const ctx = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {mounted && createPortal(
          <div
            aria-live="polite"
            className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2"
          >
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
