"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, Clock, Zap, CheckCircle, Globe } from "lucide-react";

interface NetworkInfo {
  connected: boolean;
  chainId: number;
  networkName: string;
  blockNumber: number;
  blockTime: number;
  tps: number;
  totalTransactions: string;
}

export function NetworkStatus() {
  const [network, setNetwork] = useState<NetworkInfo>({
    connected: true,
    chainId: 1439,
    networkName: "Injective EVM Testnet",
    blockNumber: 8234567,
    blockTime: 0.64,
    tps: 10000,
    totalTransactions: "1.2B+",
  });

  // Simulate block number updates (0.64s block time)
  useEffect(() => {
    const interval = setInterval(() => {
      setNetwork((prev) => ({
        ...prev,
        blockNumber: prev.blockNumber + 1,
      }));
    }, 640);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium text-[#EAECEF]">
          {network.connected ? (
            <Wifi className="h-4 w-4 text-[#00D4AA]" />
          ) : (
            <WifiOff className="h-4 w-4 text-[#F6465D]" />
          )}
          Network Status
        </h3>
        <div className="flex items-center gap-1">
          <span
            className={`h-2 w-2 rounded-full ${
              network.connected ? "bg-[#00D4AA] animate-pulse" : "bg-[#F6465D]"
            }`}
          />
          <span className="text-xs text-[#848E9C]">
            {network.connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#1E2329] p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#848E9C]">Network</p>
          <p className="mt-1 text-sm font-medium text-[#EAECEF]">{network.networkName}</p>
          <p className="text-xs text-[#848E9C]">Chain ID: {network.chainId}</p>
        </div>

        <div className="rounded-lg bg-[#1E2329] p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#848E9C]">Block</p>
          <p className="mt-1 font-mono text-sm font-medium text-[#00D4AA]">
            #{network.blockNumber.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#848E9C]" />
            <p className="text-xs text-[#848E9C]">{network.blockTime}s block time</p>
          </div>
        </div>

        <div className="rounded-lg bg-[#1E2329] p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#848E9C]">Throughput</p>
          <div className="mt-1 flex items-center gap-1">
            <Zap className="h-4 w-4 text-[#F0B90B]" />
            <p className="text-sm font-medium text-[#F0B90B]">{network.tps.toLocaleString()} TPS</p>
          </div>
          <p className="text-xs text-[#848E9C]">{network.totalTransactions} total</p>
        </div>

        <div className="rounded-lg bg-[#1E2329] p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#848E9C]">Status</p>
          <div className="mt-1 flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-[#00D4AA]" />
            <p className="text-sm font-medium text-[#00D4AA]">Healthy</p>
          </div>
          <p className="text-xs text-[#848E9C]">All systems operational</p>
        </div>
      </div>
    </div>
  );
}
