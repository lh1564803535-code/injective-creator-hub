"use client";

interface TimelineItem {
  title: string;
  description?: string;
  time?: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className = "" }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/[0.06]" />

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Dot */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white/[0.1] bg-[#1a1a1a]">
              {item.icon || (
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">{item.title}</h4>
                {item.time && (
                  <span className="text-[10px] text-gray-500">{item.time}</span>
                )}
              </div>
              {item.description && (
                <p className="mt-1 text-xs text-gray-400">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
