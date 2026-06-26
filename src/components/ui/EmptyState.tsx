"use client";

import { ReactNode } from "react";
import { Inbox, Search, FileText, Trophy } from "lucide-react";

interface EmptyStateProps {
  icon?: "inbox" | "search" | "file" | "trophy";
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

const ICONS = {
  inbox: Inbox,
  search: Search,
  file: FileText,
  trophy: Trophy,
};

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const Icon = ICONS[icon];

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-12 text-center ${className}`}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
      {action}
    </div>
  );
}
