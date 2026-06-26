"use client";

import { Twitter, Github, MessageCircle, Globe } from "lucide-react";

const SOCIALS = [
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com/Injective_",
    color: "hover:text-cyan-400",
  },
  {
    name: "Discord",
    icon: MessageCircle,
    href: "https://discord.gg/injective",
    color: "hover:text-purple-400",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/InjectiveLabs",
    color: "hover:text-gray-300",
  },
  {
    name: "Website",
    icon: Globe,
    href: "https://injective.com",
    color: "hover:text-emerald-400",
  },
];

export function SocialLinks({ variant = "horizontal" }: { variant?: "horizontal" | "vertical" }) {
  if (variant === "vertical") {
    return (
      <div className="flex flex-col gap-3">
        {SOCIALS.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-sm text-gray-500 transition ${social.color}`}
            >
              <Icon className="h-4 w-4" />
              {social.name}
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-gray-500 transition hover:bg-white/[0.04] ${social.color}`}
            aria-label={social.name}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
