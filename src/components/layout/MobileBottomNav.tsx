"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Compass, Trophy, PlusCircle, User } from "lucide-react";

export function MobileBottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    { icon: Compass, label: t("home"), href: "/" },
    { icon: Trophy, label: t("leaderboard"), href: "/leaderboard" },
    { icon: PlusCircle, label: t("create"), href: "/create" },
    { icon: User, label: t("dashboard"), href: "/dashboard" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#2B3139] bg-[#0B0E11]/95 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition ${
                active ? "text-[#00D4AA]" : "text-[#848E9C]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
