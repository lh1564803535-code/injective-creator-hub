"use client";

import { Accordion } from "@/components/ui/Accordion";

const CAMPAIGN_FAQ_ITEMS = [
  {
    id: "campaign-what",
    title: "What are campaigns?",
    content:
      "Campaigns are bounty-style challenges where brands or community members post tasks for creators. You submit content (tweets, threads, videos, articles) and earn USDC rewards based on community votes and quality scores.",
  },
  {
    id: "campaign-join",
    title: "How do I join a campaign?",
    content:
      "Browse the Campaign Explorer, find one you like, and click 'Submit'. You'll need a connected wallet and enough testnet tokens for gas. Follow the campaign brief for content requirements and deadlines.",
  },
  {
    id: "campaign-rewards",
    title: "How are rewards distributed?",
    content:
      "Rewards are distributed on-chain after the campaign settles. The campaign creator sets a total prize pool, which is split among top submissions based on votes and AI-assisted quality scoring. All payouts are in USDC on Injective EVM.",
  },
  {
    id: "campaign-voting",
    title: "How does voting work?",
    content:
      "Any wallet holder can vote on submissions. Each vote is an on-chain transaction with near-zero gas fees. Votes are weighted by voter reputation, and the final ranking determines reward distribution.",
  },
  {
    id: "campaign-create",
    title: "Can I create my own campaign?",
    content:
      "Yes. Click 'Create Campaign' and fill in the brief: title, description, prize pool, deadline, and content requirements. You'll deposit the prize pool in USDC upfront. Once live, creators can start submitting.",
  },
  {
    id: "campaign-deadline",
    title: "What happens after a campaign deadline?",
    content:
      "After the deadline, the voting phase begins. Once voting ends, the campaign creator (or the AI assistant) settles the campaign. Rewards are automatically distributed to winners' wallets.",
  },
];

export function CampaignFAQ() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Campaign FAQ</h2>
        <p className="text-sm text-gray-400">
          Everything you need to know about participating in campaigns.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <Accordion items={CAMPAIGN_FAQ_ITEMS} allowMultiple />
      </div>
    </section>
  );
}
