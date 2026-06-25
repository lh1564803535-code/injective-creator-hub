"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Users, Award, Vote, Loader2, Send, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import { MOCK_CAMPAIGNS, MOCK_SUBMISSIONS } from "@/lib/mock-data";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = Number(params.id);
  const { isConnected } = useAccount();

  const [contentURI, setContentURI] = useState("");
  const [votingId, setVotingId] = useState<number | null>(null);
  const [voteWeight, setVoteWeight] = useState(3);
  const [step, setStep] = useState<"idle" | "submitting" | "voting" | "settling">("idle");

  // Use mock data
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId) || null;
  const submissions = MOCK_SUBMISSIONS[campaignId] || [];

  const now = Math.floor(Date.now() / 1000);
  const isActive = campaign && now < campaign.deadline && !campaign.settled;
  const isVoting = campaign && now >= campaign.deadline && !campaign.settled;
  const isEnded = campaign?.settled;

  const timeRemaining = campaign
    ? (() => {
        const remaining = campaign.deadline - now;
        if (remaining <= 0) return "Ended";
        const days = Math.floor(remaining / 86400);
        const hours = Math.floor((remaining % 86400) / 3600);
        return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
      })()
    : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentURI.trim()) return;
    setStep("submitting");
    // Mock: simulate submission
    setTimeout(() => {
      setStep("idle");
      setContentURI("");
    }, 2000);
  };

  const handleVote = (submissionId: number) => {
    setVotingId(submissionId);
    setStep("voting");
    // Mock: simulate voting
    setTimeout(() => {
      setStep("idle");
      setVotingId(null);
    }, 2000);
  };

  const handleSettle = () => {
    setStep("settling");
    // Mock: simulate settle
    setTimeout(() => {
      setStep("idle");
    }, 2000);
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
        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
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
                  isActive ? "bg-emerald-400" : isVoting ? "bg-amber-400" : "bg-gray-500"
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

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Award className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {formatUSDC(campaign.totalReward)} USDC
                </p>
                <p className="text-xs text-gray-500">Total reward</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-white">{campaign.submissionCount}</p>
                <p className="text-xs text-gray-500">Submissions</p>
              </div>
            </div>
          </div>

          {/* Settle button */}
          {isVoting && (
            <button
              onClick={handleSettle}
              disabled={step === "settling"}
              className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:shadow-xl disabled:opacity-50"
            >
              {step === "settling" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Award className="h-4 w-4" />
              )}
              Settle & Distribute Rewards
            </button>
          )}
        </div>

        {/* Submit content */}
        {isActive && isConnected && (
          <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
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
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-medium text-white transition hover:bg-cyan-400 disabled:opacity-50"
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
            {submissions.sort((a, b) => b.votes - a.votes).map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
                      {sub.creator.slice(2, 4).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-mono text-sm text-white">
                        {shortenAddress(sub.creator)}
                      </p>
                      <a
                        href={sub.contentURI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        View Content <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{sub.votes}</p>
                      <p className="text-xs text-gray-500">votes</p>
                    </div>

                    {isVoting && isConnected && (
                      <div className="flex items-center gap-2">
                        <select
                          value={voteWeight}
                          onChange={(e) => setVoteWeight(parseInt(e.target.value))}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-sm text-white focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5].map((w) => (
                            <option key={w} value={w}>
                              {w}x
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleVote(sub.id)}
                          disabled={votingId === sub.id || step === "voting"}
                          className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                        >
                          {votingId === sub.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Vote className="h-3.5 w-3.5" />
                          )}
                          Vote
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}
