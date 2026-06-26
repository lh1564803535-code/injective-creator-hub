"use client";

import { useState } from "react";
import {
  Wallet,
  Compass,
  PenTool,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
} from "lucide-react";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: typeof Wallet;
  color: string;
  bg: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Connect Wallet",
    description: "Link your Web3 wallet to get started",
    icon: Wallet,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    detail:
      "We support MetaMask, WalletConnect, and other popular wallets. Your wallet is used to receive USDC rewards directly on-chain.",
  },
  {
    id: 2,
    title: "Bind Twitter",
    description: "Connect your Twitter for social verification",
    icon: Twitter,
    color: "text-[#1DA1F2]",
    bg: "bg-[#1DA1F2]/15",
    detail:
      "Linking your Twitter helps campaigns verify your content and reach. Your handle will be displayed on submissions.",
  },
  {
    id: 3,
    title: "Browse Campaigns",
    description: "Explore active campaigns that match your skills",
    icon: Compass,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    detail:
      "Filter campaigns by category (art, music, memes, gaming) and find ones that fit your creative style. Each campaign shows its reward pool and deadline.",
  },
  {
    id: 4,
    title: "Submit & Earn",
    description: "Create content, get votes, and earn USDC",
    icon: PenTool,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    detail:
      "Submit your creative work to campaigns. The community votes on submissions, and winners receive USDC rewards directly to their wallet.",
  },
];

interface OnboardingFlowProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = () => {
    if (isLast) {
      onComplete?.();
      setDismissed(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  const handleSkip = () => {
    onSkip?.();
    setDismissed(true);
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Getting Started</h3>
        </div>
        <button
          onClick={handleSkip}
          className="flex items-center gap-1 text-xs text-gray-500 transition hover:text-gray-300"
        >
          Skip <X className="h-3 w-3" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="mb-6 flex items-center justify-between">
        {STEPS.map((s, i) => {
          const StepIcon = s.icon;
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? "bg-emerald-500/15"
                    : isActive
                    ? s.bg
                    : "bg-white/[0.04]"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <StepIcon
                    className={`h-4 w-4 ${
                      isActive ? s.color : "text-gray-600"
                    }`}
                  />
                )}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 h-0.5 w-6 sm:w-10 ${
                    i < currentStep ? "bg-emerald-500/30" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="mb-6 rounded-xl border border-white/[0.04] bg-white/[0.02] p-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${step.bg}`}
          >
            <Icon className={`h-6 w-6 ${step.color}`} />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white">{step.title}</h4>
            <p className="mt-0.5 text-sm text-gray-400">{step.description}</p>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              {step.detail}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-400 transition hover:bg-white/[0.06] disabled:invisible"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          className={`flex items-center gap-1 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all ${
            isLast
              ? "bg-emerald-500 hover:bg-emerald-400"
              : "bg-cyan-500 hover:bg-cyan-400"
          }`}
        >
          {isLast ? "Get Started" : "Next"}
          {!isLast && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
