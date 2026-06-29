"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search, TrendingUp, Flame, Hash } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { useCampaignCount } from "@/hooks/useBounty";

export function RightPanel() {
  const t = useTranslations("home");
  const { data: onChainCount } = useCampaignCount();
  const contractCount = onChainCount ? Number(onChainCount) : 0;
  const totalCampaigns = contractCount > 0 ? contractCount : MOCK_CAMPAIGNS.length;

  const hotCampaigns = [...MOCK_CAMPAIGNS]
    .sort((a, b) => b.totalReward - a.totalReward)
    .slice(0, 3);

  const trendingTags = ["Injective", "DeFi", "Tweet-to-Earn", "USDC", "Web3"];

  return (
    <aside className="fixed right-0 top-16 bottom-0 z-30 hidden w-72 border-l border-[#2B3139] bg-[#0B0E11] xl:flex xl:flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#848E9C]" />
            <input
              type="text"
              placeholder="搜索..."
              className="h-9 w-full rounded-lg border border-[#2B3139] bg-[#1E2329] pl-10 pr-4 text-sm text-[#EAECEF] placeholder:text-[#848E9C] focus:border-[#00D4AA]/30 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-[#F0B90B]" />
            <h3 className="text-sm font-semibold text-[#EAECEF]">
              {t("hotCampaigns") || "热门活动"}
            </h3>
          </div>
          <div className="space-y-2">
            {hotCampaigns.length > 0 ? hotCampaigns.map((c) => (
              <Link
                key={c.id}
                href={`/campaign/${c.id}`}
                className="block rounded-lg border border-[#2B3139] bg-[#1E2329] p-3 transition-all hover:border-[#00D4AA]/20 hover:bg-[#2B3139]"
              >
                <p className="mb-1 text-sm font-medium text-[#EAECEF] line-clamp-1">{c.title}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[#F0B90B]">{c.totalReward} USDC</span>
                  <span className="text-[#848E9C]">·</span>
                  <span className="text-[#848E9C]">{c.submissionCount} submissions</span>
                </div>
              </Link>
            )) : (
              <p className="text-xs text-[#848E9C]">No campaigns yet</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#00D4AA]" />
            <h3 className="text-sm font-semibold text-[#EAECEF]">
              {t("platformStats") || "平台统计"}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-[#2B3139] bg-[#1E2329] px-3 py-2">
              <span className="text-xs text-[#848E9C]">{t("totalCampaigns") || "活动总数"}</span>
              <span className="font-mono text-sm font-semibold text-[#EAECEF]">{totalCampaigns}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#2B3139] bg-[#1E2329] px-3 py-2">
              <span className="text-xs text-[#848E9C]">{t("totalRewards") || "总奖金"}</span>
              <span className="font-mono text-sm font-semibold text-[#F0B90B]">
                {MOCK_CAMPAIGNS.reduce((s, c) => s + c.totalReward, 0)} USDC
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#2B3139] bg-[#1E2329] px-3 py-2">
              <span className="text-xs text-[#848E9C]">{t("totalSubmissions") || "提交总数"}</span>
              <span className="font-mono text-sm font-semibold text-[#EAECEF]">
                {MOCK_CAMPAIGNS.reduce((s, c) => s + c.submissionCount, 0)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Hash className="h-4 w-4 text-[#848E9C]" />
            <h3 className="text-sm font-semibold text-[#EAECEF]">{t("trending") || "Trending"}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <span
                key={tag}
                className="cursor-pointer rounded-full border border-[#2B3139] bg-[#1E2329] px-3 py-1 text-xs text-[#848E9C] transition hover:border-[#00D4AA]/20 hover:text-[#00D4AA]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Follow us */}
        <div className="mt-6 border-t border-[#2B3139] pt-5">
          <p className="mb-3 text-xs font-semibold text-[#848E9C]">🔗 关注我们</p>
          <div className="flex flex-col gap-2">
            <a href="https://twitter.com/Injective" target="_blank" rel="noopener noreferrer" className="text-xs text-[#848E9C] transition hover:text-[#00D4AA]">Twitter</a>
            <a href="https://discord.gg/injective" target="_blank" rel="noopener noreferrer" className="text-xs text-[#848E9C] transition hover:text-[#00D4AA]">Discord</a>
            <a href="https://t.me/Injective" target="_blank" rel="noopener noreferrer" className="text-xs text-[#848E9C] transition hover:text-[#00D4AA]">Telegram</a>
          </div>
        </div>
      </div>
    </aside>
  );
}
