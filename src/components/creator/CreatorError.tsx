"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface CreatorErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function CreatorError({
  title = "Failed to load creator",
  message = "Something went wrong while loading this creator profile. Please try again.",
  onRetry,
}: CreatorErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}
