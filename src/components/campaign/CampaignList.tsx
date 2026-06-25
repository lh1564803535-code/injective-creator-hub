"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CampaignCard } from "./CampaignCard";
import type { Campaign } from "@/types/creator-settlement";

interface CampaignListProps {
  campaigns: Campaign[];
  title?: string;
}

// Demo campaigns when no real ones exist
const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    sponsor: "0x1234...5678",
    title: "XHunt Content Sprint",
    description: "Create viral content about Injective's XHunt ecosystem. Best content wins USDC prizes.",
    totalReward: BigInt(5000000000), // 5000 USDC
    deadline: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
    submissionCount: 23,
    settled: false,
  },
  {
    id: 2,
    sponsor: "0xabcd...ef01",
    title: "DeFi Tutorial Challenge",
    description: "Write tutorials explaining Injective's unique DeFi features for newcomers.",
    totalReward: BigInt(2000000000), // 2000 USDC
    deadline: Math.floor(Date.now() / 1000) + 86400 * 3, // 3 days
    submissionCount: 15,
    settled: false,
  },
  {
    id: 3,
    sponsor: "0x9876...5432",
    title: "Meme Contest #42",
    description: "Funniest Injective meme wins! Community votes decide the winner.",
    totalReward: BigInt(1000000000), // 1000 USDC
    deadline: Math.floor(Date.now() / 1000) + 86400 * 14, // 14 days
    submissionCount: 67,
    settled: false,
  },
];

export function CampaignList({
  campaigns: realCampaigns,
  title = "Active Campaigns",
}: CampaignListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const campaigns =
    realCampaigns.length > 0 ? realCampaigns : DEMO_CAMPAIGNS;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [campaigns]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -360 : 360,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-500">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable List */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
      >
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}

        {/* Create new campaign card */}
        <div className="flex min-w-[280px] max-w-[340px] items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] p-8 transition-all hover:border-cyan-500/20 hover:bg-white/[0.02]">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
              <Plus className="h-6 w-6 text-cyan-400" />
            </div>
            <p className="font-medium text-white">Create Campaign</p>
            <p className="mt-1 text-sm text-gray-500">
              Launch your own bounty
            </p>
          </div>
        </div>
      </div>

      {/* Fade edges */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute bottom-4 left-0 top-16 w-12 bg-gradient-to-r from-[#08080f] to-transparent" />
      )}
      {canScrollRight && (
        <div className="pointer-events-none absolute bottom-4 right-0 top-16 w-12 bg-gradient-to-l from-[#08080f] to-transparent" />
      )}
    </div>
  );
}
