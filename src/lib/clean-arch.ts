/**
 * Clean Architecture utilities
 */

// Use Case
export interface UseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export abstract class AbstractUseCase<TRequest, TResponse> implements UseCase<TRequest, TResponse> {
  abstract execute(request: TRequest): Promise<TResponse>;
}

// Input/Output Ports
export interface InputPort<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface OutputPort<TResponse> {
  present(response: TResponse): void;
}

// Gateway
export interface Gateway {
  // Base gateway interface
}

// Presenter
export abstract class Presenter<TResponse> {
  protected response: TResponse | null = null;

  present(response: TResponse): void {
    this.response = response;
  }

  getResponse(): TResponse | null {
    return this.response;
  }
}

// Interactor
export abstract class Interactor<TRequest, TResponse> implements UseCase<TRequest, TResponse> {
  abstract execute(request: TRequest): Promise<TResponse>;
}

// Controller
export abstract class Controller<TRequest> {
  abstract handle(request: TRequest): Promise<void>;
}

// Data Transfer Object
export interface DTO {
  // Base DTO interface
}

// Entity
export interface Entity {
  id: string;
}

// Value Object
export interface ValueObject {
  equals(other: ValueObject): boolean;
}

// Mapper
export interface Mapper<TEntity, TDTO> {
  toDomain(dto: TDTO): TEntity;
  toDTO(entity: TEntity): TDTO;
}

// Repository
export interface Repository<TEntity extends Entity> {
  findById(id: string): Promise<TEntity | null>;
  findAll(): Promise<TEntity[]>;
  save(entity: TEntity): Promise<void>;
  delete(id: string): Promise<void>;
}

// Unit of Work
export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

// Application Service
export abstract class ApplicationService<TRequest, TResponse> {
  abstract execute(request: TRequest): Promise<TResponse>;
}

// Domain Service
export abstract class DomainService {
  // Base domain service
}

// Infrastructure Service
export abstract class InfrastructureService {
  // Base infrastructure service
}

// Error Types
export class ApplicationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class DomainError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class InfrastructureError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "InfrastructureError";
  }
}

// Result Pattern
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export function ok<T>(value: T): Result<T> {
  return { success: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { success: true; value: T } {
  return result.success;
}

export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}
