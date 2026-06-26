"use client";

import { Users, Wallet } from "lucide-react";

interface CreatorEmptyProps {
  onConnectWallet?: () => void;
}

export function CreatorEmpty({ onConnectWallet }: CreatorEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Users className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">No creators yet</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">
        The leaderboard is empty. Connect your wallet and start creating to appear on the rankings.
      </p>
      {onConnectWallet && (
        <button
          onClick={onConnectWallet}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Wallet className="h-4 w-4" />
          Connect wallet
        </button>
      )}
    </div>
  );
}
