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
} from "@/hooks/useBounty";
import type { SubmissionData } from "@/hooks/useBounty";

export default function CampaignDetailPage() {
  const t = useTranslations('campaign');
  const params = useParams();
  const rawId = params.id;
  const campaignId = Number(rawId);
  if (isNaN(campaignId) || campaignId < 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="mb-4 text-xl text-[#EAECEF]">无效的活动 ID</p>
          <Link href="/" className="text-[#00D4AA] hover:text-[#00D4AA]/80">返回中心</Link>
        </div>
      </div>
    );
  }
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
        title: "投票已记录！",
        description: "你的投票已上链",
      });
      refetchSubmissions();
      setVoteOpen(false);
      setVoteTarget(null);
    }
  }, [isVoteSuccess]);

  // Handle settle — open confirmation dialog
  const handleSettleClick = () => {
    setSettleOpen(true);
  };

  const handleSettleConfirm = () => {
    settle(campaignId);
  };

  // Watch for settle success
  useEffect(() => {
    if (isSettleSuccess) {
      toast({
        variant: "success",
        title: "活动已结算！",
        description: "奖励已分配",
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
        title: "奖励已领取！",
        description: "USDC 已发送到你的钱包",
      });
      refetchSubmissions();
    }
  }, [isClaimSuccess]);

  if (campaignLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#00D4AA]" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="mb-4 text-xl text-[#EAECEF]">{t('campaignNotFound')}</p>
          <Link href="/" className="text-[#00D4AA] hover:text-[#00D4AA]/80">
            {t('backToHubLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#848E9C] transition hover:text-[#EAECEF]"
        >
          <ArrowLeft className="h-4 w-4" /> {t('backToHub')}
        </Link>

        {/* Campaign header */}
        <div className="mb-6 rounded-xl border border-[#2B3139] bg-[#1E2329] p-6 transition-all hover:border-[#00D4AA]/20">
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                isActive
                  ? "border-[#00D4AA]/20 bg-[#00D4AA]/10 text-[#00D4AA]"
                  : isVotingPhase
                    ? "border-[#F0B90B]/20 bg-[#F0B90B]/10 text-[#F0B90B]"
                    : "border-[#848E9C]/20 bg-[#848E9C]/10 text-[#848E9C]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive
                    ? "bg-[#00D4AA]"
                    : isVotingPhase
                      ? "bg-[#F0B90B]"
                      : "bg-[#848E9C]"
                }`}
              />
              {isActive ? t('live') : isVotingPhase ? t('voting') : t('ended')}
            </span>
            <span className="flex items-center gap-1 text-sm text-[#848E9C]">
              <Clock className="h-3.5 w-3.5" />
              {timeRemaining}
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-[#EAECEF]">{campaign.title}</h1>
          <p className="mb-4 text-[#848E9C]">{campaign.description}</p>

          {/* Sponsor */}
          <div className="mb-4">
            <p className="mb-1 text-xs uppercase tracking-wider text-[#848E9C]">{t('sponsoredBy')}</p>
            <CreatorProfile
              address={campaign.sponsor}
              variant="compact"
            />
          </div>

          {/* Reward info */}
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-lg bg-[#00D4AA]/10 px-4 py-2">
              <p className="text-xs text-[#00D4AA]">总奖金</p>
              <p className="font-mono text-lg font-bold text-[#00D4AA]">{formatUSDC(campaign.totalReward)} USDC</p>
            </div>
            <div className="rounded-lg bg-[#2B3139] px-4 py-2">
              <p className="text-xs text-[#848E9C]">提交数</p>
              <p className="font-mono text-lg font-bold text-[#EAECEF]">{campaign.submissionCount}</p>
            </div>
          </div>

          {/* Settle button — only for sponsor */}
          {isVotingPhase && isConnected && address && address.toLowerCase() === campaign.sponsor.toLowerCase() && (
            <button
              onClick={handleSettleClick}
              disabled={isSettling}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F0B90B] to-[#F59E0B] px-6 py-3 font-semibold text-black shadow-lg shadow-[#F0B90B]/25 transition-all hover:shadow-xl hover:shadow-[#F0B90B]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
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
          <div className="mb-8 rounded-xl border border-[#2B3139] bg-[#1E2329] p-6 transition-all hover:border-[#00D4AA]/20">
            <h2 className="mb-4 text-lg font-semibold text-[#EAECEF]">
              {t('submitYourContent')}
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="url"
                value={contentURI}
                onChange={(e) => setContentURI(e.target.value)}
                placeholder={t('contentUrlPlaceholder')}
                disabled={isSubmitting || isSubmitConfirming}
                className="flex-1 rounded-lg border border-[#2B3139] bg-[#0B0E11] px-4 py-3 text-[#EAECEF] placeholder:text-[#848E9C] focus:border-[#00D4AA]/30 focus:outline-none disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubmitConfirming || !contentURI.trim()}
                className="flex items-center gap-2 rounded-lg bg-[#00D4AA] px-6 py-3 font-medium text-white transition-all hover:bg-[#00D4AA]/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
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

        {/* 提交数 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#EAECEF]">
            {t('submissionsCount')} ({campaign.submissionCount})
          </h2>

          <div className="space-y-3">
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
              <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-8 text-center">
                <p className="text-[#848E9C]">暂无提交</p>
              </div>
            )}
          </div>
        </div>

        {/* Connect wallet CTA */}
        {!isConnected && (
          <div className="mt-8 rounded-xl border border-[#2B3139] bg-[#1E2329] p-8 text-center">
            <p className="mb-4 text-[#848E9C]">
              {t('connectToVote')}
            </p>
            <ConnectButton />
          </div>
        )}

      {/* Dialogs */}
      <SettleDialog
        isOpen={settleOpen}
        onClose={() => setSettleOpen(false)}
        campaignTitle={campaign.title}
        totalReward={campaign.totalReward}
        submissions={submissionIds?.map((id, i) => ({
          id: Number(id),
          campaignId,
          creator: "0x0000000000000000000000000000000000000000" as `0x${string}`,
          contentURI: "",
          票: 0,
          reward: BigInt(0),
          claimed: false,
        })) ?? []}
        onSettle={handleSettleConfirm}
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
    票: Number(subData.votes),
    reward: subData.reward as bigint,
    claimed: subData.claimed as boolean,
  };

  return (
    <div className="group rounded-xl border border-[#2B3139] bg-[#1E2329] p-5 transition-all hover:border-[#00D4AA]/20 hover:bg-[#2B3139]/50 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2B3139] px-3 py-1.5 text-xs text-[#00D4AA] transition hover:bg-[#00D4AA]/10 hover:text-[#00D4AA]"
          >
            <ExternalLink className="h-3 w-3" />
            查看内容
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-lg font-bold text-[#EAECEF]">{Number(sub.votes)}</p>
            <p className="text-xs text-[#848E9C]">票</p>
          </div>

          {isVotingPhase && isConnected && (
            <button
              onClick={() => onVote(sub)}
              className="flex items-center gap-1.5 rounded-lg bg-[#00D4AA]/10 px-4 py-2 text-sm font-medium text-[#00D4AA] transition-all hover:bg-[#00D4AA]/20 hover:scale-[1.03] active:scale-[0.97]"
            >
              <投票 className="h-3.5 w-3.5" />
              投票
            </button>
          )}

          {!sub.claimed && Number(sub.reward) > 0 && isConnected && (
            <button
              onClick={() => onClaim(sub.id)}
              disabled={isClaiming}
              className="flex items-center gap-1.5 rounded-lg bg-[#00D4AA]/10 px-4 py-2 text-sm font-medium text-[#00D4AA] transition-all hover:bg-[#00D4AA]/20 disabled:opacity-50"
            >
              {isClaiming ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Award className="h-3.5 w-3.5" />
              )}
              领取
            </button>
          )}

          {sub.claimed && (
            <span className="rounded-lg bg-[#00D4AA]/10 px-3 py-1.5 text-xs font-medium text-[#00D4AA]">
              领取ed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
