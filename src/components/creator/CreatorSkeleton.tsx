"use client";

import { cn } from "@/lib/utils";

interface SkeletonBaseProps {
  className?: string;
}

function SkeletonPulse({ className }: SkeletonBaseProps) {
  return (
    <div
      className={cn("rounded-md bg-white/[0.06] animate-pulse", className)}
    />
  );
}

// 创作者卡片骨架屏
interface CreatorCardSkeletonProps {
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function CreatorCardSkeleton({
  variant = "default",
  className,
}: CreatorCardSkeletonProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center space-x-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]",
          className
        )}
      >
        <SkeletonPulse className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="space-y-1 flex-1 min-w-0">
          <SkeletonPulse className="h-4 w-[60%]" />
          <SkeletonPulse className="h-3 w-[40%]" />
        </div>
        <SkeletonPulse className="h-6 w-12 flex-shrink-0" />
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={cn(
          "relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden",
          className
        )}
      >
        {/* 背景图 */}
        <SkeletonPulse className="h-32 w-full rounded-none" />

        <div className="px-6 pb-6 -mt-12">
          {/* 头像 */}
          <SkeletonPulse className="h-20 w-20 rounded-full border-4 border-background" />

          <div className="mt-4 space-y-3">
            <div className="space-y-1">
              <SkeletonPulse className="h-5 w-[40%]" />
              <SkeletonPulse className="h-3 w-[30%]" />
            </div>

            {/* 标签 */}
            <div className="flex gap-2">
              <SkeletonPulse className="h-6 w-16 rounded-full" />
              <SkeletonPulse className="h-6 w-20 rounded-full" />
            </div>

            {/* 统计 */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/[0.06]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-1">
                  <SkeletonPulse className="h-5 w-12 mx-auto" />
                  <SkeletonPulse className="h-3 w-8 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 默认卡片
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <SkeletonPulse className="h-14 w-14 rounded-full flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <SkeletonPulse className="h-5 w-[50%]" />
          <SkeletonPulse className="h-3 w-[30%]" />
        </div>
        <SkeletonPulse className="h-8 w-20" />
      </div>

      {/* 标签 */}
      <div className="flex gap-2">
        <SkeletonPulse className="h-6 w-16 rounded-full" />
        <SkeletonPulse className="h-6 w-20 rounded-full" />
        <SkeletonPulse className="h-6 w-14 rounded-full" />
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center space-y-1">
            <SkeletonPulse className="h-5 w-12 mx-auto" />
            <SkeletonPulse className="h-3 w-8 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 排行榜行骨架屏
interface LeaderboardRowSkeletonProps {
  rank?: number;
  className?: string;
}

export function LeaderboardRowSkeleton({
  rank,
  className,
}: LeaderboardRowSkeletonProps) {
  const isTopThree = rank !== undefined && rank <= 3;

  return (
    <div
      className={cn(
        "flex items-center p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]",
        isTopThree && "border-primary/20 bg-primary/[0.02]",
        className
      )}
    >
      {/* 排名 */}
      <div className="w-12 flex-shrink-0">
        {rank !== undefined ? (
          <SkeletonPulse className="h-6 w-8 mx-auto" />
        ) : (
          <SkeletonPulse className="h-6 w-8 mx-auto" />
        )}
      </div>

      {/* 用户信息 */}
      <div className="flex items-center space-x-3 flex-1 ml-4">
        <SkeletonPulse className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="space-y-1">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-3 w-16" />
        </div>
      </div>

      {/* 统计数据 */}
      <div className="hidden md:flex items-center space-x-8">
        <div className="text-right space-y-1">
          <SkeletonPulse className="h-4 w-16" />
          <SkeletonPulse className="h-3 w-10" />
        </div>
        <div className="text-right space-y-1">
          <SkeletonPulse className="h-4 w-12" />
          <SkeletonPulse className="h-3 w-8" />
        </div>
      </div>

      {/* 分数 */}
      <div className="ml-4 flex-shrink-0">
        <SkeletonPulse className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

// 排行榜骨架屏
interface LeaderboardSkeletonProps {
  count?: number;
  showHeader?: boolean;
  className?: string;
}

export function LeaderboardSkeleton({
  count = 10,
  showHeader = true,
  className,
}: LeaderboardSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {showHeader && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02]">
          <div className="flex items-center space-x-4">
            <SkeletonPulse className="h-4 w-12" />
            <SkeletonPulse className="h-4 w-24" />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <SkeletonPulse className="h-4 w-16" />
            <SkeletonPulse className="h-4 w-12" />
          </div>
          <SkeletonPulse className="h-4 w-16" />
        </div>
      )}

      {Array.from({ length: count }).map((_, i) => (
        <LeaderboardRowSkeleton key={i} rank={i + 1} />
      ))}
    </div>
  );
}

// 创作者网格骨架屏
interface CreatorGridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function CreatorGridSkeleton({
  count = 6,
  columns = 3,
  variant = "default",
  className,
}: CreatorGridSkeletonProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CreatorCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}

// 创作者资料页骨架屏
export function CreatorProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* 封面和头像 */}
      <div className="relative">
        <SkeletonPulse className="h-48 w-full rounded-2xl" />
        <div className="absolute -bottom-12 left-6">
          <SkeletonPulse className="h-24 w-24 rounded-full border-4 border-background" />
        </div>
      </div>

      {/* 信息区 */}
      <div className="pt-12 flex justify-between items-start">
        <div className="space-y-2">
          <SkeletonPulse className="h-7 w-40" />
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <SkeletonPulse className="h-10 w-24 rounded-lg" />
          <SkeletonPulse className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* 标签和链接 */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2"
          >
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-6 w-20" />
          </div>
        ))}
      </div>

      {/* 标签页内容 */}
      <div className="flex gap-4 border-b border-white/[0.06] pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-8 w-20" />
        ))}
      </div>

      <SkeletonGridSkeleton count={3} columns={3} />
    </div>
  );
}

// 内部使用的网格骨架
function SkeletonGridSkeleton({
  count = 3,
  columns = 3,
}: {
  count?: number;
  columns?: number;
}) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        gridCols[columns as keyof typeof gridCols] || "grid-cols-3"
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3"
        >
          <SkeletonPulse className="h-32 w-full rounded-lg" />
          <SkeletonPulse className="h-4 w-[60%]" />
          <SkeletonPulse className="h-3 w-[40%]" />
        </div>
      ))}
    </div>
  );
}
