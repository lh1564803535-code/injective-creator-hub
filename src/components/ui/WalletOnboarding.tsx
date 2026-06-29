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
    color: "text-[#00D4AA]",
    bg: "bg-[#00D4AA]/15",
  },
  {
    id: 2,
    title: "Get Testnet Tokens",
    description: "Claim free INJ and USDC from the faucet",
    icon: Coins,
    color: "text-[#F0B90B]",
    bg: "bg-[#F0B90B]/15",
  },
  {
    id: 3,
    title: "Start Creating",
    description: "Join campaigns and earn USDC rewards",
    icon: Zap,
    color: "text-[#00D4AA]",
    bg: "bg-[#00D4AA]/15",
  },
];

export function WalletOnboarding() {
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(isConnected ? 2 : 1);

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent p-6">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-[#00D4AA]" />
        <h3 className="text-lg font-semibold text-[#EAECEF]">Getting Started</h3>
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
                      ? "bg-[#00D4AA]/15"
                      : isCurrent
                      ? step.bg
                      : "bg-[#2B3139]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-[#00D4AA]" />
                  ) : (
                    <Icon
                      className={`h-5 w-5 ${
                        isCurrent ? step.color : "text-[#848E9C]"
                      }`}
                    />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="mt-2 h-8 w-0.5 bg-[#2B3139]" />
                )}
              </div>

              <div className="flex-1 pt-1">
                <p
                  className={`text-sm font-medium ${
                    isCompleted
                      ? "text-[#00D4AA]"
                      : isCurrent
                      ? "text-[#EAECEF]"
                      : "text-[#848E9C]"
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-[#848E9C]">
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
                      className="flex items-center gap-1 rounded-lg bg-[#F0B90B]/15 px-3 py-1.5 text-xs font-medium text-[#F0B90B] transition hover:bg-[#F0B90B]/25"
                    >
                      Official Faucet
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="https://cloud.google.com/application/web3/faucet/injective/testnet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-[#2B3139] px-3 py-1.5 text-xs text-[#848E9C] transition hover:bg-[#2B3139]"
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
                      className="inline-flex items-center gap-1 rounded-lg bg-[#00D4AA]/15 px-3 py-1.5 text-xs font-medium text-[#00D4AA] transition hover:bg-[#00D4AA]/25"
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
