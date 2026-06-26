"use client";

import { Accordion } from "@/components/ui/Accordion";

const CREATOR_FAQ_ITEMS = [
  {
    id: "creator-start",
    title: "How do I become a creator?",
    content:
      "Connect your wallet to the Injective Creator Hub and you're in. No approval process, no KYC for testnet. Start by exploring active campaigns and submitting your first piece of content.",
  },
  {
    id: "creator-participate",
    title: "How do I participate in a campaign?",
    content:
      "Navigate to the Campaign Explorer, pick a campaign that matches your skills, read the brief carefully, then click 'Submit'. Upload your content (tweet link, article URL, video, etc.) and confirm the on-chain transaction.",
  },
  {
    id: "creator-rewards",
    title: "How do I earn rewards?",
    content:
      "Rewards come from campaign prize pools. When you submit quality content and receive community votes, you climb the leaderboard. Top submissions receive USDC rewards that are distributed on-chain after the campaign settles.",
  },
  {
    id: "creator-withdraw",
    title: "How do I withdraw my earnings?",
    content:
      "Your earnings accumulate in your on-chain wallet automatically. Go to the Withdraw panel in your dashboard, enter the amount, and confirm the transaction. USDC is sent directly to your wallet — no middleman, no delay.",
  },
  {
    id: "creator-reputation",
    title: "What is creator reputation?",
    content:
      "Your reputation score grows as you consistently submit quality content and earn votes. Higher reputation unlocks access to premium campaigns, boosts your vote weight, and increases your visibility on the leaderboard.",
  },
  {
    id: "creator-streaming",
    title: "What is real-time earnings streaming?",
    content:
      "Inspired by Superfluid protocol, your rewards flow to your wallet every second while a campaign is active. Watch your balance tick up in real-time on the dashboard — like a taxi meter for your creativity.",
  },
  {
    id: "creator-streak",
    title: "What are submission streaks?",
    content:
      "Submitting to campaigns on consecutive weeks builds your streak. Longer streaks unlock bonus multipliers on rewards and achievement badges. Break the streak and you start over — consistency pays off.",
  },
];

export function CreatorFAQ() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Creator FAQ</h2>
        <p className="text-sm text-gray-400">
          How to get started, earn rewards, and grow as a creator on Injective.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <Accordion items={CREATOR_FAQ_ITEMS} allowMultiple />
      </div>
    </section>
  );
}
