"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap, Menu, X, Globe, ChevronDown, Search } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationCenter";
import { XLoginButton } from "@/components/ui/XLoginButton";

const localeLabels: Record<string, { label: string; flag: string }> = {
  zh: { label: "中文", flag: "🇨🇳" },
  en: { label: "English", flag: "🇺🇸" },
};

export function TopNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("leaderboard"), href: "/leaderboard" },
    { label: t("create"), href: "/create" },
    { label: t("dashboard"), href: "/dashboard" },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (newLocale: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#2B3139] bg-[#0B0E11]/95 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 lg:pl-64">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#00B894]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-[#EAECEF]">Creator Hub</span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#848E9C]" />
              <input
                type="text"
                placeholder="搜索活动..."
                className="h-9 w-80 rounded-lg border border-[#2B3139] bg-[#1E2329] pl-10 pr-4 text-sm text-[#EAECEF] placeholder:text-[#848E9C] focus:border-[#00D4AA]/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-[#2B3139] bg-[#1E2329] px-3 py-1.5 text-xs text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF]"
                aria-label="Switch language"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>
                  {localeLabels[locale]?.flag} {localeLabels[locale]?.label}
                </span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${langOpen ? "rotate-180" : ""}`}
                />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-[#2B3139] bg-[#1E2329] shadow-xl shadow-black/40">
                  {Object.entries(localeLabels).map(
                    ([code, { label, flag }]) => (
                      <button
                        key={code}
                        onClick={() => switchLocale(code)}
                        className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition ${
                          code === locale
                            ? "bg-[#00D4AA]/10 text-[#00D4AA]"
                            : "text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                        }`}
                      >
                        <span className="text-base">{flag}</span>
                        <span>{label}</span>
                        {code === locale && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#00D4AA]" />
                        )}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <NotificationBell />

            {/* X Login */}
            <div className="hidden md:block">
              <XLoginButton />
            </div>

            {/* Wallet */}
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
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF] lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="animate-slide-in-right absolute bottom-0 right-0 top-16 w-64 border-l border-[#2B3139] bg-[#0B0E11]/95 p-4 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#848E9C]" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="h-9 w-full rounded-lg border border-[#2B3139] bg-[#1E2329] pl-10 pr-4 text-sm text-[#EAECEF] placeholder:text-[#848E9C] focus:border-[#00D4AA]/30 focus:outline-none"
                />
              </div>
            </div>

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
                        ? "bg-[#00D4AA]/10 text-[#00D4AA]"
                        : "text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Language Switcher */}
            <div className="mt-4 border-t border-[#2B3139] pt-4">
              <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-[#848E9C]">
                Language
              </p>
              <div className="flex flex-col gap-1">
                {Object.entries(localeLabels).map(
                  ([code, { label, flag }]) => (
                    <button
                      key={code}
                      onClick={() => {
                        switchLocale(code);
                        setMobileOpen(false);
                      }}
                      className={`flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm transition ${
                        code === locale
                          ? "bg-[#00D4AA]/10 text-[#00D4AA]"
                          : "text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-[#2B3139] pt-4">
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
