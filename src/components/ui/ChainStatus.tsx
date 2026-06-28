"use client";
import { useBlockNumber } from 'wagmi';

export function ChainStatus() {
  const { data: blockNumber, isLoading } = useBlockNumber();

  return (
    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-emerald-300">
        Injective EVM #{isLoading ? '...' : blockNumber?.toString()}
      </span>
    </div>
  );
}
