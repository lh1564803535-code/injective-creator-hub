"use client";

import { useState } from "react";
import { AlertTriangle, ExternalLink, X } from "lucide-react";

export function TestnetBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] border-b border-amber-500/20 bg-amber-500/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <p className="text-xs text-amber-400">
            <span className="font-medium">Testnet Mode</span>
            {" — "}
            You are using Injective EVM Testnet (Chain ID 1439).
            Get testnet tokens from the{" "}
            <a
              href="https://testnet.faucet.injective.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-300"
            >
              faucet
              <ExternalLink className="ml-0.5 inline h-3 w-3" />
            </a>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:text-amber-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
