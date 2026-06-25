"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import confetti from "canvas-confetti";
import {
  Rocket,
  Loader2,
  Check,
  ExternalLink,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { formatUSDC } from "@/lib/injective";
import type { Address } from "viem";

// ---------------------------------------------------------------------------
// Zod Schema
// ---------------------------------------------------------------------------

const campaignSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters"),
  reward: z
    .string()
    .min(1, "Reward is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number")
    .refine((v) => Number(v) >= 10, "Minimum reward is 10 USDC")
    .refine((v) => Number(v) <= 1000000, "Maximum reward is 1,000,000 USDC"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Must be a positive number"
    )
    .refine((v) => Number(v) >= 1, "Minimum duration is 1 day")
    .refine((v) => Number(v) <= 365, "Maximum duration is 365 days"),
});

type CampaignFormData = {
  title: string;
  description: string;
  reward: string;
  duration: string;
};

interface FormErrors {
  title?: string;
  description?: string;
  reward?: string;
  duration?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CreateCampaignFormProps {
  sponsorAddress?: Address;
  onSuccess?: (campaignId: number) => void;
}

export function CreateCampaignForm({
  sponsorAddress,
  onSuccess,
}: CreateCampaignFormProps) {
  const [form, setForm] = useState<CampaignFormData>({
    title: "",
    description: "",
    reward: "",
    duration: "7",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<"idle" | "preview" | "creating" | "done">(
    "idle"
  );
  const [hash, setHash] = useState<string | null>(null);
  const [newCampaignId, setNewCampaignId] = useState<number | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Live validation on touched fields
  useEffect(() => {
    const result = campaignSchema.safeParse(form);
    const newErrors: FormErrors = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (touched[field] && !newErrors[field]) {
          newErrors[field] = issue.message;
        }
      }
    }
    setErrors(newErrors);
  }, [form, touched]);

  const handleChange = (
    field: keyof CampaignFormData,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof CampaignFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateAll = (): boolean => {
    const result = campaignSchema.safeParse(form);
    if (!result.success) {
      const newErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      }
      setErrors(newErrors);
      setTouched({
        title: true,
        description: true,
        reward: true,
        duration: true,
      });
      return false;
    }
    setErrors({});
    return true;
  };

  const handlePreview = () => {
    if (validateAll()) {
      setStep("preview");
    }
  };

  const handleLaunch = () => {
    setStep("creating");
    // Mock: simulate campaign creation
    setTimeout(() => {
      const mockId = Math.floor(Math.random() * 1000) + 100;
      setHash("0x" + Math.random().toString(16).slice(2, 18));
      setNewCampaignId(mockId);
      setStep("done");

      // Fire confetti
      const end = Date.now() + 2000;
      const colors = ["#22c55e", "#06b6d4", "#3b82f6", "#a855f7"];
      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      onSuccess?.(mockId);
    }, 2500);
  };

  const handleBackToEdit = () => {
    setStep("idle");
  };

  const isFormValid =
    campaignSchema.safeParse(form).success;

  // ---------------------------------------------------------------------------
  // Render: Success state
  // ---------------------------------------------------------------------------

  if (step === "done") {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Check className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">
          Campaign Created!
        </h2>
        <p className="mb-1 text-gray-400">
          Your campaign is now live on Injective
        </p>
        <p className="mb-4 text-sm text-gray-500">
          Campaign ID: #{newCampaignId}
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
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-white/[0.05] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            Back to Hub
          </Link>
          <Link
            href={`/campaign/${newCampaignId}`}
            className="rounded-xl bg-cyan-500/10 px-6 py-3 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20"
          >
            View Campaign
          </Link>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Preview state
  // ---------------------------------------------------------------------------

  if (step === "preview") {
    const endDate = new Date(
      Date.now() + Number(form.duration) * 86400 * 1000
    );
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">
              Campaign Preview
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Title
              </p>
              <p className="text-white font-medium">{form.title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Description
              </p>
              <p className="text-gray-300 text-sm">{form.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Reward Pool
                </p>
                <p className="text-2xl font-bold text-emerald-400">
                  {Number(form.reward).toLocaleString()} USDC
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Duration
                </p>
                <p className="text-2xl font-bold text-white">
                  {form.duration} days
                </p>
                <p className="text-xs text-gray-500">
                  Ends {endDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            {sponsorAddress && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Sponsor
                </p>
                <p className="font-mono text-sm text-gray-300">
                  {sponsorAddress.slice(0, 6)}...{sponsorAddress.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleBackToEdit}
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 font-medium text-gray-300 transition hover:bg-white/[0.06]"
          >
            Edit
          </button>
          <button
            onClick={handleLaunch}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-xl hover:shadow-cyan-500/30"
          >
            <Rocket className="h-4 w-4" />
            Confirm & Launch
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Creating state
  // ---------------------------------------------------------------------------

  if (step === "creating") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            <div className="text-center">
              <p className="text-lg font-semibold text-white">
                Creating your campaign...
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Please confirm the USDC transfer in your wallet
              </p>
            </div>
            <div className="w-full max-w-xs">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Form (idle)
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm text-gray-400">
          Campaign Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          placeholder="XHunt Content Sprint"
          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none ${
            errors.title
              ? "border-red-500/40 focus:border-red-500/60"
              : "border-white/[0.08] focus:border-cyan-500/30"
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.title}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-600">
          {form.title.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm text-gray-400">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          placeholder="Describe what kind of content you're looking for..."
          rows={4}
          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none ${
            errors.description
              ? "border-red-500/40 focus:border-red-500/60"
              : "border-white/[0.08] focus:border-cyan-500/30"
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-600">
          {form.description.length}/1000 characters
        </p>
      </div>

      {/* Reward & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Reward (USDC) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={form.reward}
            onChange={(e) => handleChange("reward", e.target.value)}
            onBlur={() => handleBlur("reward")}
            placeholder="1000"
            min="10"
            max="1000000"
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none ${
              errors.reward
                ? "border-red-500/40 focus:border-red-500/60"
                : "border-white/[0.08] focus:border-cyan-500/30"
            }`}
          />
          {errors.reward && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.reward}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Duration (days) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            onBlur={() => handleBlur("duration")}
            placeholder="7"
            min="1"
            max="365"
            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none ${
              errors.duration
                ? "border-red-500/40 focus:border-red-500/60"
                : "border-white/[0.08] focus:border-cyan-500/30"
            }`}
          />
          {errors.duration && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.duration}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handlePreview}
        disabled={!isFormValid}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Eye className="h-4 w-4" />
        Preview Campaign
      </button>

      <p className="text-center text-xs text-gray-600">
        You&apos;ll review your campaign before launching. USDC transfer
        approval required.
      </p>
    </div>
  );
}
