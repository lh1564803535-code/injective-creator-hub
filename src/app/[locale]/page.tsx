"use client";

import { useTranslations } from "next-intl";
import { Zap, Loader2 } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { BountyCard } from "@/components/bounty/BountyCard";
import { useCampaignCount, useCampaign } from "@/hooks/useBounty";

// Skeleton loader for campaign cards
function CampaignSkeleton() {
  return (
    <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-5 animate-pulse">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-16 rounded-full bg-[#2B3139]" />
        <div className="h-4 w-10 rounded bg-[#2B3139]" />
      </div>
      <div className="mb-2 h-5 w-3/4 rounded bg-[#2B3139]" />
      <div className="mb-4 h-4 w-full rounded bg-[#2B3139]" />
      <div className="flex gap-4">
        <div className="h-4 w-20 rounded bg-[#2B3139]" />
        <div className="h-4 w-16 rounded bg-[#2B3139]" />
        <div className="h-4 w-14 rounded bg-[#2B3139]" />
      </div>
    </div>
  );
}

// Component to render a single campaign from contract
function ContractCampaign({ id }: { id: number }) {
  const { data, isLoading, error } = useCampaign(id);

  if (isLoading) return <CampaignSkeleton />;
  if (error || !data) return null;

  const c = data as any;
  return (
    <BountyCard
      id={Number(c.id)}
      title={c.title}
      description={c.description}
      totalReward={Number(c.totalReward) / 1e6}
      deadline={Number(c.deadline)}
      submissionCount={Number(c.submissionCount)}
      settled={c.settled as boolean}
      sponsor={c.sponsor as string}
    />
  );
}

export default function HomePage() {
  const t = useTranslations("home");
  const { data: campaignCount, isLoading: countLoading } = useCampaignCount();
  const count = campaignCount ? Number(campaignCount) : 0;

  // Use contract data if available, fall back to mock
  const useContract = count > 0;
  const mockCampaigns = MOCK_CAMPAIGNS.map((c: any) => ({
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
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#00D4AA]" />
          <h1 className="text-xl font-bold text-[#EAECEF]">{t("allCampaigns")}</h1>
        </div>
        <p className="mt-1 text-sm text-[#848E9C]">{t("allCampaignsDesc")}</p>
      </div>

      {countLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <CampaignSkeleton key={i} />
          ))}
        </div>
      ) : useContract ? (
        <div className="space-y-3">
          {Array.from({ length: count }, (_, i) => (
            <ContractCampaign key={i} id={i} />
          ))}
        </div>
      ) : mockCampaigns.length === 0 ? (
        <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-12 text-center">
          <p className="text-[#848E9C]">{t("noCampaigns")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockCampaigns.map((c) => (
            <BountyCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
