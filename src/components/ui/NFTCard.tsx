"use client";

import { ExternalLink, Star, Clock } from "lucide-react";

interface NFTCardProps {
  name: string;
  image: string;
  collection?: string;
  price?: string;
  currency?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  deadline?: string;
  explorerUrl?: string;
  className?: string;
}

const rarityColors = {
  common: "text-gray-400 bg-gray-500/10",
  rare: "text-cyan-400 bg-cyan-500/10",
  epic: "text-purple-400 bg-purple-500/10",
  legendary: "text-amber-400 bg-amber-500/10",
};

export function NFTCard({
  name,
  image,
  collection,
  price,
  currency = "USDC",
  rarity,
  deadline,
  explorerUrl,
  className = "",
}: NFTCardProps) {
  const rarityConfig = rarity ? rarityColors[rarity] : null;

  return (
    <div className={`group overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition hover:border-white/[0.12] ${className}`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white/[0.04]">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {rarity && (
          <div className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${rarityConfig}`}>
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {collection && (
          <p className="mb-1 text-[10px] text-gray-500">{collection}</p>
        )}
        <p className="text-sm font-medium text-white">{name}</p>

        <div className="mt-2 flex items-center justify-between">
          {price && (
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-sm font-bold text-white">{price} {currency}</p>
            </div>
          )}
          {deadline && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{deadline}</span>
            </div>
          )}
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-cyan-400"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
