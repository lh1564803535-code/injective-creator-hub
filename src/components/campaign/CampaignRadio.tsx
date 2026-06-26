"use client";

import { useState } from "react";
import { RadioGroup } from "@/components/ui/Radio";
import { Coins, Trophy, Users } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignRadioProps {
  onRewardChange?: (value: string) => void;
  onTypeChange?: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const rewardOptions = [
  {
    value: "by-votes",
    label: "By Votes",
    description: "Rewards proportional to community votes received",
  },
  {
    value: "by-rank",
    label: "By Rank",
    description: "Top-ranked creators receive tiered rewards",
  },
  {
    value: "equal",
    label: "Equal Distribution",
    description: "Split the reward pool equally among all eligible creators",
  },
];

const campaignTypeOptions = [
  {
    value: "open",
    label: "Open Campaign",
    description: "Anyone can submit content and participate",
  },
  {
    value: "invite-only",
    label: "Invite Only",
    description: "Only invited creators can participate",
  },
  {
    value: "ranked",
    label: "Ranked Competition",
    description: "Creators compete for top positions on a leaderboard",
  },
];

// ---------------------------------------------------------------------------
// CampaignRadio
// ---------------------------------------------------------------------------

export function CampaignRadio({
  onRewardChange,
  onTypeChange,
}: CampaignRadioProps) {
  const [rewardMethod, setRewardMethod] = useState("by-votes");
  const [campaignType, setCampaignType] = useState("open");

  const handleRewardChange = (value: string) => {
    setRewardMethod(value);
    onRewardChange?.(value);
  };

  const handleTypeChange = (value: string) => {
    setCampaignType(value);
    onTypeChange?.(value);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Reward distribution */}
      <div className="rounded-xl bg-[#1a1a1a] p-5 ring-1 ring-white/10">
        <div className="mb-4 flex items-center gap-2">
          <Coins className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            Reward Distribution
          </h3>
        </div>
        <RadioGroup
          name="reward-method"
          options={rewardOptions}
          value={rewardMethod}
          onChange={handleRewardChange}
        />
      </div>

      {/* Campaign type */}
      <div className="rounded-xl bg-[#1a1a1a] p-5 ring-1 ring-white/10">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Campaign Type</h3>
        </div>
        <RadioGroup
          name="campaign-type"
          options={campaignTypeOptions}
          value={campaignType}
          onChange={handleTypeChange}
        />
      </div>

      {/* Selected summary */}
      <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-4 py-3">
        <Users className="h-4 w-4 text-cyan-400" />
        <p className="text-xs text-gray-400">
          <span className="font-medium text-white">
            {rewardOptions.find((o) => o.value === rewardMethod)?.label}
          </span>
          {" / "}
          <span className="font-medium text-white">
            {campaignTypeOptions.find((o) => o.value === campaignType)?.label}
          </span>
        </p>
      </div>
    </div>
  );
}
