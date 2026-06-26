"use client";

import { useState } from "react";
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Users,
  Award,
  Vote,
  Loader2,
  Send,
  ExternalLink,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import { MOCK_CAMPAIGNS, MOCK_SUBMISSIONS, MOCK_CREATORS } from "@/lib/mock-data";
import { SettleDialog } from "@/components/campaign/SettleDialog";
import { VoteDialog } from "@/components/campaign/VoteDialog";
import { CreatorProfile } from "@/components/creator/CreatorProfile";
import { CampaignStats } from "@/components/campaign/CampaignStats";
import { CampaignTimeline } from "@/components/campaign/CampaignTimeline";
import { CampaignActivityFeed } from "@/components/campaign/CampaignActivityFeed";
import { useToast } from "@/components/ui/Toast";
import type { SubmissionData } from "@/lib/injective";

export default function CampaignDetailPage() {
  const t = useTranslations('campaign');
  const params = useParams();
  const campaignId = Number(params.id);
  const { isConnected } = useAccount();

  const [contentURI, setContentURI] = useState("");
  const [step, setStep] = useState<"idle" | "submitting">("idle");

  const { toast } = useToast();

  // Dialog state
  const [settleOpen, setSettleOpen] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  const [voteTarget, setVoteTarget] = useState<SubmissionData | null>(null);

  // Use mock data
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId) || null;
  const submissions = MOCK_SUBMISSIONS[campaignId] || [];

  const now = Math.floor(Date.now() / 1000);
  const isActive = campaign && now < campaign.deadline && !campaign.settled;
  const isVoting = campaign && now >= campaign.deadline && !campaign.settled;
  const isEnded = campaign?.settled;

  const totalVotes = submissions.reduce((sum, s) => sum + s.votes, 0);

  const timeRemaining = campaign
    ? (() => {
        const remaining = campaign.deadline - now;
        if (remaining <= 0) return "Ended";
        const days = Math.floor(remaining / 86400);
        const hours = Math.floor((remaining % 86400) / 3600);
        return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
      })()
    : "";

  // Look up mock creator data for a submission's creator address
  const getCreatorStats = (address: string) => {
    return MOCK_CREATORS.find(
      (c) => c.address.toLowerCase() === address.toLowerCase()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentURI.trim()) return;
    setStep("submitting");
    toast({
      variant: "pending",
      title: t('submitting'),
      description: t('submittingDesc'),
      duration: 0,
    });
    setTimeout(() => {
      setStep("idle");
      setContentURI("");
      toast({
        variant: "success",
        title: t('submitted'),
        description: t('submittedDesc'),
      });
    }, 2000);
  };

  const handleOpenVote = (sub: SubmissionData) => {
    setVoteTarget(sub);
    setVoteOpen(true);
  };

  const handleVoteComplete = (submissionId: number, weight: number) => {
    toast({
      variant: "success",
      title: "Vote recorded!",
      description: `You voted with ${weight}x weight`,
    });
  };

  if (!campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08080f]">
        <div className="text-center">
          <p className="mb-4 text-xl text-white">{t('campaignNotFound')}</p>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">
            {t('backToHubLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080f] p-6 pt-22 lg:p-8 lg:pt-24">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {t('backToHub')}
        </Link>

        {/* Campaign header */}
        <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-white/[0.1]">
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                isActive
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : isVoting
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                    : "border-gray-500/20 bg-gray-500/10 text-gray-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive
                    ? "bg-emerald-400"
                    : isVoting
                      ? "bg-amber-400"
                      : "bg-gray-500"
                }`}
              />
              {isActive ? t('live') : isVoting ? t('voting') : t('ended')}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              {timeRemaining}
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-white">{campaign.title}</h1>
          <p className="mb-4 text-gray-400">{campaign.description}</p>

          {/* Sponsor */}
          <div className="mb-4">
            <p className="mb-1 text-xs text-gray-600 uppercase tracking-wider">{t('sponsoredBy')}</p>
            <CreatorProfile
              address={campaign.sponsor}
              variant="compact"
            />
          </div>

          {/* Settle button */}
          {isVoting && (
            <button
              onClick={() => {
                setSettleOpen(true);
                toast({
                  variant: "info",
                  title: t('settleTitle'),
                  description: t('settleDesc'),
                });
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Award className="h-4 w-4" />
              {t('settleDistribute')}
            </button>
          )}
        </div>

        {/* Campaign Timeline */}
        <div className="mb-6">
          <CampaignTimeline
            deadline={campaign.deadline}
            settled={campaign.settled}
          />
        </div>

        {/* Campaign Stats */}
        <div className="mb-6">
          <CampaignStats
            totalReward={campaign.totalReward}
            submissionCount={campaign.submissionCount}
            totalVotes={totalVotes}
            deadline={campaign.deadline}
            settled={campaign.settled}
          />
        </div>

        {/* Submit content */}
        {isActive && isConnected && (
          <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all hover:border-white/[0.1]">
            <h2 className="mb-4 text-lg font-semibold text-white">
              {t('submitYourContent')}
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="url"
                value={contentURI}
                onChange={(e) => setContentURI(e.target.value)}
                placeholder={t('contentUrlPlaceholder')}
                disabled={step === "submitting"}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:border-cyan-500/30 focus:outline-none disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={step === "submitting" || !contentURI.trim()}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-medium text-white transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {step === "submitting" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {t('submit')}
              </button>
            </form>
          </div>
        )}

        {/* Submissions + Activity Feed side by side on large screens */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Submissions */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-white">
              {t('submissionsCount')} ({submissions.length})
            </h2>

            <div className="space-y-4">
              {submissions
                .sort((a, b) => b.votes - a.votes)
                .map((sub, i) => {
                  const creatorStats = getCreatorStats(sub.creator);
                  const isLeading = i === 0 && sub.votes > 0;
                  return (
                    <div
                      key={sub.id}
                      className={`group rounded-2xl border p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:translate-y-[-2px] hover:shadow-lg ${
                        isLeading
                          ? "border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-transparent"
                          : "border-white/[0.08] bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Leading badge */}
                          {isLeading && (
                            <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                              <Award className="h-2.5 w-2.5" />
                              {t('leading')}
                            </div>
                          )}

                          {/* Creator profile */}
                          <div className="mb-3">
                            <CreatorProfile
                              address={sub.creator}
                              totalEarnings={creatorStats?.totalEarnings}
                              totalVotes={creatorStats?.totalVotes}
                              totalSubmissions={creatorStats?.totalSubmissions}
                              variant="compact"
                            />
                          </div>

                          <a
                            href={sub.contentURI}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-cyan-400 transition hover:bg-cyan-500/10 hover:text-cyan-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {t('viewContent')}
                          </a>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">{sub.votes}</p>
                            <p className="text-xs text-gray-500">{t('votes')}</p>
                            {/* Vote share bar */}
                            {totalVotes > 0 && (
                              <div className="mt-1.5 h-1 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    isLeading
                                      ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                      : "bg-gradient-to-r from-cyan-400 to-blue-500"
                                  }`}
                                  style={{
                                    width: `${Math.max((sub.votes / totalVotes) * 100, 4)}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {isVoting && isConnected && (
                            <button
                              onClick={() => handleOpenVote(sub)}
                              className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 hover:scale-[1.03] active:scale-[0.97]"
                            >
                              <Vote className="h-3.5 w-3.5" />
                              {t('vote')}
                            </button>
                          )}

                          {sub.claimed && (
                            <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                              {t('claimed')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="lg:col-span-1">
            <CampaignActivityFeed campaignId={campaignId} />
          </div>
        </div>

        {/* Connect wallet CTA */}
        {!isConnected && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
            <p className="mb-4 text-gray-400">
              {t('connectToVote')}
            </p>
            <ConnectButton />
          </div>
        )}
      </div>

      {/* Dialogs */}
      <SettleDialog
        isOpen={settleOpen}
        onClose={() => setSettleOpen(false)}
        campaignTitle={campaign.title}
        totalReward={campaign.totalReward}
        submissions={submissions}
      />

      <VoteDialog
        isOpen={voteOpen}
        onClose={() => {
          setVoteOpen(false);
          setVoteTarget(null);
        }}
        submission={voteTarget}
        onVote={handleVoteComplete}
      />
    </div>
  );
}
