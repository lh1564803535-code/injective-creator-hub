"use client";

import { useState } from "react";
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
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import { MOCK_CAMPAIGNS, MOCK_SUBMISSIONS, MOCK_CREATORS } from "@/lib/mock-data";
import { SettleDialog } from "@/components/campaign/SettleDialog";
import { VoteDialog } from "@/components/campaign/VoteDialog";
import { CreatorProfile } from "@/components/creator/CreatorProfile";
import { CampaignStats } from "@/components/campaign/CampaignStats";
import type { SubmissionData } from "@/lib/injective";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = Number(params.id);
  const { isConnected } = useAccount();

  const [contentURI, setContentURI] = useState("");
  const [step, setStep] = useState<"idle" | "submitting">("idle");

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
    setTimeout(() => {
      setStep("idle");
      setContentURI("");
    }, 2000);
  };

  const handleOpenVote = (sub: SubmissionData) => {
    setVoteTarget(sub);
    setVoteOpen(true);
  };

  const handleVoteComplete = (_submissionId: number, _weight: number) => {
    // In a real app this would call the contract
  };

  if (!campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08080f]">
        <div className="text-center">
          <p className="mb-4 text-xl text-white">Campaign not found</p>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">
            Back to Hub
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
          <ArrowLeft className="h-4 w-4" /> Back to Hub
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
              {isActive ? "Live" : isVoting ? "Voting" : "Ended"}
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
            <p className="mb-1 text-xs text-gray-600 uppercase tracking-wider">Sponsored by</p>
            <CreatorProfile
              address={campaign.sponsor}
              variant="compact"
            />
          </div>

          {/* Settle button */}
          {isVoting && (
            <button
              onClick={() => setSettleOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Award className="h-4 w-4" />
              Settle & Distribute Rewards
            </button>
          )}
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
              Submit Your Content
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="url"
                value={contentURI}
                onChange={(e) => setContentURI(e.target.value)}
                placeholder="Enter content URL (e.g., https://x.com/...)"
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
                Submit
              </button>
            </form>
          </div>
        )}

        {/* Submissions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Submissions ({submissions.length})
          </h2>

          <div className="space-y-4">
            {submissions
              .sort((a, b) => b.votes - a.votes)
              .map((sub, i) => {
                const creatorStats = getCreatorStats(sub.creator);
                return (
                  <div
                    key={sub.id}
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:translate-y-[-2px] hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
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
                          View Content
                        </a>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{sub.votes}</p>
                          <p className="text-xs text-gray-500">votes</p>
                        </div>

                        {isVoting && isConnected && (
                          <button
                            onClick={() => handleOpenVote(sub)}
                            className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 hover:scale-[1.03] active:scale-[0.97]"
                          >
                            <Vote className="h-3.5 w-3.5" />
                            Vote
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
              })}
          </div>
        </div>

        {/* Connect wallet CTA */}
        {!isConnected && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
            <p className="mb-4 text-gray-400">
              Connect your wallet to vote or submit content
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
