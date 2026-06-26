"use client";

import { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

interface Chain {
  id: number;
  name: string;
  icon?: string;
  color: string;
}

interface ChainSwitcherProps {
  chains: Chain[];
  activeChainId: number;
  onSwitch: (chainId: number) => void;
  className?: string;
}

const defaultChains: Chain[] = [
  { id: 1439, name: "Injective Testnet", color: "text-cyan-400" },
  { id: 2525, name: "Injective Mainnet", color: "text-emerald-400" },
];

export function ChainSwitcher({
  chains = defaultChains,
  activeChainId,
  onSwitch,
  className = "",
}: ChainSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeChain = chains.find((c) => c.id === activeChainId);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm transition hover:bg-white/[0.04]"
      >
        <Globe className={`h-4 w-4 ${activeChain?.color || "text-gray-400"}`} />
        <span className="text-white">{activeChain?.name || "Select Chain"}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-white/[0.08] bg-[#1a1a1a] py-1 shadow-lg">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => {
                onSwitch(chain.id);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-white/[0.04] ${
                chain.id === activeChainId ? "text-white" : "text-gray-400"
              }`}
            >
              <Globe className={`h-4 w-4 ${chain.color}`} />
              <span className="flex-1">{chain.name}</span>
              {chain.id === activeChainId && (
                <Check className="h-4 w-4 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
