"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, Clock, Zap, CheckCircle } from "lucide-react";

interface NetworkInfo {
  connected: boolean;
  chainId: number;
  networkName: string;
  blockNumber: number;
  blockTime: number;
  peers: number;
}

export function NetworkStatus() {
  const [network, setNetwork] = useState<NetworkInfo>({
    connected: true,
    chainId: 1439,
    networkName: "Injective EVM Testnet",
    blockNumber: 8234567,
    blockTime: 1.2,
    peers: 156,
  });

  // Simulate block number updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetwork((prev) => ({
        ...prev,
        blockNumber: prev.blockNumber + 1,
      }));
    }, 1200); // ~1.2s block time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1a] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium text-white">
          {network.connected ? (
            <Wifi className="h-4 w-4 text-emerald-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-400" />
          )}
          Network Status
        </h3>
        <div className="flex items-center gap-1">
          <span
            className={`h-2 w-2 rounded-full ${
              network.connected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
            }`}
          />
          <span className="text-xs text-gray-500">
            {network.connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Network</p>
          <p className="mt-1 text-sm font-medium text-white">{network.networkName}</p>
          <p className="text-xs text-gray-500">Chain ID: {network.chainId}</p>
        </div>

        <div className="rounded-lg bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Block</p>
          <p className="mt-1 font-mono text-sm font-medium text-cyan-400">
            #{network.blockNumber.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-500" />
            <p className="text-xs text-gray-500">{network.blockTime}s</p>
          </div>
        </div>

        <div className="rounded-lg bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Speed</p>
          <div className="mt-1 flex items-center gap-1">
            <Zap className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-medium text-amber-400">Instant</p>
          </div>
          <p className="text-xs text-gray-500">&lt; 1s finality</p>
        </div>

        <div className="rounded-lg bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Peers</p>
          <p className="mt-1 text-sm font-medium text-white">{network.peers}</p>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-400" />
            <p className="text-xs text-emerald-400">Healthy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
