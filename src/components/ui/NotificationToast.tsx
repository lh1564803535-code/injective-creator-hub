"use client";

import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
}

interface NotificationToastProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const typeConfig = {
  success: { icon: CheckCircle, bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  error: { icon: AlertCircle, bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  info: { icon: Info, bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
};

export function NotificationToast({ toasts, onDismiss }: NotificationToastProps) {
  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type];
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-xl border ${config.border} ${config.bg} px-4 py-3 shadow-lg`}
          >
            <Icon className={`h-5 w-5 ${config.text}`} />
            <p className="text-sm text-white">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-2 text-gray-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
