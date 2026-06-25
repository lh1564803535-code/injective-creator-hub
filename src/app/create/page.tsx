"use client";

import { useState } from "react";
import { ArrowLeft, Rocket, Loader2, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function CreateCampaignPage() {
  const { isConnected } = useAccount();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [duration, setDuration] = useState("7");
  const [step, setStep] = useState<"idle" | "creating" | "done">("idle");
  const [hash, setHash] = useState<string | null>(null);

  const handleLaunch = () => {
    if (!title || !reward) return;
    setStep("creating");
    // Mock: simulate campaign creation
    setTimeout(() => {
      setHash("0xabc123def456789");
      setStep("done");
    }, 2000);
  };

  const isValid = title.length > 0 && parseFloat(reward) > 0 && parseInt(duration) > 0;

  return (
    <div className="min-h-screen bg-[#08080f] p-6 pt-22 lg:p-8 lg:pt-24">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-white">
            Create Campaign
          </h1>
          <p className="text-gray-400">
            Launch a bounty for content creators
          </p>
        </div>

        {!isConnected ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-12 text-center backdrop-blur-sm">
            <Rocket className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-4 text-gray-400">
              Connect your wallet to create a campaign
            </p>
            <ConnectButton />
          </div>
        ) : step === "done" ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">
              Campaign Created!
            </h2>
            <p className="mb-4 text-gray-400">
              Your campaign is now live on Injective
            </p>
            {hash && (
              <a
                href={`https://explorer.injective.network/transaction/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
              >
                View on Explorer <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <div className="mt-6">
              <Link
                href="/"
                className="rounded-xl bg-white/[0.05] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
              >
                Back to Hub
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Campaign Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="XHunt Content Sprint"
                disabled={step !== "idle"}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:border-cyan-500/30 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what kind of content you're looking for..."
                rows={4}
                disabled={step !== "idle"}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:border-cyan-500/30 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Reward (USDC)
                </label>
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="1000"
                  disabled={step !== "idle"}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:border-cyan-500/30 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="7"
                  disabled={step !== "idle"}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:border-cyan-500/30 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Progress indicator */}
            {step !== "idle" && (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  <span className="text-gray-300">Creating campaign...</span>
                </div>
              </div>
            )}

            <button
              onClick={handleLaunch}
              disabled={!isValid || step !== "idle"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === "idle" ? (
                <>
                  <Rocket className="h-4 w-4" />
                  Launch Campaign
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-600">
              You&apos;ll approve USDC transfer to the bounty contract first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
