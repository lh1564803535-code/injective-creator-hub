"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  Target,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";

interface WikiSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: { id: string; title: string; content: string }[];
}

const CREATOR_WIKI_SECTIONS: WikiSection[] = [
  {
    id: "creator-guide",
    title: "Creator Guide",
    icon: <BookOpen className="h-5 w-5 text-cyan-400" />,
    description: "How to get started and grow as a creator.",
    items: [
      {
        id: "getting-started",
        title: "Getting started",
        content:
          "Connect your wallet to the Injective Creator Hub and you're in. No approval process, no KYC for testnet. Start by exploring active campaigns in the Campaign Explorer. Pick one that matches your skills, read the brief, and submit your first piece of content. Every journey starts with a single submission.",
      },
      {
        id: "profile-setup",
        title: "Setting up your profile",
        content:
          "Your creator profile is your on-chain identity. Add a display name, bio, and social links. Connect your Twitter account for verification and analytics. A complete profile builds trust with voters and unlocks access to premium campaigns. Your reputation score is displayed prominently.",
      },
      {
        id: "finding-campaigns",
        title: "Finding the right campaigns",
        content:
          "Use the Campaign Explorer to filter by category, reward size, deadline, and difficulty. The AI recommendation engine suggests campaigns based on your skills and past performance. Start with smaller campaigns to build reputation, then target larger prize pools as your score grows.",
      },
      {
        id: "submission-workflow",
        title: "Submission workflow",
        content:
          "1) Read the campaign brief carefully. 2) Create your content following the requirements. 3) Click 'Submit' on the campaign page. 4) Paste your content URL or upload directly. 5) Review the transaction preview. 6) Confirm the on-chain transaction. Your submission enters the voting pool immediately.",
      },
    ],
  },
  {
    id: "best-practices",
    title: "Best Practices",
    icon: <Lightbulb className="h-5 w-5 text-amber-400" />,
    description: "Proven strategies for success.",
    items: [
      {
        id: "content-quality",
        title: "Content quality tips",
        content:
          "Research the Injective ecosystem thoroughly before creating content. Use data and on-chain metrics to back your claims. Include visuals — charts, screenshots, infographics. Write clear, engaging headlines. Proofread everything. High-quality content consistently outperforms quantity in community voting.",
      },
      {
        id: "timing-submissions",
        title: "Timing your submissions",
        content:
          "Submit early to get more visibility during the voting period. Avoid last-minute submissions — voters may have already formed opinions. However, don't rush quality. A well-crafted submission on day 2 beats a sloppy one on day 1. Find your balance between speed and quality.",
      },
      {
        id: "engagement-strategy",
        title: "Engagement strategy",
        content:
          "Engage with other creators' content — vote, comment, and share. This builds your reputation and community presence. Participate in platform discussions and governance. The community rewards active members who contribute beyond their own submissions.",
      },
      {
        id: "niche-specialization",
        title: "Finding your niche",
        content:
          "Specialize in 1-2 content types where you excel. DeFi analysis, NFT commentary, technical tutorials, memes — find what resonates. Consistency in a niche builds your reputation faster than being mediocre at everything. Voters recognize and reward expertise.",
      },
    ],
  },
  {
    id: "reputation-growth",
    title: "Reputation Growth",
    icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
    description: "Building your on-chain reputation.",
    items: [
      {
        id: "reputation-basics",
        title: "How reputation works",
        content:
          "Your reputation score is calculated from: submission quality (votes received), voting participation (how actively you vote), consistency (submission streaks), and community engagement. Higher reputation means more vote weight, access to premium campaigns, and better visibility on leaderboards.",
      },
      {
        id: "building-reputation",
        title: "Building reputation",
        content:
          "Submit consistently to campaigns — quality over quantity. Vote thoughtfully on other submissions. Maintain your weekly submission streak for bonus multipliers. Engage constructively in community discussions. Avoid any behavior that could be flagged as manipulation — it tanks your score.",
      },
      {
        id: "reputation-tiers",
        title: "Reputation tiers",
        content:
          "New Creator (0-100): Access to open campaigns. Established Creator (100-500): Unlock premium campaigns and higher vote weight. Expert Creator (500-1000): Featured on leaderboards, early access to new campaigns. Master Creator (1000+): Maximum vote weight, governance participation, mentorship opportunities.",
      },
    ],
  },
  {
    id: "earnings-strategy",
    title: "Earnings Strategy",
    icon: <Star className="h-5 w-5 text-yellow-400" />,
    description: "Maximizing your creator earnings.",
    items: [
      {
        id: "earnings-overview",
        title: "How earnings work",
        content:
          "Earnings come from campaign prize pools. When you submit quality content and receive votes, you rank higher. Top-ranked submissions receive USDC rewards. Rewards stream in real-time during active campaigns and settle on-chain after the voting period ends.",
      },
      {
        id: "maximize-rewards",
        title: "Maximizing rewards",
        content:
          "Focus on campaigns that match your expertise. Build reputation to unlock higher-tier campaigns. Maintain submission streaks for bonus multipliers. Participate in multiple campaigns simultaneously when possible. The AI recommendation engine helps identify the best opportunities for your skill set.",
      },
      {
        id: "withdraw-earnings",
        title: "Withdrawing earnings",
        content:
          "Your earnings accumulate in your on-chain wallet automatically. Go to the Withdraw panel in your dashboard, enter the amount, and confirm the transaction. USDC is sent directly to your wallet — no middleman, no delay. Gas fees are negligible on Injective EVM.",
      },
    ],
  },
  {
    id: "advanced-tips",
    title: "Advanced Tips",
    icon: <Zap className="h-5 w-5 text-purple-400" />,
    description: "Level up your creator game.",
    items: [
      {
        id: "data-driven",
        title: "Data-driven content",
        content:
          "Use on-chain data to create compelling content. Pull metrics from Injective Explorer, DeFiLlama, or Dune Analytics. Data-backed analysis is more credible and earns more votes. Show transaction volumes, TVL growth, user adoption curves — real numbers tell real stories.",
      },
      {
        id: "cross-platform",
        title: "Cross-platform strategy",
        content:
          "Repurpose your Injective content across platforms. A Twitter thread can become a blog post. A blog post can become a video script. Cross-platform presence amplifies your reach and brings more voters to your submissions. Just ensure each piece is optimized for its platform.",
      },
      {
        id: "community-leadership",
        title: "Community leadership",
        content:
          "Top creators become community leaders. Participate in governance votes. Help newcomers in discussions. Share your strategies and insights. Community leaders earn respect, higher reputation, and often get invited to exclusive campaigns with larger prize pools.",
      },
      {
        id: "avoid-burnout",
        title: "Avoiding burnout",
        content:
          "Don't overcommit to too many campaigns at once. Quality suffers when you spread yourself thin. Take breaks between campaigns. Set a sustainable pace — 2-3 quality submissions per week is better than 7 mediocre ones. Your reputation grows from consistency, not volume.",
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    icon: <Target className="h-5 w-5 text-rose-400" />,
    description: "Frequently asked questions from creators.",
    items: [
      {
        id: "faq-rewards",
        title: "When do I get paid?",
        content:
          "Rewards stream in real-time during active campaigns. After the campaign settles (voting period ends), final rewards are distributed within minutes. All payouts are in USDC on Injective EVM. You can track your earnings in real-time on the dashboard.",
      },
      {
        id: "faq-gas",
        title: "How much are gas fees?",
        content:
          "Gas fees on Injective are nearly zero — approximately 0.001 INJ per transaction. This is orders of magnitude cheaper than Ethereum mainnet. You can submit, vote, and claim rewards without worrying about gas costs eating into your earnings.",
      },
      {
        id: "faq-multiple",
        title: "Can I submit to multiple campaigns?",
        content:
          "Yes. You can submit to as many active campaigns as you like, as long as you meet each campaign's requirements. Managing multiple submissions is a great way to diversify your earnings. Just ensure each submission meets the quality bar — low-effort submissions hurt your reputation.",
      },
      {
        id: "faq-plagiarism",
        title: "What about plagiarism?",
        content:
          "Plagiarized content is flagged by the community and removed. Repeated offenses result in reputation penalties and potential platform bans. All content is verifiable — voters can check originality. Original work is always rewarded over copied content.",
      },
    ],
  },
];

export function CreatorWiki() {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );

  const selectedSection =
    CREATOR_WIKI_SECTIONS.find((s) => s.id === selectedSectionId) ?? null;

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
        <h2 className="text-2xl font-bold text-white">Creator Wiki</h2>
        <p className="text-sm text-gray-400">
          Your guide to becoming a successful creator on Injective.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CREATOR_WIKI_SECTIONS.map((section) => (
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
