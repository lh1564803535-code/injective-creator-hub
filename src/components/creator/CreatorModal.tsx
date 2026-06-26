"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Heart,
  Award,
  AtSign,
  Globe,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  campaigns?: number;
  totalEarnings?: string;
  reputation?: number;
  tags?: string[];
  socialLinks?: {
    twitter?: string;
    website?: string;
  };
}

interface CreatorModalProps {
  /** Creator Detail Modal */
  detail?: {
    isOpen: boolean;
    onClose: () => void;
    creator: Creator;
  };
  /** Tip / Donate Modal */
  tip?: {
    isOpen: boolean;
    onClose: () => void;
    onTip: (amount: string) => void;
    creator: Creator;
    loading?: boolean;
  };
  /** Share Modal */
  share?: {
    isOpen: boolean;
    onClose: () => void;
    creator: Creator;
  };
}

/* ------------------------------------------------------------------ */
/*  Creator Detail Modal                                               */
/* ------------------------------------------------------------------ */

function CreatorDetailBody({
  creator,
  onClose,
}: {
  creator: Creator;
  onClose: () => void;
}) {
  return (
    <Modal isOpen onClose={onClose} title="Creator Profile" size="lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-2xl font-bold text-cyan-400">
            {creator.avatar ? (
              <img
                src={creator.avatar}
                alt={creator.name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              creator.name[0]
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{creator.name}</h3>
            <p className="text-sm text-cyan-400">{creator.handle}</p>
            {creator.reputation !== undefined && (
              <div className="mt-1 flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-xs text-gray-400">
                  Reputation: {creator.reputation}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <p className="text-sm leading-relaxed text-gray-400">{creator.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Followers",
              value: creator.followers?.toLocaleString() ?? "-",
            },
            { label: "Campaigns", value: creator.campaigns?.toString() ?? "-" },
            {
              label: "Earnings",
              value: creator.totalEarnings ? `${creator.totalEarnings} INJ` : "-",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center"
            >
              <p className="text-lg font-semibold text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        {creator.tags && creator.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {creator.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-xs text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Links */}
        {creator.socialLinks && (
          <div className="flex items-center gap-3">
            {creator.socialLinks.twitter && (
              <a
                href={creator.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                <AtSign className="h-3.5 w-3.5" />
                Twitter
              </a>
            )}
            {creator.socialLinks.website && (
              <a
                href={creator.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Website
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Tip Modal                                                          */
/* ------------------------------------------------------------------ */

const TIP_PRESETS = ["5", "10", "25", "50", "100"];

function TipCreatorBody({
  creator,
  onTip,
  loading,
  onClose,
}: {
  creator: Creator;
  onTip: (amount: string) => void;
  loading?: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handlePreset = (val: string) => {
    setAmount(val);
    setError("");
  };

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    onTip(amount);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Send a Tip"
      description={`Support ${creator.name} with INJ`}
      size="sm"
      actions={[
        { label: "Cancel", onClick: onClose, variant: "ghost" },
        {
          label: `Send ${amount || "0"} INJ`,
          onClick: handleSubmit,
          variant: "primary",
          loading,
        },
      ]}
    >
      <div className="space-y-4">
        {/* Creator Info */}
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-sm font-bold text-cyan-400">
            {creator.avatar ? (
              <img
                src={creator.avatar}
                alt={creator.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              creator.name[0]
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{creator.name}</p>
            <p className="text-xs text-gray-500">{creator.handle}</p>
          </div>
          <Heart className="ml-auto h-4 w-4 text-red-400" />
        </div>

        {/* Presets */}
        <div>
          <p className="mb-2 text-xs font-medium text-gray-400">
            Quick amounts
          </p>
          <div className="flex gap-2">
            {TIP_PRESETS.map((val) => (
              <button
                key={val}
                onClick={() => handlePreset(val)}
                className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                  amount === val
                    ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                    : "border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:bg-white/[0.04]"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <Input
          label="Custom Amount (INJ)"
          placeholder="Enter amount"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          error={error}
        />
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Share Modal                                                        */
/* ------------------------------------------------------------------ */

function ShareCreatorBody({
  creator,
  onClose,
}: {
  creator: Creator;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const profileUrl =
    creator.socialLinks?.website ||
    `https://injective-creator-hub.vercel.app/creator/${creator.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = profileUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      label: "Twitter",
      icon: AtSign,
      href: `https://twitter.com/intent/tweet?text=Check out ${creator.name} on Injective Creator Hub!&url=${encodeURIComponent(profileUrl)}`,
    },
    {
      label: "Copy Link",
      icon: copied ? Check : Copy,
      onClick: handleCopy,
    },
  ];

  return (
    <Modal isOpen onClose={onClose} title="Share Creator" size="sm">
      <div className="space-y-4">
        {/* Creator Preview */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-lg font-bold text-cyan-400">
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                creator.name[0]
              )}
            </div>
            <div>
              <p className="font-medium text-white">{creator.name}</p>
              <p className="text-xs text-gray-500">{creator.handle}</p>
            </div>
          </div>
          {creator.bio && (
            <p className="mt-3 text-xs text-gray-500 line-clamp-2">
              {creator.bio}
            </p>
          )}
        </div>

        {/* Share URL */}
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <p className="flex-1 truncate text-xs text-gray-400">{profileUrl}</p>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-lg p-1.5 text-gray-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {shareOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={
                opt.href
                  ? () => window.open(opt.href, "_blank")
                  : opt.onClick
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <opt.icon className="h-4 w-4" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported Wrapper                                                   */
/* ------------------------------------------------------------------ */

export function CreatorModal({
  detail,
  tip,
  share,
}: CreatorModalProps) {
  return (
    <>
      {detail && (
        <CreatorDetailBody creator={detail.creator} onClose={detail.onClose} />
      )}
      {tip && (
        <TipCreatorBody
          creator={tip.creator}
          onTip={tip.onTip}
          loading={tip.loading}
          onClose={tip.onClose}
        />
      )}
      {share && (
        <ShareCreatorBody creator={share.creator} onClose={share.onClose} />
      )}
    </>
  );
}
