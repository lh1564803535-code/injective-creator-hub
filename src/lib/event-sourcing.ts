/**
 * Event sourcing utilities
 */

interface Event<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  id: string;
}

class EventStore {
  private events: Event[] = [];
  private handlers: Map<string, Set<(event: Event) => void>> = new Map();

  append<T>(type: string, payload: T): Event<T> {
    const event: Event<T> = {
      type,
      payload,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    };

    this.events.push(event);
    this.notify(event);
    return event;
  }

  getEvents(type?: string): Event[] {
    if (type) {
      return this.events.filter((e) => e.type === type);
    }
    return [...this.events];
  }

  on(type: string, handler: (event: Event) => void): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  private notify(event: Event): void {
    this.handlers.get(event.type)?.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for "${event.type}":`, error);
      }
    });
  }

  clear(): void {
    this.events = [];
  }

  getEventCount(): number {
    return this.events.length;
  }

  getEventTypes(): string[] {
    return [...new Set(this.events.map((e) => e.type))];
  }
}

export function createEventStore(): EventStore {
  return new EventStore();
}

export function createEvent<T>(type: string, payload: T): Event<T> {
  return {
    type,
    payload,
    timestamp: Date.now(),
    id: crypto.randomUUID(),
  };
}

// Aggregate
class Aggregate<T> {
  private state: T;
  private version: number = 0;
  private uncommittedEvents: Event[] = [];

  constructor(
    private initialState: T,
    private applyEvent: (state: T, event: Event) => T
  ) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  getVersion(): number {
    return this.version;
  }

  getUncommittedEvents(): Event[] {
    return [...this.uncommittedEvents];
  }

  apply(event: Event): void {
    this.state = this.applyEvent(this.state, event);
    this.version++;
    this.uncommittedEvents.push(event);
  }

  commit(): Event[] {
    const events = [...this.uncommittedEvents];
    this.uncommittedEvents = [];
    return events;
  }

  loadFromHistory(events: Event[]): void {
    events.forEach((event) => {
      this.state = this.applyEvent(this.state, event);
      this.version++;
    });
  }
}

export function createAggregate<T>(
  initialState: T,
  applyEvent: (state: T, event: Event) => T
): Aggregate<T> {
  return new Aggregate(initialState, applyEvent);
}

// Projection
class Projection<T> {
  private state: T;
  private handlers: Map<string, (state: T, event: Event) => T> = new Map();

  constructor(private initialState: T) {
    this.state = initialState;
  }

  on(type: string, handler: (state: T, event: Event) => T): void {
    this.handlers.set(type, handler);
  }

  apply(event: Event): void {
    const handler = this.handlers.get(event.type);
    if (handler) {
      this.state = handler(this.state, event);
    }
  }

  getState(): T {
    return this.state;
  }

  reset(): void {
    this.state = this.initialState;
  }
}

export function createProjection<T>(initialState: T): Projection<T> {
  return new Projection(initialState);
}
