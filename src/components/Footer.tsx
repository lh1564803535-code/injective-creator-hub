"use client";

import Link from "next/link";
import { Zap, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#2B3139] bg-[#0B0E11]/50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#00B894]">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#EAECEF]">Creator Hub</span>
            <span className="text-xs text-[#848E9C]">|</span>
            <span className="text-xs text-[#848E9C]">Built on Injective</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#848E9C] sm:gap-5">
            <Link href="/leaderboard" className="transition hover:text-[#EAECEF]">Leaderboard</Link>
            <Link href="/campaigns" className="transition hover:text-[#EAECEF]">Campaigns</Link>
            <Link href="/create" className="transition hover:text-[#EAECEF]">Create</Link>
            <a href="https://docs.injective.network" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 transition hover:text-[#EAECEF]">
              Docs <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://twitter.com/Injective_" target="_blank" rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2B3139] text-[#848E9C] transition hover:border-[#00D4AA]/30 hover:text-[#EAECEF]"
              aria-label="Twitter"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://discord.gg/injective" target="_blank" rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2B3139] text-[#848E9C] transition hover:border-[#00D4AA]/30 hover:text-[#EAECEF]"
              aria-label="Discord"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-[#2B3139] pt-4 text-center">
          <p className="text-xs text-[#848E9C]">
            Decentralized · On-Chain · Permissionless
          </p>
        </div>
      </div>
    </footer>
  );
}
