"use client";

import { Accordion } from "@/components/ui/Accordion";

const CREATOR_GUIDE_ITEMS = [
  {
    id: "guide-start",
    title: "How to Get Started",
    content:
      "Connect your wallet (MetaMask or WalletConnect) to the Injective Creator Hub. Get testnet tokens from the faucet to cover gas fees. Browse the Campaign Explorer to find active campaigns that match your skills.",
  },
  {
    id: "guide-participate",
    title: "How to Participate in a Campaign",
    content:
      "Pick a campaign from the explorer, read the brief for content requirements and deadlines, then click 'Submit'. Upload your content link (tweet, article, video, etc.) and confirm the on-chain transaction. That's it — your submission is now live.",
  },
  {
    id: "guide-rewards",
    title: "How to Earn Rewards",
    content:
      "Rewards come from campaign prize pools set by campaign creators. Submit quality content, earn community votes, and climb the leaderboard. Top submissions receive USDC rewards distributed on-chain after the campaign settles.",
  },
  {
    id: "guide-withdraw",
    title: "How to Withdraw Earnings",
    content:
      "Your earnings accumulate automatically in your on-chain wallet. Go to the Withdraw panel in your dashboard, enter the amount, and confirm the transaction. USDC is sent directly to your wallet — no middleman, no delay.",
  },
  {
    id: "guide-reputation",
    title: "Growing Your Reputation",
    content:
      "Your reputation score grows with consistent quality submissions and earned votes. Higher reputation unlocks premium campaigns, boosts your vote weight, and increases leaderboard visibility. It's your on-chain creative resume.",
  },
  {
    id: "guide-tips",
    title: "Tips for Success",
    content:
      "Focus on quality over quantity. Read campaign briefs carefully and tailor your content. Engage with other creators' work — genuine votes build community. Maintain your submission streak for bonus multipliers and achievement badges.",
  },
];

export function CreatorAccordion() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Creator Guide</h2>
        <p className="text-sm text-gray-400">
          How to get started, participate in campaigns, earn rewards, and grow
          as a creator on Injective.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <Accordion items={CREATOR_GUIDE_ITEMS} allowMultiple />
      </div>
    </section>
  );
}
