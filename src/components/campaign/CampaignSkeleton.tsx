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

// 活动卡片骨架屏
interface CampaignCardSkeletonProps {
  className?: string;
}

export function CampaignCardSkeleton({ className }: CampaignCardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden",
        className
      )}
    >
      {/* 封面图片区域 */}
      <SkeletonPulse className="h-48 w-full rounded-none" />

      <div className="p-6 space-y-4">
        {/* 标题和状态 */}
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <SkeletonPulse className="h-5 w-[70%]" />
            <SkeletonPulse className="h-3 w-[40%]" />
          </div>
          <SkeletonPulse className="h-6 w-16 rounded-full flex-shrink-0" />
        </div>

        {/* 描述 */}
        <div className="space-y-2">
          <SkeletonPulse className="h-3 w-full" />
          <SkeletonPulse className="h-3 w-[80%]" />
        </div>

        {/* 奖励信息 */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <div className="flex items-center space-x-2">
            <SkeletonPulse className="h-5 w-5 rounded-full" />
            <SkeletonPulse className="h-4 w-20" />
          </div>
          <SkeletonPulse className="h-4 w-24" />
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-3 w-12" />
          </div>
          <SkeletonPulse className="h-2 w-full rounded-full" />
        </div>

        {/* 参与者头像 */}
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonPulse
                key={i}
                className="h-7 w-7 rounded-full border-2 border-background"
              />
            ))}
          </div>
          <SkeletonPulse className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

// 活动列表项骨架屏
interface CampaignListItemSkeletonProps {
  className?: string;
}

export function CampaignListItemSkeleton({
  className,
}: CampaignListItemSkeletonProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]",
        className
      )}
    >
      <div className="flex items-center space-x-4 flex-1">
        {/* 图标 */}
        <SkeletonPulse className="h-12 w-12 rounded-lg flex-shrink-0" />

        <div className="space-y-2 flex-1 min-w-0">
          {/* 标题 */}
          <SkeletonPulse className="h-4 w-[40%]" />
          {/* 描述 */}
          <SkeletonPulse className="h-3 w-[60%]" />
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* 奖励 */}
        <div className="hidden md:block text-right space-y-1">
          <SkeletonPulse className="h-4 w-16" />
          <SkeletonPulse className="h-3 w-12" />
        </div>

        {/* 状态 */}
        <SkeletonPulse className="h-6 w-16 rounded-full" />

        {/* 操作按钮 */}
        <SkeletonPulse className="h-8 w-20" />
      </div>
    </div>
  );
}

// 活动网格骨架屏
interface CampaignGridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function CampaignGridSkeleton({
  count = 6,
  columns = 3,
  className,
}: CampaignGridSkeletonProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CampaignCardSkeleton key={i} />
      ))}
    </div>
  );
}

// 活动列表骨架屏
interface CampaignListSkeletonProps {
  count?: number;
  className?: string;
}

export function CampaignListSkeleton({
  count = 5,
  className,
}: CampaignListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CampaignListItemSkeleton key={i} />
      ))}
    </div>
  );
}

// 活动筛选器骨架屏
export function CampaignFiltersSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]",
        className
      )}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonPulse key={i} className="h-9 w-24 rounded-lg" />
      ))}
      <div className="flex-1" />
      <SkeletonPulse className="h-9 w-32 rounded-lg" />
    </div>
  );
}

// 活动详情骨架屏
export function CampaignDetailsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* 头部 */}
      <div className="space-y-4">
        <SkeletonPulse className="h-64 w-full rounded-2xl" />
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <SkeletonPulse className="h-8 w-[50%]" />
            <SkeletonPulse className="h-4 w-[30%]" />
          </div>
          <SkeletonPulse className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex gap-4 border-b border-white/[0.06] pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-8 w-20" />
        ))}
      </div>

      {/* 内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-[90%]" />
          <SkeletonPulse className="h-4 w-[95%]" />
          <SkeletonPulse className="h-4 w-[60%]" />
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <SkeletonPulse className="h-5 w-[40%]" />
            <SkeletonPulse className="h-8 w-full" />
            <SkeletonPulse className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
