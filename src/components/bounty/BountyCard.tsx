"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Clock, Users, Trophy, User } from "lucide-react";
import { getTimeRemaining, shortenAddress } from "@/lib/injective";

interface BountyCardProps {
  id: number;
  title: string;
  description: string;
  totalReward: number;
  deadline: number;
  submissionCount: number;
  settled: boolean;
  sponsor?: string;
}

export function BountyCard({
  id,
  title,
  description,
  totalReward,
  deadline,
  submissionCount,
  settled,
  sponsor,
}: BountyCardProps) {
  const t = useTranslations("home");
  const now = Math.floor(Date.now() / 1000);

  const getStatus = () => {
    if (settled) return { text: t("ended"), color: "bg-[#848E9C]/15 text-[#848E9C]" };
    if (deadline < now) return { text: t("voting"), color: "bg-[#F0B90B]/15 text-[#F0B90B]" };
    return { text: t("active"), color: "bg-[#00D4AA]/15 text-[#00D4AA]" };
  };

  const status = getStatus();

  return (
    <Link
      href={`/campaign/${id}`}
      className="group block rounded-xl border border-[#2B3139] bg-[#1E2329] p-5 transition-all hover:border-[#00D4AA]/20 hover:bg-[#2B3139]/50 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {status.text}
        </span>
        <span className="rounded-full bg-[#2B3139] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#848E9C]">
          Demo
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-semibold text-[#EAECEF] line-clamp-1 transition group-hover:text-[#00D4AA]">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-4 text-sm text-[#848E9C] line-clamp-2">{description}</p>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-[#F0B90B]" />
          <span className="font-mono font-semibold text-[#F0B90B]">{totalReward} USDC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#848E9C]" />
          <span className="text-[#848E9C]">{getTimeRemaining(deadline)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-[#848E9C]" />
          <span className="text-[#848E9C]">{submissionCount} {t("submissions")}</span>
        </div>
        {sponsor && (
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-[#848E9C]" />
            <span className="font-mono text-xs text-[#848E9C]">{shortenAddress(sponsor)}</span>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="mt-4 h-0.5 w-full rounded-full bg-gradient-to-r from-[#00D4AA]/0 via-[#00D4AA]/20 to-[#00D4AA]/0 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
