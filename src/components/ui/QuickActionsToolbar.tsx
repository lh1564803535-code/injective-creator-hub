"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import {
  Plus,
  Search,
  LayoutDashboard,
  Trophy,
  ArrowUp,
  Wallet,
  ChevronUp,
  ChevronDown,
  Zap,
  Command,
} from "lucide-react";
import { shortenAddress } from "@/lib/injective";
import { useCommandPalette } from "@/components/ui/CommandPalette";

interface QuickAction {
  icon: typeof Plus;
  label: string;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
  shortcut?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: Plus,
    label: "Create",
    href: "/create",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    icon: Search,
    label: "Explore",
    href: "/campaigns",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    shortcut: "/",
  },
  {
    icon: Trophy,
    label: "Ranks",
    href: "/leaderboard",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

export function QuickActionsToolbar() {
  const pathname = usePathname();
  const { isConnected, address } = useAccount();
  const { toggle: toggleCommandPalette } = useCommandPalette();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track scroll position to show/hide toolbar
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
      setShowScrollTop(scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-24 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#1a1a1a]/90 text-gray-400 shadow-lg backdrop-blur-md transition-all hover:border-cyan-500/30 hover:text-cyan-400 hover:shadow-cyan-500/10 hover:scale-110 active:scale-95 animate-fade-in-up"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {/* Main toolbar */}
      <div
        className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-[#141418]/95 px-2 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl sm:gap-1.5 sm:px-3">
          {/* Wallet status pill */}
          {isConnected && address && (
            <div className="mr-1 hidden items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-400">
                {shortenAddress(address)}
              </span>
            </div>
          )}

          {/* Quick action buttons */}
          {QUICK_ACTIONS.map((action) => {
            const isActive = pathname === action.href;
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className={`group relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all sm:px-4 ${
                  isActive
                    ? `${action.bgColor} ${action.borderColor} border`
                    : "border border-transparent hover:bg-white/[0.04]"
                }`}
                title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ""}`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? action.color : "text-gray-500 group-hover:text-gray-300"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? action.color : "text-gray-600 group-hover:text-gray-400"
                  }`}
                >
                  {action.label}
                </span>
                {/* Active indicator dot */}
                {isActive && (
                  <span
                    className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${action.color.replace("text-", "bg-")}`}
                  />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="mx-1 h-8 w-px bg-white/[0.06]" />

          {/* Command Palette button */}
          <button
            onClick={toggleCommandPalette}
            className="group flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all hover:bg-white/[0.04]"
            aria-label="Open command palette"
            title="Search & Navigate (Ctrl+K)"
          >
            <div className="flex items-center gap-1">
              <Command className="h-3.5 w-3.5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              <Search className="h-3.5 w-3.5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-[10px] text-gray-600 group-hover:text-cyan-400 transition-colors">
              Search
            </span>
          </button>

          {/* Expand toggle (shows more info on desktop) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all hover:bg-white/[0.04]"
            aria-label={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-[10px] text-gray-600">
              {isExpanded ? "Less" : "More"}
            </span>
          </button>
        </div>

        {/* Expanded panel */}
        {isExpanded && (
          <div className="mt-2 animate-fade-in-up rounded-2xl border border-white/[0.08] bg-[#141418]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Wallet info */}
              <div className="col-span-2 sm:col-span-4">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Wallet className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Wallet</p>
                      <p className="text-sm font-medium text-white">
                        {isConnected && address
                          ? shortenAddress(address)
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {isConnected && (
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400">Injective EVM</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              {isConnected && (
                <>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <p className="text-xs text-gray-500">Active</p>
                    <p className="text-lg font-bold text-cyan-400">4</p>
                    <p className="text-[10px] text-gray-600">campaigns</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-lg font-bold text-amber-400">2</p>
                    <p className="text-[10px] text-gray-600">submissions</p>
                  </div>
                </>
              )}

              {/* Keyboard shortcuts hint */}
              <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 ${isConnected ? "col-span-2" : "col-span-2 sm:col-span-4"}`}>
                <p className="mb-2 text-xs font-medium text-gray-400">Shortcuts</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Search campaigns</span>
                    <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-gray-400">/</kbd>
                  </div>
                  <button
                    onClick={toggleCommandPalette}
                    className="flex w-full items-center justify-between"
                  >
                    <span className="text-xs text-gray-500">Command palette</span>
                    <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-gray-400">Ctrl+K</kbd>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
