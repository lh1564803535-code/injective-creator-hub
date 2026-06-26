"use client";

import { useState } from "react";
import {
  Wallet,
  ChevronRight,
  CheckCircle,
  ExternalLink,
  Shield,
  Zap,
  Coins,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const steps = [
  {
    id: 1,
    title: "Connect Wallet",
    description: "Link your MetaMask or WalletConnect wallet",
    icon: Wallet,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
  },
  {
    id: 2,
    title: "Get Testnet Tokens",
    description: "Claim free INJ and USDC from the faucet",
    icon: Coins,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
  {
    id: 3,
    title: "Start Creating",
    description: "Join campaigns and earn USDC rewards",
    icon: Zap,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
];

export function WalletOnboarding() {
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(isConnected ? 2 : 1);

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent p-6">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Getting Started</h3>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted =
            (step.id === 1 && isConnected) || step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-start gap-4">
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isCompleted
                      ? "bg-emerald-500/15"
                      : isCurrent
                      ? step.bg
                      : "bg-white/[0.04]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Icon
                      className={`h-5 w-5 ${
                        isCurrent ? step.color : "text-gray-500"
                      }`}
                    />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="mt-2 h-8 w-0.5 bg-white/[0.06]" />
                )}
              </div>

              <div className="flex-1 pt-1">
                <p
                  className={`text-sm font-medium ${
                    isCompleted
                      ? "text-emerald-400"
                      : isCurrent
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {step.description}
                </p>

                {step.id === 1 && !isConnected && (
                  <div className="mt-3">
                    <ConnectButton />
                  </div>
                )}

                {step.id === 2 && isCurrent && (
                  <div className="mt-3 flex gap-2">
                    <a
                      href="https://testnet.faucet.injective.network/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/25"
                    >
                      Official Faucet
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="https://cloud.google.com/application/web3/faucet/injective/testnet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.06]"
                    >
                      Google Faucet
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {step.id === 3 && isCurrent && (
                  <div className="mt-3">
                    <a
                      href="/campaigns"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/25"
                    >
                      Browse Campaigns
                      <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
