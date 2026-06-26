"use client";

import { ReactNode } from "react";
import { Inbox, Search, FileText, Trophy, Plus, Wallet, Megaphone, Users } from "lucide-react";

interface EmptyStateProps {
  icon?: "inbox" | "search" | "file" | "trophy" | "plus" | "wallet" | "megaphone" | "users";
  title: string;
  description: string;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const ICONS = {
  inbox: Inbox,
  search: Search,
  file: FileText,
  trophy: Trophy,
  plus: Plus,
  wallet: Wallet,
  megaphone: Megaphone,
  users: Users,
};

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const Icon = ICONS[icon];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-[#0a0a0a] px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
      {action ? (
        action
      ) : onAction && actionLabel ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
