"use client";

import { useState } from "react";
import { Bell, X, Check } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
}

interface NotificationBellProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationBell({ notifications, onMarkRead, onClearAll }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/[0.08] bg-[#1a1a1a] shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <span className="text-sm font-medium text-white">Notifications</span>
            <button
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-white"
            >
              Clear all
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 border-b border-white/[0.04] px-4 py-3 ${
                    !notif.read ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{notif.title}</p>
                    <p className="text-xs text-gray-500">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => onMarkRead(notif.id)}
                      className="text-gray-500 hover:text-emerald-400"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
