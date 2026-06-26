"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Award,
  Clock,
  ExternalLink,
  ChevronRight,
  Vote,
  ImageIcon,
  TrendingUp,
} from "lucide-react";
import { formatUSDC, shortenAddress, getTimeRemaining } from "@/lib/injective";
import type { Campaign, Submission } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Participant {
  address: string;
  submissions: number;
  totalVotes: number;
  joinedAt: number;
}

interface VoteStats {
  totalVotes: number;
  uniqueVoters: number;
  averageVotesPerSubmission: number;
  topVotedSubmissionId: number;
}

interface CampaignDetailsProps {
  campaign: Campaign;
  submissions?: Submission[];
  participants?: Participant[];
  voteStats?: VoteStats;
  coverImage?: string;
  sponsorName?: string;
  sponsorAvatar?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SponsorInfo({
  sponsor,
  sponsorName,
  sponsorAvatar,
}: {
  sponsor: string;
  sponsorName?: string;
  sponsorAvatar?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
        {sponsorAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sponsorAvatar}
            alt={sponsorName || "Sponsor"}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          (sponsorName || sponsor).slice(0, 2).toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">Sponsored by</p>
        <p className="truncate text-sm font-medium text-white">
          {sponsorName || shortenAddress(sponsor)}
        </p>
      </div>
      <a
        href={`https://explorer.injective.network/account/${sponsor}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
      >
        Explorer
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

function ParticipantList({ participants }: { participants: Participant[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? participants : participants.slice(0, 5);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-medium text-white">
          <Users className="h-4 w-4 text-cyan-400" />
          Participants
        </h4>
        <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
          {participants.length}
        </span>
      </div>

      <div className="space-y-2">
        {displayed.map((p, i) => (
          <div
            key={p.address}
            className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2 transition-colors hover:bg-white/[0.04]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-medium text-gray-400">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate font-mono text-xs text-white">
                {shortenAddress(p.address)}
              </p>
              <p className="text-[10px] text-gray-500">
                {p.submissions} submission{p.submissions !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-amber-400">
                {p.totalVotes} votes
              </p>
            </div>
          </div>
        ))}
      </div>

      {participants.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-gray-500 hover:text-white"
        >
          {showAll ? "Show less" : `Show all ${participants.length}`}
          <ChevronRight
            className={`h-3 w-3 transition-transform ${showAll ? "rotate-90" : ""}`}
          />
        </button>
      )}
    </div>
  );
}

function VoteStatistics({ stats }: { stats: VoteStats }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
        <Vote className="h-4 w-4 text-amber-400" />
        Vote Statistics
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Total Votes
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-amber-400">
            {stats.totalVotes.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Unique Voters
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {stats.uniqueVoters.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Avg Votes / Work
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-cyan-400">
            {stats.averageVotesPerSubmission.toFixed(1)}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Top Voted
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
            #{stats.topVotedSubmissionId}
          </p>
        </div>
      </div>
    </div>
  );
}

function Timeline({
  deadline,
  settled,
}: {
  deadline: number;
  settled: boolean;
}) {
  const timeLeft = getTimeRemaining(deadline);
  const deadlineDate = new Date(deadline * 1000);

  const milestones = [
    { label: "Created", done: true, date: "Campaign start" },
    { label: "Submissions", done: true, date: "Open phase" },
    { label: "Voting", done: settled, date: "Community votes" },
    {
      label: "Settled",
      done: settled,
      date: settled ? "Completed" : timeLeft,
    },
  ];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
        <Clock className="h-4 w-4 text-gray-400" />
        Timeline
      </h4>

      <div className="relative">
        {milestones.map((m, i) => (
          <div key={m.label} className="flex items-start gap-3">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full border-2 ${
                  m.done
                    ? "border-emerald-400 bg-emerald-400"
                    : i === milestones.findIndex((x) => !x.done)
                      ? "border-amber-400 bg-amber-400/20"
                      : "border-gray-600 bg-transparent"
                }`}
              />
              {i < milestones.length - 1 && (
                <div
                  className={`w-px flex-1 min-h-[24px] ${
                    m.done ? "bg-emerald-400/40" : "bg-gray-700"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-4">
              <p
                className={`text-xs font-medium ${
                  m.done ? "text-white" : "text-gray-500"
                }`}
              >
                {m.label}
              </p>
              <p className="text-[10px] text-gray-500">{m.date}</p>
            </div>
          </div>
        ))}
      </div>

      {!settled && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2">
          <Calendar className="h-3.5 w-3.5 text-amber-400" />
          <p className="text-[10px] text-amber-400">
            Deadline:{" "}
            {deadlineDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CampaignDetails({
  campaign,
  submissions = [],
  participants = [],
  voteStats,
  coverImage,
  sponsorName,
  sponsorAvatar,
}: CampaignDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Cover image */}
      {coverImage && (
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={campaign.title}
            className="h-48 w-full object-cover sm:h-64"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {campaign.title}
            </h2>
          </div>
        </div>
      )}

      {/* Title (when no cover image) */}
      {!coverImage && (
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          {campaign.title}
        </h2>
      )}

      {/* Description */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <h4 className="mb-2 text-sm font-medium text-white">Description</h4>
        <div className="prose-invert prose-sm text-sm leading-relaxed text-gray-400">
          {campaign.description.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Reward + Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <Award className="mx-auto mb-1 h-5 w-5 text-amber-400" />
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Reward Pool
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-amber-400">
            {formatUSDC(campaign.totalReward)}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <ImageIcon className="mx-auto mb-1 h-5 w-5 text-cyan-400" />
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Submissions
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {campaign.submissionCount}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <TrendingUp className="mx-auto mb-1 h-5 w-5 text-emerald-400" />
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Status
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-400 capitalize">
            {campaign.settled ? "Settled" : "Active"}
          </p>
        </div>
      </div>

      {/* Sponsor info */}
      <SponsorInfo
        sponsor={campaign.sponsor}
        sponsorName={sponsorName}
        sponsorAvatar={sponsorAvatar}
      />

      {/* Two-column layout for details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Participants + Submissions */}
        <div className="space-y-4">
          {participants.length > 0 && (
            <ParticipantList participants={participants} />
          )}

          {submissions.length > 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                <ImageIcon className="h-4 w-4 text-cyan-400" />
                Recent Submissions
              </h4>
              <div className="space-y-2">
                {submissions.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-white">
                        {shortenAddress(s.creator)}
                      </p>
                    </div>
                    <span className="ml-3 text-xs font-medium text-amber-400">
                      {s.votes} votes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Vote stats + Timeline */}
        <div className="space-y-4">
          {voteStats && <VoteStatistics stats={voteStats} />}
          <Timeline deadline={campaign.deadline} settled={campaign.settled} />
        </div>
      </div>
    </div>
  );
}
