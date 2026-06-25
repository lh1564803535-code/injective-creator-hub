"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap } from "lucide-react";

export function AppNavigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all ${
        isHome
          ? "bg-transparent"
          : "border-b border-white/[0.06] bg-[#08080f]/80 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-white">
            Creator Hub
          </span>
        </Link>

        {/* Center nav — only show on inner pages */}
        {!isHome && (
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: "Home", href: "/" },
              { label: "Leaderboard", href: "/leaderboard" },
            ].map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-white/[0.06] text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Wallet */}
        <ConnectButton
          chainStatus="none"
          showBalance={false}
          accountStatus="avatar"
        />
      </div>
    </header>
  );
}
