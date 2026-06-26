/**
 * CQRS (Command Query Responsibility Segregation) utilities
 */

// Command
interface Command<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  id: string;
}

// Query
interface Query<T = unknown> {
  type: string;
  params: T;
  timestamp: number;
  id: string;
}

// Command Handler
type CommandHandler<T = unknown, R = unknown> = (command: Command<T>) => R | Promise<R>;

// Query Handler
type QueryHandler<T = unknown, R = unknown> = (query: Query<T>) => R | Promise<R>;

class CommandBus {
  private handlers: Map<string, CommandHandler> = new Map();

  register<T, R>(type: string, handler: CommandHandler<T, R>): void {
    this.handlers.set(type, handler as CommandHandler);
  }

  async execute<T, R>(type: string, payload: T): Promise<R> {
    const handler = this.handlers.get(type);
    if (!handler) {
      throw new Error(`No handler registered for command "${type}"`);
    }

    const command: Command<T> = {
      type,
      payload,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    };

    return handler(command) as R;
  }

  hasHandler(type: string): boolean {
    return this.handlers.has(type);
  }

  getHandlerTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  clear(): void {
    this.handlers.clear();
  }
}

class QueryBus {
  private handlers: Map<string, QueryHandler> = new Map();

  register<T, R>(type: string, handler: QueryHandler<T, R>): void {
    this.handlers.set(type, handler as QueryHandler);
  }

  async execute<T, R>(type: string, params: T): Promise<R> {
    const handler = this.handlers.get(type);
    if (!handler) {
      throw new Error(`No handler registered for query "${type}"`);
    }

    const query: Query<T> = {
      type,
      params,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    };

    return handler(query) as R;
  }

  hasHandler(type: string): boolean {
    return this.handlers.has(type);
  }

  getHandlerTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  clear(): void {
    this.handlers.clear();
  }
}

export function createCommandBus(): CommandBus {
  return new CommandBus();
}

export function createQueryBus(): QueryBus {
  return new QueryBus();
}

export function createCommand<T>(type: string, payload: T): Command<T> {
  return {
    type,
    payload,
    timestamp: Date.now(),
    id: crypto.randomUUID(),
  };
}

export function createQuery<T>(type: string, params: T): Query<T> {
  return {
    type,
    params,
    timestamp: Date.now(),
    id: crypto.randomUUID(),
  };
}

// Read Model
class ReadModel<T> {
  private data: T;
  private projections: Map<string, (data: T, event: unknown) => T> = new Map();

  constructor(initialData: T) {
    this.data = initialData;
  }

  getData(): T {
    return this.data;
  }

  apply(eventType: string, event: unknown): void {
    const projection = this.projections.get(eventType);
    if (projection) {
      this.data = projection(this.data, event);
    }
  }

  registerProjection(eventType: string, projection: (data: T, event: unknown) => T): void {
    this.projections.set(eventType, projection);
  }

  reset(): void {
    this.data = this.data; // Reset to initial would need initial state stored
  }
}

export function createReadModel<T>(initialData: T): ReadModel<T> {
  return new ReadModel(initialData);
}

// Write Model
class WriteModel {
  private events: unknown[] = [];

  appendEvent(event: unknown): void {
    this.events.push(event);
  }

  getEvents(): unknown[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

export function createWriteModel(): WriteModel {
  return new WriteModel();
}
