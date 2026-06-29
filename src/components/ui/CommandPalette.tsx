"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  Trophy,
  Plus,
  LayoutDashboard,
  Compass,
  ArrowRight,
  Zap,
  FileText,
  Users,
  Clock,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { formatUSDC, getTimeRemaining, getCampaignStatus } from "@/lib/injective";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: typeof Home;
  color: string;
  action: () => void;
  category: string;
  shortcut?: string;
  meta?: string;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

import { createContext, useContext } from "react";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((p) => !p), []);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      <CommandPaletteInner />
    </CommandPaletteContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Inner Component
// ---------------------------------------------------------------------------

function CommandPaletteInner() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build command items
  const allItems = useMemo<CommandItem[]>(() => {
    const navigate = (href: string) => {
      router.push(href);
      setOpen(false);
    };

    const navItems: CommandItem[] = [
      { id: "nav-home", label: "Home", icon: Home, color: "text-[#00D4AA]", action: () => navigate("/"), category: "Navigation" },
      { id: "nav-campaigns", label: "Explore Campaigns", icon: Compass, color: "text-purple-400", action: () => navigate("/campaigns"), category: "Navigation", shortcut: "G C" },
      { id: "nav-leaderboard", label: "Leaderboard", icon: Trophy, color: "text-[#F0B90B]", action: () => navigate("/leaderboard"), category: "Navigation", shortcut: "G L" },
      { id: "nav-create", label: "Create Campaign", icon: Plus, color: "text-[#00D4AA]", action: () => navigate("/create"), category: "Navigation", shortcut: "G N" },
      { id: "nav-dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-400", action: () => navigate("/dashboard"), category: "Navigation", shortcut: "G D" },
    ];

    const campaignItems: CommandItem[] = MOCK_CAMPAIGNS.map((c) => {
      const status = getCampaignStatus(c.deadline, c.settled);
      const statusLabel = status === "active" ? "Live" : status === "voting" ? "Voting" : "Ended";
      return {
        id: `campaign-${c.id}`,
        label: c.title,
        description: c.description.slice(0, 80) + "...",
        icon: FileText,
        color: status === "active" ? "text-[#00D4AA]" : status === "voting" ? "text-[#F0B90B]" : "text-[#848E9C]",
        action: () => navigate(`/campaign/${c.id}`),
        category: "Campaigns",
        meta: `${formatUSDC(c.totalReward)} USDC  ·  ${statusLabel}  ·  ${getTimeRemaining(c.deadline)}`,
      };
    });

    const actionItems: CommandItem[] = [
      { id: "action-create", label: "Create New Campaign", description: "Launch a new bounty campaign", icon: Plus, color: "text-[#00D4AA]", action: () => navigate("/create"), category: "Quick Actions" },
      { id: "action-dashboard", label: "View My Dashboard", description: "Check earnings, submissions, and stats", icon: LayoutDashboard, color: "text-blue-400", action: () => navigate("/dashboard"), category: "Quick Actions" },
      { id: "action-ranks", label: "View Creator Rankings", description: "See top earning creators", icon: Users, color: "text-[#F0B90B]", action: () => navigate("/leaderboard"), category: "Quick Actions" },
    ];

    return [...navItems, ...campaignItems, ...actionItems];
  }, [router, setOpen]);

  // Filter items
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.meta?.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filtered]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset activeIndex when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIndex]) {
          filtered[activeIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    },
    [filtered, activeIndex, setOpen]
  );

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  // Flatten grouped for index mapping
  const flatItems: CommandItem[] = [];
  for (const items of Object.values(grouped)) {
    flatItems.push(...items);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-cmd-backdrop-in"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Palette */}
      <div className="fixed left-1/2 top-[15%] z-[101] w-full max-w-xl -translate-x-1/2 animate-cmd-palette-in">
        <div className="overflow-hidden rounded-xl border border-[#2B3139] bg-[#141418]/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-[#2B3139] px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-[#848E9C]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search campaigns, navigate, or take action..."
              className="flex-1 bg-transparent text-sm text-[#EAECEF] placeholder-[#848E9C] outline-none"
              aria-label="Command palette search"
              role="combobox"
              aria-expanded="true"
              aria-autocomplete="list"
            />
            <kbd className="hidden shrink-0 rounded border border-[#2B3139] bg-[#2B3139] px-1.5 py-0.5 text-[10px] text-[#848E9C] sm:inline">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide"
            role="listbox"
          >
            {flatItems.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <Search className="h-8 w-8 text-[#848E9C]" />
                <p className="text-sm text-[#848E9C]">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-[#848E9C]">Try searching for campaigns, pages, or actions</p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <div className="px-3 py-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#848E9C]">
                      {category}
                    </span>
                  </div>
                  {items.map((item) => {
                    const globalIndex = flatItems.indexOf(item);
                    const isActive = globalIndex === activeIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        data-index={globalIndex}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                          isActive
                            ? "bg-[#2B3139] text-[#EAECEF]"
                            : "text-[#848E9C] hover:bg-[#1E2329]"
                        }`}
                        role="option"
                        aria-selected={isActive}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isActive ? "bg-[#2B3139]" : "bg-[#1E2329]"
                        }`}>
                          <Icon className={`h-4 w-4 ${isActive ? item.color : "text-[#848E9C]"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-medium ${isActive ? "text-[#EAECEF]" : "text-[#EAECEF]"}`}>
                            {item.label}
                          </p>
                          {(item.description || item.meta) && (
                            <p className="truncate text-xs text-[#848E9C]">
                              {item.meta || item.description}
                            </p>
                          )}
                        </div>
                        {item.shortcut && (
                          <kbd className="hidden shrink-0 rounded border border-[#2B3139] bg-[#1E2329] px-1.5 py-0.5 text-[10px] text-[#848E9C] sm:inline">
                            {item.shortcut}
                          </kbd>
                        )}
                        {isActive && (
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#848E9C]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center gap-4 border-t border-[#2B3139] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <kbd className="flex h-5 w-5 items-center justify-center rounded border border-[#2B3139] bg-[#2B3139]">
                <ArrowUp className="h-3 w-3 text-[#848E9C]" />
              </kbd>
              <kbd className="flex h-5 w-5 items-center justify-center rounded border border-[#2B3139] bg-[#2B3139]">
                <ArrowDown className="h-3 w-3 text-[#848E9C]" />
              </kbd>
              <span className="text-[10px] text-[#848E9C]">Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="flex h-5 w-5 items-center justify-center rounded border border-[#2B3139] bg-[#2B3139]">
                <CornerDownLeft className="h-3 w-3 text-[#848E9C]" />
              </kbd>
              <span className="text-[10px] text-[#848E9C]">Select</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="rounded border border-[#2B3139] bg-[#2B3139] px-1.5 py-0.5 text-[10px] text-[#848E9C]">
                ESC
              </kbd>
              <span className="text-[10px] text-[#848E9C]">Close</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-[#00D4AA]/50" />
              <span className="text-[10px] text-[#848E9C]">Creator Hub</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
