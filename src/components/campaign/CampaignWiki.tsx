"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Shield,
  Users,
  Clock,
  Award,
  AlertTriangle,
} from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";

interface WikiSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: { id: string; title: string; content: string }[];
}

const CAMPAIGN_WIKI_SECTIONS: WikiSection[] = [
  {
    id: "campaign-guide",
    title: "Campaign Guide",
    icon: <BookOpen className="h-5 w-5 text-cyan-400" />,
    description: "How campaigns work on Injective Creator Hub.",
    items: [
      {
        id: "what-are-campaigns",
        title: "What are campaigns?",
        content:
          "Campaigns are bounty-style challenges where brands or community members post tasks for creators. Each campaign has a prize pool (in USDC), a deadline, and specific content requirements. Creators submit content, the community votes, and rewards are distributed on-chain after settlement.",
      },
      {
        id: "campaign-lifecycle",
        title: "Campaign lifecycle",
        content:
          "A campaign goes through these phases: 1) Creation — the sponsor defines the brief and deposits the prize pool. 2) Submission — creators submit content before the deadline. 3) Voting — the community votes on submissions. 4) Settlement — rewards are distributed to top submissions. Each phase is enforced on-chain.",
      },
      {
        id: "create-campaign",
        title: "How to create a campaign",
        content:
          "Click 'Create Campaign' from the dashboard. Fill in the title, description, prize pool amount, deadline, and content requirements. You'll deposit the prize pool in USDC upfront — this ensures creators trust the reward. Once live, your campaign appears in the Campaign Explorer for all creators to discover.",
      },
      {
        id: "campaign-types",
        title: "Campaign types",
        content:
          "Supports multiple content types: Twitter threads, blog articles, video content, memes, infographics, and more. Each campaign specifies accepted formats in its brief. Some campaigns are open to all creators, while premium campaigns may require a minimum reputation score.",
      },
    ],
  },
  {
    id: "participation-rules",
    title: "Participation Rules",
    icon: <Shield className="h-5 w-5 text-emerald-400" />,
    description: "Rules and guidelines for fair participation.",
    items: [
      {
        id: "eligibility",
        title: "Eligibility",
        content:
          "Any wallet holder can participate in open campaigns. Premium campaigns may require a minimum reputation score. One wallet = one identity — sybil behavior (using multiple wallets to gain advantage) is detected and penalized. Your wallet must be connected to Injective EVM.",
      },
      {
        id: "submission-rules",
        title: "Submission rules",
        content:
          "Each campaign has a maximum number of submissions per creator (usually 1). Content must be original and meet the campaign brief requirements. Plagiarized or low-effort submissions are voted down by the community. Submissions must be made before the campaign deadline — late entries are not accepted.",
      },
      {
        id: "voting-rules",
        title: "Voting rules",
        content:
          "Each wallet can vote once per submission. Votes are weighted by the voter's reputation score — higher reputation means more influence. Self-voting is not allowed. Vote manipulation (vote buying, coordination) is detected on-chain and results in reputation penalties.",
      },
      {
        id: "reward-distribution",
        title: "Reward distribution",
        content:
          "After the voting phase ends, the campaign is settled. The prize pool is distributed to top-ranked submissions proportionally. Rewards are paid in USDC directly to the creator's wallet. There are no platform fees on rewards — the full prize pool goes to creators.",
      },
    ],
  },
  {
    id: "community-guidelines",
    title: "Community Guidelines",
    icon: <Users className="h-5 w-5 text-purple-400" />,
    description: "How to be a good community member.",
    items: [
      {
        id: "content-quality",
        title: "Content quality standards",
        content:
          "High-quality content is well-researched, original, and adds value to the Injective ecosystem. Avoid clickbait, misinformation, or spam. Use proper grammar and formatting. Include visuals when relevant. The community votes on quality — thoughtful content consistently outperforms low-effort submissions.",
      },
      {
        id: "constructive-voting",
        title: "Constructive voting",
        content:
          "Vote based on content quality, not personal relationships. Leave constructive feedback when possible. Upvote content that genuinely contributes to the ecosystem. Downvote sparingly and only for valid reasons (spam, plagiarism, low quality). Your voting history is public and affects your reputation.",
      },
      {
        id: "dispute-resolution",
        title: "Dispute resolution",
        content:
          "If you believe a campaign result is unfair, raise a dispute through the community governance process. Disputes are reviewed by reputation-weighted community vote. The platform provides transparent on-chain records of all votes and submissions for verification.",
      },
    ],
  },
  {
    id: "timing-schedules",
    title: "Timing & Schedules",
    icon: <Clock className="h-5 w-5 text-amber-400" />,
    description: "Campaign timing and important deadlines.",
    items: [
      {
        id: "campaign-duration",
        title: "Campaign duration",
        content:
          "Campaigns can run from 1 day to 90 days. The sponsor sets the duration when creating the campaign. Short campaigns (1-7 days) are good for quick challenges. Longer campaigns (30-90 days) allow for more in-depth content creation and higher-quality submissions.",
      },
      {
        id: "voting-period",
        title: "Voting period",
        content:
          "The voting period begins immediately after the campaign deadline and typically lasts 3-7 days. During this time, the community reviews and votes on all submissions. The exact voting period is set by the campaign creator and displayed on the campaign page.",
      },
      {
        id: "settlement-timing",
        title: "Settlement timing",
        content:
          "Settlement can be triggered by the campaign creator or automatically after the voting period ends. Once settled, rewards are distributed within minutes. All transactions are on-chain and verifiable. Creators can track their earnings in real-time on the dashboard.",
      },
    ],
  },
  {
    id: "rewards-incentives",
    title: "Rewards & Incentives",
    icon: <Award className="h-5 w-5 text-yellow-400" />,
    description: "How rewards work and how to maximize earnings.",
    items: [
      {
        id: "reward-structure",
        title: "Reward structure",
        content:
          "Each campaign has a fixed prize pool in USDC. Rewards are distributed to the top N submissions (as defined by the campaign). The distribution can be equal (everyone gets the same) or tiered (1st place gets more). The exact structure is visible on each campaign page.",
      },
      {
        id: "real-time-streaming",
        title: "Real-time streaming",
        content:
          "Inspired by Superfluid protocol, rewards stream to your wallet every second while a campaign is active. You can watch your balance grow in real-time on the dashboard. This provides instant gratification and transparency — no waiting for batch payouts.",
      },
      {
        id: "maximize-earnings",
        title: "Maximizing earnings",
        content:
          "Focus on campaigns that match your skills. Build your reputation by consistently submitting quality content. Participate in voting to increase your reputation score. Maintain submission streaks for bonus multipliers. Higher reputation unlocks access to premium campaigns with larger prize pools.",
      },
    ],
  },
  {
    id: "safety-security",
    title: "Safety & Security",
    icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
    description: "Staying safe on the platform.",
    items: [
      {
        id: "wallet-security",
        title: "Wallet security",
        content:
          "Never share your private keys or seed phrase. The platform never asks for them. Always verify transaction details before signing. Use hardware wallets for large balances. Enable transaction previews in your wallet settings for an extra layer of security.",
      },
      {
        id: "scam-awareness",
        title: "Scam awareness",
        content:
          "Beware of phishing sites that mimic the Injective Creator Hub. Always verify the URL. No one from the team will ever DM you asking for keys or funds. Report suspicious campaigns or users through the community governance process.",
      },
      {
        id: "on-chain-transparency",
        title: "On-chain transparency",
        content:
          "All platform activity is recorded on-chain and publicly verifiable. You can inspect any transaction, vote, or reward distribution using the Injective Explorer. This transparency ensures fair play and accountability for all participants.",
      },
    ],
  },
];

export function CampaignWiki() {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );

  const selectedSection =
    CAMPAIGN_WIKI_SECTIONS.find((s) => s.id === selectedSectionId) ?? null;

  // Section detail view
  if (selectedSection) {
    const accordionItems = selectedSection.items.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
    }));

    return (
      <section className="space-y-6">
        <button
          onClick={() => setSelectedSectionId(null)}
          className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all sections
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {selectedSection.icon}
            <h2 className="text-xl font-bold text-white">
              {selectedSection.title}
            </h2>
          </div>
          <p className="text-sm text-gray-400">
            {selectedSection.description}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <Accordion items={accordionItems} allowMultiple />
        </div>
      </section>
    );
  }

  // Section list view
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Campaign Wiki</h2>
        <p className="text-sm text-gray-400">
          Everything you need to know about campaigns, rules, and rewards.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CAMPAIGN_WIKI_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setSelectedSectionId(section.id)}
            className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-left transition hover:bg-white/[0.04]"
          >
            <div className="mt-0.5 shrink-0">{section.icon}</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300">
                {section.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {section.description}
              </p>
              <p className="mt-2 text-[10px] text-gray-600">
                {section.items.length} topics
              </p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-600 transition group-hover:text-gray-400" />
          </button>
        ))}
      </div>
    </section>
  );
}
