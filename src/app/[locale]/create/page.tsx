"use client";

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import { ArrowLeft, Rocket } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { CreateCampaignForm } from "@/components/campaign/CreateCampaignForm";

export default function CreateCampaignPage() {
  const t = useTranslations('campaign');
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen bg-[#08080f] p-6 pt-22 lg:p-8 lg:pt-24">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {t('backToHub')}
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-white">
            {t('createCampaign')}
          </h1>
          <p className="text-gray-400">
            {t('launchBounty')}
          </p>
        </div>

        {!isConnected ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-12 text-center backdrop-blur-sm">
            <Rocket className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-4 text-gray-400">
              {t('connectToCreate')}
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
            <CreateCampaignForm sponsorAddress={address} />
          </div>
        )}
      </div>
    </div>
  );
}
