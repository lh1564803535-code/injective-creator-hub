"use client";

import { Accordion } from "@/components/ui/Accordion";

const CAMPAIGN_RULES_ITEMS = [
  {
    id: "rules-overview",
    title: "Campaign Rules Overview",
    content:
      "Each campaign has a clear brief with content requirements, deadlines, and reward structure. Read the brief carefully before submitting. Submissions that don't meet the requirements may be disqualified.",
  },
  {
    id: "rules-submission",
    title: "Submission Guidelines",
    content:
      "Submit original content only — plagiarism results in permanent disqualification. Content must be published on the specified platform (Twitter, YouTube, blog, etc.) and linked in your submission. One submission per wallet per campaign unless stated otherwise.",
  },
  {
    id: "rules-voting",
    title: "Voting & Ranking Rules",
    content:
      "Voting is open to all connected wallets. Each vote is an on-chain transaction with near-zero gas. Votes are weighted by voter reputation — higher reputation means more influence. Self-voting is not allowed.",
  },
  {
    id: "rules-settlement",
    title: "Settlement & Payouts",
    content:
      "After the voting phase ends, the campaign creator or AI assistant settles the campaign. Rewards are distributed proportionally to top-ranked submissions. All payouts are in USDC on Injective EVM and arrive in your wallet automatically.",
  },
  {
    id: "rules-disputes",
    title: "Dispute Resolution",
    content:
      "If you believe your submission was unfairly scored, you can raise a dispute within 48 hours of settlement. Disputes are reviewed by the community governance process. Decisions are final and recorded on-chain.",
  },
  {
    id: "rules-conduct",
    title: "Code of Conduct",
    content:
      "Respect other creators. No spam, harassment, or manipulation of the voting system. Accounts flagged for abuse may be suspended from future campaigns. The platform reserves the right to remove harmful content.",
  },
];

export function CampaignAccordion() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Campaign Rules & FAQ
        </h2>
        <p className="text-sm text-gray-400">
          Detailed rules, submission guidelines, and answers to common campaign
          questions.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <Accordion items={CAMPAIGN_RULES_ITEMS} allowMultiple />
      </div>
    </section>
  );
}
