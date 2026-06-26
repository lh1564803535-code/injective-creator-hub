/**
 * Task queue utilities
 */

interface Task<T = unknown> {
  id: string;
  name: string;
  fn: () => Promise<T>;
  priority: number;
  createdAt: number;
  status: "pending" | "running" | "completed" | "failed";
  result?: T;
  error?: Error;
}

class TaskQueue {
  private queue: Task[] = [];
  private running: Map<string, Task> = new Map();
  private maxConcurrent: number;
  private completed: Task[] = [];

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  add<T>(name: string, fn: () => Promise<T>, priority: number = 0): string {
    const task: Task<T> = {
      id: crypto.randomUUID(),
      name,
      fn,
      priority,
      createdAt: Date.now(),
      status: "pending",
    };

    this.queue.push(task);
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();

    return task.id;
  }

  private async processQueue(): Promise<void> {
    while (this.running.size < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift()!;
      task.status = "running";
      this.running.set(task.id, task);

      this.executeTask(task);
    }
  }

  private async executeTask(task: Task): Promise<void> {
    try {
      const result = await task.fn();
      task.status = "completed";
      task.result = result;
    } catch (error) {
      task.status = "failed";
      task.error = error instanceof Error ? error : new Error(String(error));
    } finally {
      this.running.delete(task.id);
      this.completed.push(task);
      this.processQueue();
    }
  }

  getTask(id: string): Task | undefined {
    return (
      this.queue.find((t) => t.id === id) ||
      this.running.get(id) ||
      this.completed.find((t) => t.id === id)
    );
  }

  getQueue(): Task[] {
    return [...this.queue];
  }

  getRunning(): Task[] {
    return Array.from(this.running.values());
  }

  getCompleted(): Task[] {
    return [...this.completed];
  }

  getStats(): {
    pending: number;
    running: number;
    completed: number;
    failed: number;
  } {
    return {
      pending: this.queue.length,
      running: this.running.size,
      completed: this.completed.filter((t) => t.status === "completed").length,
      failed: this.completed.filter((t) => t.status === "failed").length,
    };
  }

  clear(): void {
    this.queue = [];
    this.completed = [];
  }

  async waitAll(): Promise<void> {
    while (this.running.size > 0 || this.queue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async waitTask(id: string): Promise<Task> {
    while (true) {
      const task = this.getTask(id);
      if (!task) throw new Error(`Task ${id} not found`);
      if (task.status === "completed" || task.status === "failed") return task;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

export function createTaskQueue(maxConcurrent?: number): TaskQueue {
  return new TaskQueue(maxConcurrent);
}

export function createTask<T>(
  name: string,
  fn: () => Promise<T>,
  priority?: number
): Task<T> {
  return {
    id: crypto.randomUUID(),
    name,
    fn,
    priority: priority || 0,
    createdAt: Date.now(),
    status: "pending",
  };
}
