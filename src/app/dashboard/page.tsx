"use client";

import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { shortenAddress } from "@/lib/injective";
import type { Address } from "viem";

export default function DashboardPage() {
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen bg-[#08080f] p-6 pt-22 lg:p-8 lg:pt-24">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-white">
            Creator Dashboard
          </h1>
          <p className="text-gray-400">
            {isConnected && address
              ? `Viewing dashboard for ${shortenAddress(address)}`
              : "Connect your wallet to view your submissions and earnings"}
          </p>
        </div>

        {!isConnected ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-12 text-center backdrop-blur-sm">
            <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-4 text-gray-400">
              Connect your wallet to access your dashboard
            </p>
            <ConnectButton />
          </div>
        ) : (
          <CreatorDashboard address={address as Address} />
        )}
      </div>
    </div>
  );
}
