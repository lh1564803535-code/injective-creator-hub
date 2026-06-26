"use client";

import { useState, useCallback } from "react";
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignSurveyProps {
  campaignId: number;
  campaignTitle: string;
  onSubmit?: (data: CampaignSurveyData) => void;
  className?: string;
}

export interface CampaignSurveyData {
  campaignId: number;
  overallRating: number;
  experienceRating: string;
  rewardFairness: string;
  recommendToOthers: string;
  bestAspect: string;
  improvementSuggestions: string;
}

// ---------------------------------------------------------------------------
// Star Rating
// ---------------------------------------------------------------------------

function StarRating({
  value,
  onChange,
  max = 5,
}: {
  value: number;
  onChange: (val: number) => void;
  max?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-600"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-400">{value}/5</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Option Card
// ---------------------------------------------------------------------------

function OptionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
        selected
          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
          : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/[0.12] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CampaignSurvey
// ---------------------------------------------------------------------------

export function CampaignSurvey({
  campaignId,
  campaignTitle,
  onSubmit,
  className = "",
}: CampaignSurveyProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [overallRating, setOverallRating] = useState(0);
  const [experienceRating, setExperienceRating] = useState("");
  const [rewardFairness, setRewardFairness] = useState("");
  const [recommendToOthers, setRecommendToOthers] = useState("");
  const [bestAspect, setBestAspect] = useState("");
  const [improvementSuggestions, setImprovementSuggestions] = useState("");

  const steps = [
    { label: "Overall Rating", valid: overallRating > 0 },
    { label: "Experience", valid: experienceRating.length > 0 },
    { label: "Rewards", valid: rewardFairness.length > 0 },
    { label: "Recommendation", valid: recommendToOthers.length > 0 },
    { label: "Feedback", valid: true },
  ];

  const canProceed = steps[step]?.valid ?? false;
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else if (canProceed) {
      setStep((s) => s + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit?.({
      campaignId,
      overallRating,
      experienceRating,
      rewardFairness,
      recommendToOthers,
      bestAspect,
      improvementSuggestions,
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center backdrop-blur-sm ${className}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Feedback Submitted!</h3>
        <p className="mt-2 text-sm text-gray-400">
          Thank you for sharing your experience with <span className="text-cyan-300">{campaignTitle}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-white/[0.04] px-5 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Campaign Feedback</h3>
        </div>
        <p className="mt-1 text-xs text-gray-500">{campaignTitle}</p>

        {/* Progress dots */}
        <div className="mt-3 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full transition-colors ${
                  i < step
                    ? "bg-cyan-400"
                    : i === step
                      ? "bg-cyan-400 ring-2 ring-cyan-400/30"
                      : "bg-white/[0.1]"
                }`}
              />
              {i < steps.length - 1 && (
                <div className={`h-px w-6 ${i < step ? "bg-cyan-400/30" : "bg-white/[0.06]"}`} />
              )}
            </div>
          ))}
          <span className="ml-2 text-xs text-gray-500">
            Step {step + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="p-5 min-h-[200px]">
        {/* Step 0: Overall Rating */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-white">How would you rate this campaign overall?</p>
              <p className="mt-1 text-xs text-gray-500">1 = Poor, 5 = Excellent</p>
            </div>
            <div className="flex justify-center py-4">
              <StarRating value={overallRating} onChange={setOverallRating} />
            </div>
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-white">How was your participation experience?</p>
            <div className="grid grid-cols-2 gap-3">
              {["Very Easy", "Easy", "Somewhat Difficult", "Difficult"].map((opt) => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={experienceRating === opt}
                  onClick={() => setExperienceRating(opt)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Reward Fairness */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-white">How fair were the campaign rewards?</p>
            <div className="grid grid-cols-2 gap-3">
              {["Very Fair", "Fair", "Below Expectations", "Unfair"].map((opt) => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={rewardFairness === opt}
                  onClick={() => setRewardFairness(opt)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Recommend */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-cyan-400" />
              <p className="text-sm font-medium text-white">Would you recommend this campaign to others?</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Definitely", "Maybe", "No"].map((opt) => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={recommendToOthers === opt}
                  onClick={() => setRecommendToOthers(opt)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Open Feedback */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white">
                What was the best aspect of this campaign?
              </label>
              <textarea
                value={bestAspect}
                onChange={(e) => setBestAspect(e.target.value)}
                placeholder="Share what you liked most..."
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white">
                Any suggestions for improvement?
              </label>
              <textarea
                value={improvementSuggestions}
                onChange={(e) => setImprovementSuggestions(e.target.value)}
                placeholder="How can we make it better..."
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-5 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleNext}
          disabled={!canProceed}
          loading={isSubmitting}
        >
          {isLastStep ? (
            <>
              <Send className="h-3.5 w-3.5" />
              Submit
            </>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
}
