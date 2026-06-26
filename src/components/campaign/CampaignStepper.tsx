"use client";

import { useState } from "react";
import { FileText, Gift, Eye, Rocket } from "lucide-react";
import { Stepper, type Step } from "@/components/ui/Stepper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const CAMPAIGN_STEPS: Step[] = [
  {
    key: "info",
    label: "填写信息",
    description: "活动名称、描述与规则",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    key: "rewards",
    label: "设置奖励",
    description: "奖金池与分配方式",
    icon: <Gift className="h-4 w-4" />,
  },
  {
    key: "preview",
    label: "预览",
    description: "确认活动详情",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    key: "publish",
    label: "发布",
    description: "上链发布活动",
    icon: <Rocket className="h-4 w-4" />,
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CampaignStepperProps {
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

export function CampaignStepper({
  initialStep = 0,
  onComplete,
  className = "",
}: CampaignStepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const canGoBack = currentStep > 0;
  const isLastStep = currentStep === CAMPAIGN_STEPS.length - 1;

  function handleNext() {
    if (isLastStep) {
      onComplete?.();
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, CAMPAIGN_STEPS.length - 1));
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  return (
    <Card className={`border-white/[0.06] bg-white/[0.02] ${className}`}>
      <CardHeader>
        <CardTitle>创建活动</CardTitle>
        <CardDescription>按照以下步骤完成活动创建与发布</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Step indicator */}
        <Stepper
          steps={CAMPAIGN_STEPS}
          currentStep={currentStep}
          accentColor="cyan"
          className="mb-8"
        />

        {/* Step content placeholder */}
        <div className="min-h-[200px] rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-gray-400">
              {CAMPAIGN_STEPS[currentStep].icon &&
                /* clone with larger size */
                CAMPAIGN_STEPS[currentStep].icon}
            </div>
            <p className="text-sm font-medium text-white">
              {CAMPAIGN_STEPS[currentStep].label}
            </p>
            <p className="text-xs text-gray-500">
              {CAMPAIGN_STEPS[currentStep].description}
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
            {currentStep + 1} / {CAMPAIGN_STEPS.length}
          </p>

          <Button variant="primary" size="sm" onClick={handleNext}>
            {isLastStep ? "发布活动" : "下一步"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
