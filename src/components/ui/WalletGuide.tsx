"use client";

import { useState } from "react";
import { Wallet, Shield, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from "lucide-react";

interface WalletInfo {
  name: string;
  icon: string;
  description: string;
  url: string;
}

const WALLETS: WalletInfo[] = [
  {
    name: "MetaMask",
    icon: "🦊",
    description: "The most popular browser extension wallet for Ethereum and EVM-compatible chains.",
    url: "https://metamask.io",
  },
  {
    name: "Rainbow",
    icon: "🌈",
    description: "A beautiful, easy-to-use wallet with great NFT support and DeFi integrations.",
    url: "https://rainbow.me",
  },
  {
    name: "WalletConnect",
    icon: "🔗",
    description: "An open protocol for connecting mobile wallets to dApps via QR code scanning.",
    url: "https://walletconnect.com",
  },
];

const CREATE_STEPS = [
  { step: 1, title: "Choose a wallet", description: "Pick one of the wallets listed above and install the browser extension or mobile app." },
  { step: 2, title: "Create a new wallet", description: "Open the app and select 'Create a new wallet'. Accept the terms of service." },
  { step: 3, title: "Secure your seed phrase", description: "Write down the 12-word seed phrase on paper. Never store it digitally or share it with anyone." },
  { step: 4, title: "Verify your seed phrase", description: "The wallet will ask you to confirm the seed phrase by selecting words in the correct order." },
  { step: 5, title: "Set a strong password", description: "Create a password to protect your wallet on this device. Use a unique, strong password." },
];

const IMPORT_STEPS = [
  { step: 1, title: "Open your wallet", description: "Launch the wallet extension or mobile app on your device." },
  { step: 2, title: "Select import option", description: "Choose 'Import an existing wallet' or 'I already have a wallet' from the setup screen." },
  { step: 3, title: "Enter seed phrase", description: "Type or paste your 12 or 24-word recovery phrase. Make sure the word order is correct." },
  { step: 4, title: "Set a new password", description: "Create a local password for this device. This does not replace your seed phrase." },
  { step: 5, title: "Confirm access", description: "Verify your wallet is loaded with the correct accounts and balances." },
];

const SAFETY_TIPS = [
  "Never share your seed phrase or private key with anyone.",
  "Store your seed phrase offline on paper, not in screenshots or cloud storage.",
  "Always verify URLs before connecting your wallet to a website.",
  "Use a hardware wallet for large holdings.",
  "Revoke token approvals you no longer need.",
  "Beware of phishing DMs on Discord, Telegram, and Twitter.",
];

export function WalletGuide() {
  const [showCreateSteps, setShowCreateSteps] = useState(false);
  const [showImportSteps, setShowImportSteps] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopySeedTip = (index: number) => {
    navigator.clipboard.writeText(SAFETY_TIPS[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
          <Wallet className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Wallet Guide</h3>
          <p className="text-sm text-gray-500">Get started with a crypto wallet</p>
        </div>
      </div>

      {/* Wallet List */}
      <div className="mb-6 space-y-3">
        <h4 className="text-sm font-medium text-gray-400">Recommended Wallets</h4>
        {WALLETS.map((wallet) => (
          <a
            key={wallet.name}
            href={wallet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
          >
            <span className="text-2xl">{wallet.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{wallet.name}</span>
                <ExternalLink className="h-3 w-3 text-gray-500" />
              </div>
              <p className="mt-0.5 text-xs text-gray-500 truncate">{wallet.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* How to Create */}
      <div className="mb-4">
        <button
          onClick={() => setShowCreateSteps(!showCreateSteps)}
          className="flex w-full items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.05]"
        >
          <span>How to Create a Wallet</span>
          {showCreateSteps ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        {showCreateSteps && (
          <div className="mt-3 space-y-3 pl-2">
            {CREATE_STEPS.map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How to Import */}
      <div className="mb-6">
        <button
          onClick={() => setShowImportSteps(!showImportSteps)}
          className="flex w-full items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.05]"
        >
          <span>How to Import a Wallet</span>
          {showImportSteps ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        {showImportSteps && (
          <div className="mt-3 space-y-3 pl-2">
            {IMPORT_STEPS.map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-amber-400" />
          <h4 className="text-sm font-medium text-amber-400">Security Tips</h4>
        </div>
        <ul className="space-y-2">
          {SAFETY_TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
              <span className="flex-1">{tip}</span>
              <button
                onClick={() => handleCopySeedTip(i)}
                className="shrink-0 text-gray-600 hover:text-gray-400 transition"
                title="Copy tip"
              >
                {copiedIndex === i ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
