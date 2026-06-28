"use client";

import { useState, useRef, useEffect } from "react";
import {useTranslations} from 'next-intl';
import {Link, usePathname, useRouter} from '@/i18n/navigation';
import {useLocale} from 'next-intl';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap, Menu, X, Globe, ChevronDown } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationCenter";
import { ChainStatus } from "@/components/ui/ChainStatus";

const localeLabels: Record<string, {label: string; flag: string}> = {
  en: {label: "English", flag: "🇺🇸"},
  zh: {label: "中文", flag: "🇨🇳"},
};

export function AppNavigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: t('home'), href: "/" },
    { label: t('campaigns'), href: "/campaigns" },
    { label: t('leaderboard'), href: "/leaderboard" },
    { label: t('create'), href: "/create" },
    { label: t('dashboard'), href: "/dashboard" },
  ];

  // Close language dropdown on outside click
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
    // Save preference
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
    router.replace(pathname, {locale: newLocale});
    setLangOpen(false);
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-9 z-50 transition-all ${
          isHome
            ? "bg-transparent"
            : "border-b border-white/[0.06] bg-[#08080f]/95"
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
            {/* Chain Status — desktop only */}
            <div className="hidden md:block">
              <ChainStatus />
            </div>

            {/* Language Switcher Dropdown */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
                aria-label="Switch language"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{localeLabels[locale]?.flag} {localeLabels[locale]?.label}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-white/[0.08] bg-[#13131b] shadow-xl shadow-black/40">
                  {Object.entries(localeLabels).map(([code, {label, flag}]) => (
                    <button
                      key={code}
                      onClick={() => switchLocale(code)}
                      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition ${
                        code === locale
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span className="text-base">{flag}</span>
                      <span>{label}</span>
                      {code === locale && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

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

            {/* Mobile Language Switcher */}
            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-gray-600">Language</p>
              <div className="flex flex-col gap-1">
                {Object.entries(localeLabels).map(([code, {label, flag}]) => (
                  <button
                    key={code}
                    onClick={() => {
                      switchLocale(code);
                      setMobileOpen(false);
                    }}
                    className={`flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm transition ${
                      code === locale
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <span>{flag}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-4">
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
