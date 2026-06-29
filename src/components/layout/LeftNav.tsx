"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Zap, Compass, Trophy, PlusCircle, User, ExternalLink } from "lucide-react";
import { ChainStatus } from "@/components/ui/ChainStatus";

export function LeftNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    { icon: Compass, label: t("home"), href: "/" },
    { icon: Trophy, label: t("leaderboard"), href: "/leaderboard" },
    { icon: PlusCircle, label: t("create"), href: "/create" },
    { icon: User, label: t("dashboard"), href: "/dashboard" },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-30 hidden w-60 border-r border-[#2B3139] bg-[#0B0E11] lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#00B894]">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-[#EAECEF]">Creator Hub</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-[#00D4AA]/10 text-[#00D4AA] font-medium"
                  : "text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Discord link */}
      <div className="px-3 pb-2">
        <a
          href="https://discord.gg/injective"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#848E9C] transition-all hover:bg-[#2B3139] hover:text-[#EAECEF]"
        >
          <ExternalLink className="h-5 w-5" />
          Discord
        </a>
      </div>

      {/* Chain status */}
      <div className="border-t border-[#2B3139] px-5 py-4">
        <ChainStatus />
      </div>
    </aside>
  );
}
