"use client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GanttTaskStatus = "completed" | "in-progress" | "pending";

export interface GanttTask {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  status: GanttTaskStatus;
  color?: string;
}

export type GanttTimeScale = "day" | "week" | "month";

interface GanttProps {
  tasks: GanttTask[];
  timeScale?: GanttTimeScale;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusColors: Record<GanttTaskStatus, { bar: string; text: string }> = {
  completed: {
    bar: "bg-emerald-500/70",
    text: "text-emerald-400",
  },
  "in-progress": {
    bar: "bg-cyan-500/70",
    text: "text-cyan-400",
  },
  pending: {
    bar: "bg-white/[0.08]",
    text: "text-gray-500",
  },
};

function getTimelineRange(tasks: GanttTask[]): { min: Date; max: Date } {
  if (tasks.length === 0) {
    const now = new Date();
    return { min: now, max: new Date(now.getTime() + 86400000 * 7) };
  }
  let min = tasks[0].startDate;
  let max = tasks[0].endDate;
  for (const t of tasks) {
    if (t.startDate < min) min = t.startDate;
    if (t.endDate > max) max = t.endDate;
  }
  // Add 10% padding on each side
  const range = max.getTime() - min.getTime();
  const pad = Math.max(range * 0.1, 86400000); // at least 1 day
  return {
    min: new Date(min.getTime() - pad),
    max: new Date(max.getTime() + pad),
  };
}

function generateTimeHeaders(
  min: Date,
  max: Date,
  scale: GanttTimeScale
): { label: string; offset: number }[] {
  const totalMs = max.getTime() - min.getTime();
  const headers: { label: string; offset: number }[] = [];

  const current = new Date(min);
  // Snap to start of day
  current.setHours(0, 0, 0, 0);

  while (current <= max) {
    const offset = ((current.getTime() - min.getTime()) / totalMs) * 100;
    let label: string;

    if (scale === "day") {
      label = `${current.getMonth() + 1}/${current.getDate()}`;
    } else if (scale === "week") {
      label = `W${getWeekNumber(current)}`;
    } else {
      label = current.toLocaleString("default", { month: "short" });
    }

    headers.push({ label, offset: Math.max(0, offset) });

    if (scale === "day") {
      current.setDate(current.getDate() + 1);
    } else if (scale === "week") {
      current.setDate(current.getDate() + 7);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
  }

  return headers;
}

function getWeekNumber(d: Date): number {
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(
    ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
  );
}

function getBarStyle(
  task: GanttTask,
  min: Date,
  max: Date
): { left: string; width: string } {
  const totalMs = max.getTime() - min.getTime();
  const left = ((task.startDate.getTime() - min.getTime()) / totalMs) * 100;
  const width =
    ((task.endDate.getTime() - task.startDate.getTime()) / totalMs) * 100;
  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.max(0.5, width)}%`,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Gantt({
  tasks,
  timeScale = "day",
  className = "",
}: GanttProps) {
  const { min, max } = getTimelineRange(tasks);
  const headers = generateTimeHeaders(min, max, timeScale);

  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Timeline</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500/70" />
            Done
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-500/70" />
            Active
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-white/[0.08]" />
            Pending
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* Time axis */}
        <div className="relative mb-2 ml-32 h-6 min-w-[600px]">
          {headers.map((h, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 text-[10px] text-gray-600"
              style={{ left: `${h.offset}%` }}
            >
              {h.label}
            </span>
          ))}
        </div>

        {/* Grid lines */}
        <div className="relative ml-32 min-w-[600px]">
          {/* Vertical grid lines */}
          {headers.map((h, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-white/[0.04]"
              style={{ left: `${h.offset}%` }}
            />
          ))}
        </div>

        {/* Task rows */}
        <div className="min-w-[600px] space-y-1">
          {tasks.map((task) => {
            const colors = task.color
              ? { bar: task.color, text: task.color }
              : statusColors[task.status];
            const barStyle = getBarStyle(task, min, max);

            return (
              <div
                key={task.id}
                className="relative flex items-center rounded-lg py-2 transition-colors hover:bg-white/[0.02]"
              >
                {/* Label */}
                <div className="w-32 shrink-0 truncate pr-3 text-right text-xs font-medium text-gray-400">
                  {task.label}
                </div>

                {/* Bar area */}
                <div className="relative flex-1">
                  {/* Background grid */}
                  {headers.map((h, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-white/[0.03]"
                      style={{ left: `${h.offset}%` }}
                    />
                  ))}

                  {/* Task bar */}
                  <div
                    className={`absolute top-1 h-6 rounded-md ${colors.bar} transition-all`}
                    style={barStyle}
                  >
                    <div className="flex h-full items-center px-2">
                      <span className="truncate text-[10px] font-medium text-white/80">
                        {task.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Today marker */}
        <div className="relative ml-32 min-w-[600px]">
          {(() => {
            const totalMs = max.getTime() - min.getTime();
            const now = new Date();
            const offset =
              ((now.getTime() - min.getTime()) / totalMs) * 100;
            if (offset < 0 || offset > 100) return null;
            return (
              <div
                className="absolute top-0 bottom-0 w-px bg-red-500/50"
                style={{ left: `${offset}%` }}
              >
                <span className="absolute -top-5 -translate-x-1/2 whitespace-nowrap rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">
                  Today
                </span>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
