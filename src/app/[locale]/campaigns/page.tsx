"use client";

import { useTranslations } from "next-intl";
import { Rocket } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { BountyCard } from "@/components/bounty/BountyCard";

export default function CampaignsPage() {
  const t = useTranslations("campaign");

  const campaigns = MOCK_CAMPAIGNS.map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    totalReward: c.totalReward,
    deadline: c.deadline,
    submissionCount: c.submissionCount,
    settled: c.settled,
    sponsor: c.sponsor,
  }));

  return (
    <div className="page-enter">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00D4AA]/10 text-[#00D4AA]">
            <Rocket className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-[#EAECEF]">
            {t("campaignExplorer") || "活动探索"}
          </h1>
        </div>
        <p className="text-sm text-[#848E9C]">
          {t("subtitle") || "浏览和参与创作者赏金活动"}
        </p>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-12 text-center">
          <p className="text-[#848E9C]">暂无活动</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <BountyCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
