"use client";

import { useState, useCallback } from "react";
import {
  Lightbulb,
  Gauge,
  Palette,
  Coins,
  MessageCircle,
  Send,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreatorSurveyProps {
  creatorAddress?: string;
  onSubmit?: (data: CreatorSurveyData) => void;
  className?: string;
}

export interface CreatorSurveyData {
  creatorNeeds: string[];
  platformImprovements: string;
  featureRequests: string;
  overallSatisfaction: number;
  additionalComments: string;
}

// ---------------------------------------------------------------------------
// Category Card
// ---------------------------------------------------------------------------

function CategoryCard({
  icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
        selected
          ? "border-cyan-500/30 bg-cyan-500/10"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
          selected ? "bg-cyan-500/20 text-cyan-300" : "bg-white/[0.04] text-gray-500"
        }`}
      >
        {icon}
      </div>
      <div>
        <span
          className={`text-sm font-medium transition ${
            selected ? "text-cyan-300" : "text-white"
          }`}
        >
          {label}
        </span>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Satisfaction Slider
// ---------------------------------------------------------------------------

function SatisfactionSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const labels = ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {labels.map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className={`h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center ${
                value === i + 1
                  ? "border-cyan-400 bg-cyan-400/20 scale-110"
                  : value > i
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : "border-white/[0.1] bg-white/[0.02]"
              }`}
            >
              {value === i + 1 && (
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              )}
            </div>
            <span
              className={`text-[10px] leading-tight text-center max-w-[60px] ${
                value === i + 1 ? "text-cyan-300" : "text-gray-600"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
      {/* Track bar */}
      <div className="h-1.5 rounded-full bg-white/[0.06]">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CreatorSurvey
// ---------------------------------------------------------------------------

export function CreatorSurvey({
  creatorAddress,
  onSubmit,
  className = "",
}: CreatorSurveyProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [platformImprovements, setPlatformImprovements] = useState("");
  const [featureRequests, setFeatureRequests] = useState("");
  const [overallSatisfaction, setOverallSatisfaction] = useState(0);
  const [additionalComments, setAdditionalComments] = useState("");

  const needCategories = [
    {
      id: "analytics",
      icon: <Gauge className="h-4 w-4" />,
      label: "Better Analytics",
      description: "More detailed performance metrics and insights",
    },
    {
      id: "discovery",
      icon: <Lightbulb className="h-4 w-4" />,
      label: "Campaign Discovery",
      description: "Easier ways to find relevant campaigns",
    },
    {
      id: "customization",
      icon: <Palette className="h-4 w-4" />,
      label: "Profile Customization",
      description: "More options to showcase your work",
    },
    {
      id: "payments",
      icon: <Coins className="h-4 w-4" />,
      label: "Faster Payments",
      description: "Quicker settlement and payout options",
    },
    {
      id: "communication",
      icon: <MessageCircle className="h-4 w-4" />,
      label: "Creator Community",
      description: "Connect and collaborate with other creators",
    },
  ];

  const toggleNeed = (id: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const steps = [
    { label: "Needs", valid: selectedNeeds.length > 0 },
    { label: "Improvements", valid: true },
    { label: "Satisfaction", valid: overallSatisfaction > 0 },
    { label: "Comments", valid: true },
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
      creatorNeeds: selectedNeeds,
      platformImprovements,
      featureRequests,
      overallSatisfaction,
      additionalComments,
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
        <h3 className="text-lg font-semibold text-white">Survey Complete!</h3>
        <p className="mt-2 text-sm text-gray-400">
          Your feedback helps us build a better platform for creators.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-white/[0.04] px-5 py-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Creator Needs Survey</h3>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Help us understand what you need to succeed
        </p>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full transition-colors ${
                  i < step
                    ? "bg-amber-400"
                    : i === step
                      ? "bg-amber-400 ring-2 ring-amber-400/30"
                      : "bg-white/[0.1]"
                }`}
              />
              {i < steps.length - 1 && (
                <div className={`h-px w-6 ${i < step ? "bg-amber-400/30" : "bg-white/[0.06]"}`} />
              )}
            </div>
          ))}
          <span className="ml-2 text-xs text-gray-500">
            Step {step + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="p-5 min-h-[220px]">
        {/* Step 0: Creator Needs */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-white">
                What do you need most as a creator?
              </p>
              <p className="mt-1 text-xs text-gray-500">Select all that apply</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {needCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  icon={cat.icon}
                  label={cat.label}
                  description={cat.description}
                  selected={selectedNeeds.includes(cat.id)}
                  onClick={() => toggleNeed(cat.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Improvements */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white">
                What improvements would you like to see on the platform?
              </label>
              <textarea
                value={platformImprovements}
                onChange={(e) => setPlatformImprovements(e.target.value)}
                placeholder="Describe the improvements you'd like..."
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white">
                Any specific feature requests?
              </label>
              <textarea
                value={featureRequests}
                onChange={(e) => setFeatureRequests(e.target.value)}
                placeholder="Tell us about features you'd love to have..."
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
              />
            </div>
          </div>
        )}

        {/* Step 2: Satisfaction */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-white">
                How satisfied are you with the platform overall?
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Select your satisfaction level
              </p>
            </div>
            <SatisfactionSlider
              value={overallSatisfaction}
              onChange={setOverallSatisfaction}
            />
          </div>
        )}

        {/* Step 3: Comments */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white">
                Any additional comments or suggestions?
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Share anything else on your mind
              </p>
            </div>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Your thoughts..."
              rows={5}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
            />
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
            <>
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
