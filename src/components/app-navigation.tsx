"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap, Menu, X } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationCenter";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Create", href: "/create" },
  { label: "Dashboard", href: "/dashboard" },
];

export function AppNavigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
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

          {/* Center nav — desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-lg px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-white/[0.06] text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-[17px] left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-cyan-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NotificationBell />

            {/* Wallet — desktop */}
            <div className="hidden md:block">
              <ConnectButton
                chainStatus="none"
                showBalance={true}
                accountStatus="full"
              />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="animate-slide-in-right absolute right-0 top-16 bottom-0 w-64 border-l border-white/[0.06] bg-[#0a0a0a]/95 p-4 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-2.5 text-sm transition ${
                      active
                        ? "bg-cyan-500/10 text-cyan-300"
                        : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 border-t border-white/[0.06] pt-4">
              <ConnectButton
                chainStatus="none"
                showBalance={true}
                accountStatus="full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
