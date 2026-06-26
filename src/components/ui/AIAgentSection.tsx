"use client";

import { useState, useEffect } from "react";
import { Bot, Sparkles, ArrowRight, Brain, Workflow, Shield } from "lucide-react";

// ---------------------------------------------------------------------------
// Typewriter for the agent "thinking" lines
// ---------------------------------------------------------------------------

function ThinkingLine({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [started, text]);

  if (!started && delay > 0) return null;

  return (
    <div className="flex items-start gap-2 font-mono text-xs">
      <span className="mt-0.5 text-emerald-400">&gt;</span>
      <span className="text-gray-400">
        {displayed}
        {displayed.length < text.length && started && (
          <span className="animate-pulse text-cyan-400">|</span>
        )}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature card
// ---------------------------------------------------------------------------

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  gradient: string;
}) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} opacity-80 transition-all group-hover:scale-110 group-hover:opacity-100`}
      >
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <h4 className="mb-1 text-sm font-semibold text-white">{title}</h4>
      <p className="text-xs leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AIAgentSection() {
  const features = [
    {
      icon: Brain,
      title: "Smart Campaign Matching",
      description:
        "AI agents analyze creator skills and past performance to recommend the highest-ROI campaigns to join.",
      color: "text-cyan-300",
      gradient: "from-cyan-500/20 to-blue-600/20",
    },
    {
      icon: Workflow,
      title: "Automated Submissions",
      description:
        "Agents draft content, optimize timing, and submit on behalf of creators — with human approval gates.",
      color: "text-amber-300",
      gradient: "from-amber-500/20 to-orange-600/20",
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description:
        "On-chain AI models flag suspicious voting patterns and bot submissions before settlement.",
      color: "text-emerald-300",
      gradient: "from-emerald-500/20 to-green-600/20",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 lg:p-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20">
            <Bot className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                AI Agent Integration
              </h3>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400 border border-cyan-500/20">
                Coming Soon
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Powered by Injective&apos;s iAgent SDK — autonomous AI agents that
              interact with Creator Hub on-chain.
            </p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        {/* Agent "thinking" console */}
        <div className="mb-6 rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-gray-400">
              Agent Console
            </span>
            <span className="ml-auto flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-500">Active</span>
            </span>
          </div>
          <div className="space-y-2">
            <ThinkingLine
              text="Analyzing 8 active campaigns for optimal creator match..."
              delay={0}
            />
            <ThinkingLine
              text="Found 3 high-fit campaigns based on creator history and engagement patterns."
              delay={2000}
            />
            <ThinkingLine
              text="Drafting submission for 'XHunt Content Sprint' — estimated reward: 850 USDC"
              delay={4500}
            />
            <ThinkingLine
              text="Awaiting creator approval before on-chain submission..."
              delay={7000}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
          <p className="text-xs text-gray-500">
            iAgent SDK is open-source and maintained by the Injective Foundation.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 transition group-hover:gap-2">
            Learn more
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
