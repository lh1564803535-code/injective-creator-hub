"use client";

import { cn } from "@/lib/utils";

interface SkeletonBaseProps {
  className?: string;
  animate?: boolean;
}

function SkeletonPulse({ className, animate = true }: SkeletonBaseProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-white/[0.06]",
        animate && "animate-pulse",
        className
      )}
    />
  );
}

// 卡片骨架屏
interface SkeletonCardProps {
  lines?: number;
  hasHeader?: boolean;
  hasFooter?: boolean;
  className?: string;
}

export function SkeletonCard({
  lines = 3,
  hasHeader = true,
  hasFooter = false,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4",
        className
      )}
    >
      {hasHeader && (
        <div className="flex items-center space-x-4">
          <SkeletonPulse className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <SkeletonPulse className="h-4 w-[40%]" />
            <SkeletonPulse className="h-3 w-[60%]" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonPulse
            key={i}
            className={cn("h-3", i === lines - 1 ? "w-[70%]" : "w-full")}
          />
        ))}
      </div>

      {hasFooter && (
        <div className="flex justify-between pt-2">
          <SkeletonPulse className="h-8 w-20" />
          <SkeletonPulse className="h-8 w-24" />
        </div>
      )}
    </div>
  );
}

// 列表骨架屏
interface SkeletonListProps {
  count?: number;
  hasAvatar?: boolean;
  hasAction?: boolean;
  className?: string;
}

export function SkeletonList({
  count = 5,
  hasAvatar = true,
  hasAction = false,
  className,
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
        >
          <div className="flex items-center space-x-4 flex-1">
            {hasAvatar && (
              <SkeletonPulse className="h-10 w-10 rounded-full flex-shrink-0" />
            )}
            <div className="space-y-2 flex-1">
              <SkeletonPulse className="h-4 w-[50%]" />
              <SkeletonPulse className="h-3 w-[70%]" />
            </div>
          </div>

          {hasAction && <SkeletonPulse className="h-8 w-20 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

// 表格骨架屏
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className,
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {hasHeader && (
        <div className="flex gap-4 p-4 border-b border-white/[0.06]">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonPulse
              key={i}
              className="h-4 flex-1"
              style={{ maxWidth: `${100 / columns}%` }}
            />
          ))}
        </div>
      )}

      <div className="divide-y divide-white/[0.06]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonPulse
                key={colIndex}
                className={cn(
                  "h-4 flex-1",
                  colIndex === 0 ? "w-[30%]" : "w-[20%]"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 统计卡片骨架屏
export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-2",
        className
      )}
    >
      <SkeletonPulse className="h-3 w-[40%]" />
      <SkeletonPulse className="h-8 w-[60%]" />
      <SkeletonPulse className="h-3 w-[30%]" />
    </div>
  );
}

// 网格骨架屏
interface SkeletonGridProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  renderItem?: (index: number) => React.ReactNode;
  className?: string;
}

export function SkeletonGrid({
  count = 6,
  columns = 3,
  renderItem,
  className,
}: SkeletonGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) =>
        renderItem ? renderItem(i) : <SkeletonCard key={i} />
      )}
    </div>
  );
}

// 导出基础组件供自定义使用
export { SkeletonPulse };
