"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  X,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationVariant = "success" | "error" | "warning" | "info";

export interface NotificationItem {
  id: string;
  variant: NotificationVariant;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = no auto-dismiss
}

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

const variantConfig: Record<
  NotificationVariant,
  {
    icon: typeof Check;
    borderColor: string;
    bgGradient: string;
    iconBg: string;
    iconColor: string;
    progressColor: string;
  }
> = {
  success: {
    icon: Check,
    borderColor: "border-emerald-500/40",
    bgGradient: "bg-gradient-to-r from-emerald-950/90 to-gray-900/95",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    progressColor: "bg-emerald-400",
  },
  error: {
    icon: AlertCircle,
    borderColor: "border-red-500/40",
    bgGradient: "bg-gradient-to-r from-red-950/90 to-gray-900/95",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    progressColor: "bg-red-400",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-amber-500/40",
    bgGradient: "bg-gradient-to-r from-amber-950/90 to-gray-900/95",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    progressColor: "bg-amber-400",
  },
  info: {
    icon: Info,
    borderColor: "border-blue-500/40",
    bgGradient: "bg-gradient-to-r from-blue-950/90 to-gray-900/95",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    progressColor: "bg-blue-400",
  },
};

// ---------------------------------------------------------------------------
// Single notification card
// ---------------------------------------------------------------------------

function NotificationCard({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss: (id: string) => void;
}) {
  const config = variantConfig[item.variant];
  const Icon = config.icon;
  const duration = item.duration ?? 4000;
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const dismiss = useCallback(() => {
    setExiting(true);
    timerRef.current = setTimeout(() => onDismiss(item.id), 300);
  }, [item.id, onDismiss]);

  useEffect(() => {
    if (duration <= 0) return;
    timerRef.current = setTimeout(dismiss, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, dismiss]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-xl
        shadow-lg shadow-black/30 pointer-events-auto max-w-sm w-full
        ${config.borderColor} ${config.bgGradient}
        ${exiting ? "animate-toast-out" : "animate-toast-in"}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
          <Icon className={`h-4 w-4 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{item.title}</p>
          {item.message && (
            <p className="mt-0.5 text-xs leading-relaxed text-gray-400">{item.message}</p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={dismiss}
          className="shrink-0 rounded-md p-1 text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {duration > 0 && (
        <div className="h-0.5 w-full bg-white/5">
          <div
            className={`h-full ${config.progressColor} opacity-60`}
            style={{
              animation: `notification-shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes notification-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notification container (portal at top-right)
// ---------------------------------------------------------------------------

export function NotificationContainer({
  items,
  onDismiss,
}: {
  items: NotificationItem[];
  onDismiss: (id: string) => void;
}) {
  if (typeof document === "undefined" || items.length === 0) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-4 right-4 z-[9999] flex flex-col gap-2"
    >
      {items.map((item) => (
        <NotificationCard key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Hook: useNotification
// ---------------------------------------------------------------------------

let notificationCounter = 0;

export function useNotification() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (
      variant: NotificationVariant,
      title: string,
      message?: string,
      duration?: number,
    ) => {
      const id = `notif-${++notificationCounter}`;
      setItems((prev) => [...prev, { id, variant, title, message, duration }]);
      return id;
    },
    [],
  );

  const success = useCallback(
    (title: string, message?: string, duration?: number) =>
      notify("success", title, message, duration),
    [notify],
  );
  const error = useCallback(
    (title: string, message?: string, duration?: number) =>
      notify("error", title, message, duration),
    [notify],
  );
  const warning = useCallback(
    (title: string, message?: string, duration?: number) =>
      notify("warning", title, message, duration),
    [notify],
  );
  const info = useCallback(
    (title: string, message?: string, duration?: number) =>
      notify("info", title, message, duration),
    [notify],
  );

  return { items, dismiss, notify, success, error, warning, info };
}

// ---------------------------------------------------------------------------
// Self-contained wrapper
// ---------------------------------------------------------------------------

export function Notification() {
  const { items, dismiss } = useNotification();
  return <NotificationContainer items={items} onDismiss={dismiss} />;
}
