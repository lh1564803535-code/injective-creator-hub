/**
 * Queue utilities
 */

export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items = [];
  }

  contains(item: T): boolean {
    return this.items.includes(item);
  }

  toArray(): T[] {
    return [...this.items];
  }
}

export class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number): void {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }

  peek(): T | undefined {
    return this.items[0]?.item;
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items = [];
  }
}

export class CircularBuffer<T> {
  private buffer: (T | undefined)[];
  private head: number = 0;
  private tail: number = 0;
  private size: number = 0;

  constructor(private capacity: number) {
    this.buffer = new Array(capacity);
  }

  push(item: T): void {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;

    if (this.size === this.capacity) {
      this.head = (this.head + 1) % this.capacity;
    } else {
      this.size++;
    }
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.size) return undefined;
    return this.buffer[(this.head + index) % this.capacity];
  }

  getSize(): number {
    return this.size;
  }

  getCapacity(): number {
    return this.capacity;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }

  clear(): void {
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.size; i++) {
      const item = this.get(i);
      if (item !== undefined) result.push(item);
    }
    return result;
  }
}

export function createQueue<T>(): Queue<T> {
  return new Queue<T>();
}

export function createPriorityQueue<T>(): PriorityQueue<T> {
  return new PriorityQueue<T>();
}

export function createCircularBuffer<T>(capacity: number): CircularBuffer<T> {
  return new CircularBuffer<T>(capacity);
}
