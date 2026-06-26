/**
 * Domain-Driven Design utilities
 */

// Entity
export abstract class Entity<T> {
  constructor(protected props: T) {}

  equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) return false;
    if (this === object) return true;
    return JSON.stringify(this.props) === JSON.stringify(object.props);
  }
}

// Value Object
export abstract class ValueObject<T> {
  constructor(protected props: T) {}

  equals(vo?: ValueObject<T>): boolean {
    if (vo == null || vo == undefined) return false;
    if (this === vo) return true;
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}

// Aggregate Root
export abstract class AggregateRoot<T> extends Entity<T> {
  private domainEvents: unknown[] = [];

  addDomainEvent(event: unknown): void {
    this.domainEvents.push(event);
  }

  clearEvents(): void {
    this.domainEvents = [];
  }

  getDomainEvents(): unknown[] {
    return [...this.domainEvents];
  }
}

// Repository interface
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

// In-memory repository
export class InMemoryRepository<T extends Entity<unknown>> implements Repository<T> {
  protected items: Map<string, T> = new Map();

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async save(entity: T): Promise<void> {
    this.items.set((entity as unknown as { id: string }).id, entity);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async count(): Promise<number> {
    return this.items.size;
  }

  async exists(id: string): Promise<boolean> {
    return this.items.has(id);
  }
}

// Domain Service
export abstract class DomainService {
  abstract execute(...args: unknown[]): unknown;
}

// Application Service
export abstract class ApplicationService {
  abstract execute(...args: unknown[]): Promise<unknown>;
}

// Factory
export interface Factory<T> {
  create(...args: unknown[]): T;
}

// Specification
export interface Specification<T> {
  isSatisfiedBy(entity: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

export abstract class AbstractSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(entity: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends AbstractSpecification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity);
  }
}

class OrSpecification<T> extends AbstractSpecification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity);
  }
}

class NotSpecification<T> extends AbstractSpecification<T> {
  constructor(private spec: Specification<T>) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return !this.spec.isSatisfiedBy(entity);
  }
}

// Event
export interface DomainEvent {
  type: string;
  payload: unknown;
  timestamp: number;
  id: string;
}

export function createDomainEvent(type: string, payload: unknown): DomainEvent {
  return {
    type,
    payload,
    timestamp: Date.now(),
    id: crypto.randomUUID(),
  };
}
