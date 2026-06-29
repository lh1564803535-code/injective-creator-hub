"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

interface SecurityTip {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  action?: { label: string; href: string };
}

const SECURITY_TIPS: SecurityTip[] = [
  {
    id: "seed-phrase",
    title: "Never share your seed phrase",
    description: "Your 12/24-word recovery phrase is the master key to your wallet. No legitimate service will ever ask for it.",
    severity: "critical",
  },
  {
    id: "verify-address",
    title: "Always verify addresses",
    description: "Double-check recipient addresses before sending. Malware can clipboard-swap addresses. Use ENS names when possible.",
    severity: "warning",
  },
  {
    id: "revoke-approvals",
    title: "Review token approvals",
    description: "Regularly check and revoke unused token approvals. Unlimited approvals can be exploited by malicious contracts.",
    severity: "warning",
    action: { label: "Review Approvals", href: "https://revoke.cash" },
  },
  {
    id: "test-transaction",
    title: "Test with small amounts",
    description: "When interacting with a new contract, send a small test transaction first. Gas on Injective is nearly free.",
    severity: "info",
  },
  {
    id: "phishing",
    title: "Beware of phishing sites",
    description: "Always verify you're on the correct URL. Bookmark official sites. Don't click links from DMs or emails.",
    severity: "critical",
  },
];

const severityConfig = {
  info: { bg: "bg-[#00D4AA]/10", text: "text-[#00D4AA]", border: "border-cyan-500/20", icon: Shield },
  warning: { bg: "bg-[#F0B90B]/10", text: "text-[#F0B90B]", border: "border-amber-500/20", icon: AlertTriangle },
  critical: { bg: "bg-[#F6465D]/10", text: "text-[#F6465D]", border: "border-red-500/20", icon: AlertTriangle },
};

export function SecurityTips() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleTips = SECURITY_TIPS.filter((t) => !dismissed.has(t.id));

  useEffect(() => {
    if (current >= visibleTips.length) {
      setCurrent(Math.max(0, visibleTips.length - 1));
    }
  }, [visibleTips.length, current]);

  if (visibleTips.length === 0) return null;

  const tip = visibleTips[current];
  const config = severityConfig[tip.severity];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.text}`} />
          <div>
            <p className="text-sm font-medium text-[#EAECEF]">{tip.title}</p>
            <p className="mt-0.5 text-xs text-[#848E9C]">{tip.description}</p>
            {tip.action && (
              <a
                href={tip.action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-flex items-center gap-1 text-xs ${config.text} hover:underline`}
              >
                {tip.action.label}
                <ChevronRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => setDismissed((prev) => new Set([...prev, tip.id]))}
          className="shrink-0 text-[#848E9C] hover:text-[#EAECEF]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {visibleTips.length > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setCurrent((c) => (c - 1 + visibleTips.length) % visibleTips.length)}
            className="text-[#848E9C] hover:text-[#EAECEF]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1">
            {visibleTips.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === current ? config.text.replace("text-", "bg-") : "bg-[#EAECEF]/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrent((c) => (c + 1) % visibleTips.length)}
            className="text-[#848E9C] hover:text-[#EAECEF]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
