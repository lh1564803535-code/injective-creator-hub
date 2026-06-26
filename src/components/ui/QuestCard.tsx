"use client";

import { Target, Clock, Star, CheckCircle } from "lucide-react";

interface QuestCardProps {
  title: string;
  description: string;
  reward: string;
  progress: number;
  maxProgress: number;
  deadline?: string;
  difficulty?: "easy" | "medium" | "hard";
  status?: "active" | "completed" | "expired";
  className?: string;
}

const difficultyConfig = {
  easy: { color: "text-emerald-400 bg-emerald-500/10", label: "Easy" },
  medium: { color: "text-amber-400 bg-amber-500/10", label: "Medium" },
  hard: { color: "text-red-400 bg-red-500/10", label: "Hard" },
};

const statusConfig = {
  active: { color: "text-cyan-400", icon: Target },
  completed: { color: "text-emerald-400", icon: CheckCircle },
  expired: { color: "text-gray-400", icon: Clock },
};

export function QuestCard({
  title,
  description,
  reward,
  progress,
  maxProgress,
  deadline,
  difficulty,
  status = "active",
  className = "",
}: QuestCardProps) {
  const percentage = Math.min((progress / maxProgress) * 100, 100);
  const diffConfig = difficulty ? difficultyConfig[difficulty] : null;
  const statusConf = statusConfig[status];
  const StatusIcon = statusConf.icon;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {diffConfig && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${diffConfig.color}`}>
              {diffConfig.label}
            </span>
          )}
          <StatusIcon className={`h-4 w-4 ${statusConf.color}`} />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="text-gray-400">{progress}/{maxProgress}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-sm font-medium text-amber-400">{reward}</span>
        </div>
        {deadline && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{deadline}</span>
          </div>
        )}
      </div>
    </div>
  );
}
