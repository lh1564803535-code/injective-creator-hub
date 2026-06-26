"use client";

import { useState } from "react";
import {
  Wallet,
  List,
  Trophy,
  ArrowLeftRight,
  BookOpen,
  Target,
} from "lucide-react";

interface Capability {
  icon: React.ElementType;
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: Wallet,
    emoji: "💰",
    title: "查余额",
    description: "查询钱包的 INJ 余额",
    color: "text-cyan-400",
  },
  {
    icon: List,
    emoji: "📋",
    title: "查活动",
    description: "查看所有进行中的活动",
    color: "text-blue-400",
  },
  {
    icon: Trophy,
    emoji: "🏆",
    title: "查排名",
    description: "查看创作者排名",
    color: "text-amber-400",
  },
  {
    icon: ArrowLeftRight,
    emoji: "🔄",
    title: "查交易",
    description: "查询交易状态",
    color: "text-emerald-400",
  },
  {
    icon: BookOpen,
    emoji: "📖",
    title: "解释概念",
    description: "用简单语言解释区块链",
    color: "text-purple-400",
  },
  {
    icon: Target,
    emoji: "🎯",
    title: "推荐活动",
    description: "推荐适合你的活动",
    color: "text-rose-400",
  },
];

interface AgentCapabilitiesProps {
  onCapabilityClick?: (title: string) => void;
}

export function AgentCapabilities({ onCapabilityClick }: AgentCapabilitiesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-white/[0.02] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10">
          <span className="text-sm">🤖</span>
        </div>
        <h3 className="text-sm font-semibold text-white">AI Agent 能力</h3>
        <span className="ml-auto text-[10px] text-gray-600">点击试试</span>
      </div>

      {/* Capabilities grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CAPABILITIES.map((cap, index) => {
          const Icon = cap.icon;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={cap.title}
              onClick={() => onCapabilityClick?.(cap.title)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                isHovered
                  ? "border-white/[0.12] bg-white/[0.06] shadow-lg shadow-cyan-500/5"
                  : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08]"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] transition-all ${cap.color} ${
                  isHovered ? "scale-110" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white">
                  {cap.emoji} {cap.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-gray-500">
                  {cap.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
