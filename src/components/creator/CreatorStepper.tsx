"use client";

import { useState } from "react";
import { Wallet, Twitter, UserCircle } from "lucide-react";
import { Stepper, type Step } from "@/components/ui/Stepper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const CREATOR_STEPS: Step[] = [
  {
    key: "wallet",
    label: "连接钱包",
    description: "连接 Injective 钱包以开始注册",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    key: "twitter",
    label: "绑定 Twitter",
    description: "关联你的 Twitter 账号用于身份验证",
    icon: <Twitter className="h-4 w-4" />,
  },
  {
    key: "profile",
    label: "完善资料",
    description: "填写个人简介与创作领域",
    icon: <UserCircle className="h-4 w-4" />,
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CreatorStepperProps {
  /** Override initial step (0-based) */
  initialStep?: number;
  /** Called when the user completes all steps */
  onComplete?: () => void;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorStepper({
  initialStep = 0,
  onComplete,
  className = "",
}: CreatorStepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const canGoBack = currentStep > 0;
  const isLastStep = currentStep === CREATOR_STEPS.length - 1;

  function handleNext() {
    if (isLastStep) {
      onComplete?.();
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, CREATOR_STEPS.length - 1));
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  return (
    <Card className={`border-white/[0.06] bg-white/[0.02] ${className}`}>
      <CardHeader>
        <CardTitle>创作者注册</CardTitle>
        <CardDescription>三步完成创作者身份注册</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Step indicator */}
        <Stepper
          steps={CREATOR_STEPS}
          currentStep={currentStep}
          accentColor="emerald"
          className="mb-8"
        />

        {/* Step content placeholder */}
        <div className="min-h-[200px] rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-gray-400">
              {CREATOR_STEPS[currentStep].icon}
            </div>
            <p className="text-sm font-medium text-white">
              {CREATOR_STEPS[currentStep].label}
            </p>
            <p className="text-xs text-gray-500">
              {CREATOR_STEPS[currentStep].description}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={!canGoBack}
          >
            上一步
          </Button>

          <p className="text-xs text-gray-500">
            {currentStep + 1} / {CREATOR_STEPS.length}
          </p>

          <Button variant="primary" size="sm" onClick={handleNext}>
            {isLastStep ? "完成注册" : "下一步"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
