/**
 * Scheduler utilities
 */

interface ScheduledTask {
  id: string;
  name: string;
  fn: () => Promise<void>;
  interval: number;
  lastRun: number;
  nextRun: number;
  active: boolean;
}

class Scheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private timer: ReturnType<typeof setInterval> | null = null;

  schedule(
    name: string,
    fn: () => Promise<void>,
    interval: number
  ): string {
    const id = crypto.randomUUID();
    const now = Date.now();

    this.tasks.set(id, {
      id,
      name,
      fn,
      interval,
      lastRun: 0,
      nextRun: now + interval,
      active: true,
    });

    this.startIfNeeded();
    return id;
  }

  unschedule(id: string): void {
    this.tasks.delete(id);
    this.stopIfNeeded();
  }

  pause(id: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.active = false;
    }
  }

  resume(id: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.active = true;
      task.nextRun = Date.now() + task.interval;
    }
  }

  private startIfNeeded(): void {
    if (this.timer || this.tasks.size === 0) return;

    this.timer = setInterval(() => this.tick(), 1000);
  }

  private stopIfNeeded(): void {
    if (this.tasks.size === 0 && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick(): Promise<void> {
    const now = Date.now();

    for (const task of this.tasks.values()) {
      if (!task.active) continue;
      if (now < task.nextRun) continue;

      try {
        await task.fn();
      } catch (error) {
        console.error(`Scheduled task "${task.name}" failed:`, error);
      }

      task.lastRun = now;
      task.nextRun = now + task.interval;
    }
  }

  getTask(id: string): ScheduledTask | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  getActiveTasks(): ScheduledTask[] {
    return this.getAllTasks().filter((t) => t.active);
  }

  clear(): void {
    this.tasks.clear();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export function createScheduler(): Scheduler {
  return new Scheduler();
}

export function createCronExpression(
  minute: string,
  hour: string,
  dayOfMonth: string,
  month: string,
  dayOfWeek: string
): string {
  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export function parseCronExpression(expression: string): {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
} {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = expression.split(" ");
  return { minute, hour, dayOfMonth, month, dayOfWeek };
}

export function getNextCronTime(expression: string): Date {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parseCronExpression(expression);
  const now = new Date();

  // Simplified: just add the minute interval
  const next = new Date(now);
  next.setMinutes(next.getMinutes() + 1);
  next.setSeconds(0);
  next.setMilliseconds(0);

  return next;
}

export function scheduleAtTime(
  fn: () => Promise<void>,
  time: Date
): () => void {
  const delay = time.getTime() - Date.now();
  if (delay <= 0) {
    fn();
    return () => {};
  }

  const timer = setTimeout(fn, delay);
  return () => clearTimeout(timer);
}

export function scheduleRepeating(
  fn: () => Promise<void>,
  interval: number
): () => void {
  const timer = setInterval(fn, interval);
  return () => clearInterval(timer);
}
