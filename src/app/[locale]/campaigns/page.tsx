"use client";

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import { ArrowLeft, Rocket } from "lucide-react";
import { CampaignExplorer } from "@/components/campaign/CampaignExplorer";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";

export default function CampaignsPage() {
  const t = useTranslations('campaign');

  return (
    <div className="min-h-screen bg-[#08080f] p-6 pt-22 lg:p-8 lg:pt-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {t('backToHub')}
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Rocket className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {t('campaignExplorer')}
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        {/* Explorer */}
        <CampaignExplorer campaigns={MOCK_CAMPAIGNS} showBackLink={false} />
      </div>
    </div>
  );
}
