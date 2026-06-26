"use client";

import { useState } from "react";
import {
  Wifi,
  WifiOff,
  Fuel,
  RefreshCw,
  ChevronDown,
  Check,
  AlertTriangle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NetworkType = "testnet" | "mainnet";

interface NetworkConfig {
  id: NetworkType;
  label: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

const NETWORKS: Record<NetworkType, NetworkConfig> = {
  testnet: {
    id: "testnet",
    label: "Injective EVM Testnet",
    chainId: 1439,
    rpcUrl: "https://k8s.testnet.lcd.injective.network",
    explorerUrl: "https://testnet.explorer.injective.network",
  },
  mainnet: {
    id: "mainnet",
    label: "Injective EVM Mainnet",
    chainId: 2525,
    rpcUrl: "https://k8s.global.mainnet.lcd.injective.network",
    explorerUrl: "https://explorer.injective.network",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NetworkBanner() {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>("testnet");
  const [connected, setConnected] = useState(true);
  const [gasPrice, setGasPrice] = useState("0.001");
  const [switching, setSwitching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const network = NETWORKS[currentNetwork];

  const handleSwitchNetwork = (target: NetworkType) => {
    if (target === currentNetwork) return;
    setSwitching(true);
    setDropdownOpen(false);

    // Simulate network switch
    setTimeout(() => {
      setCurrentNetwork(target);
      setGasPrice(target === "mainnet" ? "0.002" : "0.001");
      setSwitching(false);
    }, 1200);
  };

  const handleRefreshGas = () => {
    const base = currentNetwork === "mainnet" ? 0.002 : 0.001;
    const jitter = (Math.random() - 0.5) * 0.0005;
    setGasPrice((base + jitter).toFixed(4));
  };

  return (
    <div className="border-b border-white/[0.06] bg-[#111111]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2">
        {/* Left: Connection status + Network info */}
        <div className="flex items-center gap-4">
          {/* Connection indicator */}
          <div className="flex items-center gap-2">
            {connected ? (
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-red-400" />
            )}
            <span
              className={`h-2 w-2 rounded-full ${
                connected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
              }`}
            />
            <span className="text-xs text-gray-400">
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-white/[0.08]" />

          {/* Network switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs transition-colors hover:bg-white/[0.08]"
            >
              {currentNetwork === "testnet" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              )}
              <span className="font-medium text-white">{network.label}</span>
              <span className="text-gray-500">({network.chainId})</span>
              <ChevronDown
                className={`h-3 w-3 text-gray-500 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1a1a] shadow-xl">
                {(Object.keys(NETWORKS) as NetworkType[]).map((key) => {
                  const net = NETWORKS[key];
                  const isActive = key === currentNetwork;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSwitchNetwork(key)}
                      disabled={switching}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-xs transition-colors ${
                        isActive
                          ? "bg-white/[0.06] text-white"
                          : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {key === "testnet" ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      ) : (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{net.label}</p>
                        <p className="text-[10px] text-gray-500">
                          Chain ID: {net.chainId}
                        </p>
                      </div>
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Switching overlay indicator */}
          {switching && (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
              <span className="text-xs text-cyan-400">Switching...</span>
            </div>
          )}
        </div>

        {/* Right: Gas price */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5">
            <Fuel className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500">
              Gas
            </span>
            <span className="font-mono text-xs font-medium text-emerald-400">
              {gasPrice} INJ
            </span>
          </div>
          <button
            onClick={handleRefreshGas}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/[0.04] hover:text-white"
            title="Refresh gas price"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
