"use client";

import Link from "next/link";
import { Zap, ExternalLink } from "lucide-react";
import { PoweredByInjective } from "@/components/ui/PoweredByInjective";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#08080f]/50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left: Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Creator Hub</span>
            <span className="text-xs text-gray-600">|</span>
            <span className="text-xs text-gray-500">Built on Injective</span>
          </div>

          {/* Center: Links */}
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link
              href="/leaderboard"
              className="transition hover:text-gray-300"
            >
              Leaderboard
            </Link>
            <Link
              href="/create"
              className="transition hover:text-gray-300"
            >
              Create Campaign
            </Link>
            <a
              href="https://injective.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition hover:text-gray-300"
            >
              Injective
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://explorer.injective.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition hover:text-gray-300"
            >
              Explorer
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Right: Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com/Injective_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition hover:border-white/[0.12] hover:text-white"
              aria-label="Twitter"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://discord.gg/injective"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition hover:border-white/[0.12] hover:text-white"
              aria-label="Discord"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
            </a>
            <a
              href="https://github.com/InjectiveLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition hover:border-white/[0.12] hover:text-white"
              aria-label="GitHub"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 border-t border-white/[0.04] pt-4 text-center">
          <PoweredByInjective variant="footer" />
          <p className="mt-2 text-xs text-gray-600">
            Decentralized · On-Chain · Permissionless
          </p>
        </div>
      </div>
    </footer>
  );
}
