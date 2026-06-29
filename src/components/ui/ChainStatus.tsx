"use client";
import { useBlockNumber } from 'wagmi';

export function ChainStatus() {
  const { data: blockNumber, isLoading } = useBlockNumber();

  return (
    <div className="flex items-center gap-2 rounded-full bg-[#00D4AA]/10 px-3 py-1.5 text-xs">
      <span className="h-2 w-2 rounded-full bg-[#00D4AA] animate-pulse" />
      <span className="text-[#00D4AA]">
        Injective EVM #{isLoading ? '...' : blockNumber?.toString()}
      </span>
    </div>
  );
}
