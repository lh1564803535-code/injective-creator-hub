"use client";

import { useState, useEffect } from "react";
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
import { SettleDialog } from "@/components/campaign/SettleDialog";
import { VoteDialog } from "@/components/campaign/VoteDialog";
import { CreatorProfile } from "@/components/creator/CreatorProfile";
import { CampaignStats } from "@/components/campaign/CampaignStats";
import { CampaignTimeline } from "@/components/campaign/CampaignTimeline";
import { CampaignActivityFeed } from "@/components/campaign/CampaignActivityFeed";
import { useToast } from "@/components/ui/Toast";
import {
  useCampaign,
  useCampaignSubmissionIds,
  useSubmission,
  useSubmitContent,
  useVote,
  useSettle,
  useClaimReward,
  formatUSDC as formatUSDCContract,
} from "@/hooks/useBounty";
import type { SubmissionData } from "@/hooks/useBounty";

export default function CampaignDetailPage() {
  const t = useTranslations('campaign');
  const params = useParams();
  const campaignId = Number(params.id);
  const { isConnected, address } = useAccount();

  const [contentURI, setContentURI] = useState("");
  const { toast } = useToast();

  // Dialog state
  const [settleOpen, setSettleOpen] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  const [voteTarget, setVoteTarget] = useState<SubmissionData | null>(null);

  // Real contract data
  const { data: campaignData, isLoading: campaignLoading, refetch: refetchCampaign } = useCampaign(campaignId);
  const { data: submissionIds, refetch: refetchSubmissions } = useCampaignSubmissionIds(campaignId);

  // Contract write hooks
  const { submit, isPending: isSubmitting, isConfirming: isSubmitConfirming, isSuccess: isSubmitSuccess } = useSubmitContent();
  const { vote: voteFn, isPending: isVoting, isSuccess: isVoteSuccess } = useVote();
  const { settle, isPending: isSettling, isSuccess: isSettleSuccess } = useSettle();
  const { claimReward, isPending: isClaiming, isSuccess: isClaimSuccess } = useClaimReward();

  // Parse campaign data
  const campaign = campaignData ? {
    id: Number(campaignData.id),
    sponsor: campaignData.sponsor as string,
    title: campaignData.title,
    description: campaignData.description,
    totalReward: campaignData.totalReward as bigint,
    deadline: Number(campaignData.deadline),
    submissionCount: Number(campaignData.submissionCount),
    settled: campaignData.settled as boolean,
  } : null;

  const now = Math.floor(Date.now() / 1000);
  const isActive = campaign && now < campaign.deadline && !campaign.settled;
  const isVotingPhase = campaign && now >= campaign.deadline && !campaign.settled;
  const isEnded = campaign?.settled;

  const timeRemaining = campaign
    ? (() => {
        const remaining = campaign.deadline - now;
        if (remaining <= 0) return t('ended');
        const days = Math.floor(remaining / 86400);
        const hours = Math.floor((remaining % 86400) / 3600);
        return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
      })()
    : "";

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentURI.trim()) return;
    submit(campaignId, contentURI);
  };

  // Watch for submit success
  useEffect(() => {
    if (isSubmitSuccess) {
      setContentURI("");
      toast({
        variant: "success",
        title: t('submitted'),
        description: t('submittedDesc'),
      });
      refetchSubmissions();
    }
  }, [isSubmitSuccess]);

  // Handle vote
  const handleOpenVote = (sub: SubmissionData) => {
    setVoteTarget(sub);
    setVoteOpen(true);
  };

  const handleVoteComplete = (submissionId: number, weight: number) => {
    voteFn(submissionId, weight);
  };

  // Watch for vote success
  useEffect(() => {
    if (isVoteSuccess) {
      toast({
        variant: "success",
        title: "Vote recorded!",
        description: "Your vote has been submitted on-chain",
      });
      refetchSubmissions();
      setVoteOpen(false);
      setVoteTarget(null);
    }
  }, [isVoteSuccess]);

  // Handle settle
  const handleSettle = () => {
    settle(campaignId);
  };

  // Watch for settle success
  useEffect(() => {
    if (isSettleSuccess) {
      toast({
        variant: "success",
        title: "Campaign settled!",
        description: "Rewards have been distributed",
      });
      refetchCampaign();
      setSettleOpen(false);
    }
  }, [isSettleSuccess]);

  // Handle claim
  const handleClaim = (submissionId: number) => {
    claimReward(submissionId);
  };

  // Watch for claim success
  useEffect(() => {
    if (isClaimSuccess) {
      toast({
        variant: "success",
        title: "Reward claimed!",
        description: "USDC has been sent to your wallet",
      });
      refetchSubmissions();
    }
  }, [isClaimSuccess]);

  if (campaignLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08080f]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

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
                  : isVotingPhase
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                    : "border-gray-500/20 bg-gray-500/10 text-gray-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive
                    ? "bg-emerald-400"
                    : isVotingPhase
                      ? "bg-amber-400"
                      : "bg-gray-500"
                }`}
              />
              {isActive ? t('live') : isVotingPhase ? t('voting') : t('ended')}
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

          {/* Reward info */}
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-xl bg-emerald-500/10 px-4 py-2">
              <p className="text-xs text-emerald-400">Total Reward</p>
              <p className="text-lg font-bold text-emerald-300">{formatUSDCContract(campaign.totalReward)} USDC</p>
            </div>
            <div className="rounded-xl bg-cyan-500/10 px-4 py-2">
              <p className="text-xs text-cyan-400">Submissions</p>
              <p className="text-lg font-bold text-cyan-300">{campaign.submissionCount}</p>
            </div>
          </div>

          {/* Settle button */}
          {isVotingPhase && isConnected && (
            <button
              onClick={handleSettle}
              disabled={isSettling}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSettling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Award className="h-4 w-4" />
              )}
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
            totalVotes={0}
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
                disabled={isSubmitting || isSubmitConfirming}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:border-cyan-500/30 focus:outline-none disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubmitConfirming || !contentURI.trim()}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-medium text-white transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting || isSubmitConfirming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {t('submit')}
              </button>
            </form>
          </div>
        )}

        {/* Submissions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            {t('submissionsCount')} ({campaign.submissionCount})
          </h2>

          <div className="space-y-4">
            {submissionIds && submissionIds.length > 0 ? (
              submissionIds.map((id) => (
                <SubmissionCard
                  key={Number(id)}
                  submissionId={Number(id)}
                  isVotingPhase={!!isVotingPhase}
                  isConnected={isConnected}
                  onVote={handleOpenVote}
                  onClaim={handleClaim}
                  isClaiming={isClaiming}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
                <p className="text-gray-400">No submissions yet</p>
              </div>
            )}
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
        submissions={[]}
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

// Submission card component
function SubmissionCard({
  submissionId,
  isVotingPhase,
  isConnected,
  onVote,
  onClaim,
  isClaiming,
}: {
  submissionId: number;
  isVotingPhase: boolean;
  isConnected: boolean;
  onVote: (sub: SubmissionData) => void;
  onClaim: (id: number) => void;
  isClaiming: boolean;
}) {
  const { data: subData } = useSubmission(submissionId);

  if (!subData) return null;

  const sub: SubmissionData = {
    id: Number(subData.id),
    campaignId: Number(subData.campaignId),
    creator: subData.creator as `0x${string}`,
    contentURI: subData.contentURI,
    votes: Number(subData.votes),
    reward: subData.reward as bigint,
    claimed: subData.claimed as boolean,
  };

  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:translate-y-[-2px] hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3">
            <CreatorProfile
              address={sub.creator}
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
            View Content
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-white">{Number(sub.votes)}</p>
            <p className="text-xs text-gray-500">votes</p>
          </div>

          {isVotingPhase && isConnected && (
            <button
              onClick={() => onVote(sub)}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 hover:scale-[1.03] active:scale-[0.97]"
            >
              <Vote className="h-3.5 w-3.5" />
              Vote
            </button>
          )}

          {!sub.claimed && Number(sub.reward) > 0 && isConnected && (
            <button
              onClick={() => onClaim(sub.id)}
              disabled={isClaiming}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-50"
            >
              {isClaiming ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Award className="h-3.5 w-3.5" />
              )}
              Claim
            </button>
          )}

          {sub.claimed && (
            <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              Claimed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
