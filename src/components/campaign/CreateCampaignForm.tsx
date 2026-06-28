"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { Loader2 } from "lucide-react";
import { BOUNTY_CAMPAIGN_ADDRESS, BOUNTY_CAMPAIGN_ABI } from "@/lib/contract-abi";

interface Props {
  sponsorAddress: `0x${string}` | undefined;
}

export function CreateCampaignForm({ sponsorAddress }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [durationDays, setDurationDays] = useState("7");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reward) return;

    writeContract({
      address: BOUNTY_CAMPAIGN_ADDRESS,
      abi: BOUNTY_CAMPAIGN_ABI,
      functionName: "createCampaign",
      args: [
        title,
        description || "No description provided",
        parseUnits(reward, 6),
        BigInt(Number(durationDays) * 86400),
      ],
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <p className="text-emerald-400 font-medium mb-2">Campaign created successfully!</p>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-400 hover:text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Create a meme about Injective"
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what kind of content you're looking for..."
          rows={3}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Reward (USDC) *</label>
          <input
            type="number"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="10"
            min="1"
            step="0.01"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Duration (days)</label>
          <input
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            min="1"
            max="30"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error.message.slice(0, 120)}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || isConfirming || !title || !reward}
        className="w-full rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending || isConfirming ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {isPending ? "Confirm in wallet..." : "Creating..."}
          </span>
        ) : (
          "Create Campaign"
        )}
      </button>
    </form>
  );
}
