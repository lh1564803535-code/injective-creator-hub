"use client";

import { useState, useCallback, useEffect } from "react";
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

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // ms, default 3000
}

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

const variantConfig: Record<
  NotificationType,
  { icon: typeof Check; borderColor: string; bgColor: string; iconColor: string; barColor: string }
> = {
  success: {
    icon: Check,
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    barColor: "bg-emerald-400",
  },
  error: {
    icon: AlertCircle,
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/10",
    iconColor: "text-red-400",
    barColor: "bg-red-400",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    iconColor: "text-amber-400",
    barColor: "bg-amber-400",
  },
  info: {
    icon: Info,
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-400",
    barColor: "bg-blue-400",
  },
};

// ---------------------------------------------------------------------------
// Single notification item
// ---------------------------------------------------------------------------

let counter = 0;

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const config = variantConfig[notification.type];
  const Icon = config.icon;
  const duration = notification.duration ?? 3000;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onDismiss(notification.id), duration);
    return () => clearTimeout(timer);
  }, [notification.id, duration, onDismiss]);

  return (
    <div
      className={`animate-toast-in flex items-start gap-3 rounded-xl border ${config.borderColor} ${config.bgColor} p-4 backdrop-blur-xl shadow-lg shadow-black/20 pointer-events-auto max-w-sm w-full`}
      role="alert"
    >
      <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{notification.title}</p>
        {notification.message && (
          <p className="mt-0.5 text-xs text-gray-400">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="shrink-0 text-gray-500 transition hover:text-gray-300"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notification container (renders via portal at top-right)
// ---------------------------------------------------------------------------

export function NotificationContainer({
  notifications,
  onDismiss,
}: {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-4 right-4 z-[9999] flex flex-col gap-2"
    >
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Hook: useNotificationToast
// ---------------------------------------------------------------------------

export function useNotificationToast() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (type: NotificationType, title: string, message?: string, duration?: number) => {
      const id = `notification-${++counter}`;
      setNotifications((prev) => [...prev, { id, type, title, message, duration }]);
      return id;
    },
    [],
  );

  const success = useCallback(
    (title: string, message?: string) => notify("success", title, message),
    [notify],
  );
  const error = useCallback(
    (title: string, message?: string) => notify("error", title, message),
    [notify],
  );
  const warning = useCallback(
    (title: string, message?: string) => notify("warning", title, message),
    [notify],
  );
  const info = useCallback(
    (title: string, message?: string) => notify("info", title, message),
    [notify],
  );

  return { notifications, dismiss, notify, success, error, warning, info };
}

// ---------------------------------------------------------------------------
// Self-contained wrapper component
// ---------------------------------------------------------------------------

export function NotificationToast() {
  const { notifications, dismiss } = useNotificationToast();

  return <NotificationContainer notifications={notifications} onDismiss={dismiss} />;
}
