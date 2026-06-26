/**
 * Expect utilities (Jest-like assertions)
 */

class Expect {
  private actual: unknown;
  private isNot: boolean = false;

  constructor(actual: unknown) {
    this.actual = actual;
  }

  get not(): this {
    this.isNot = !this.isNot;
    return this;
  }

  toBe(expected: unknown): void {
    if (this.isNot) {
      if (this.actual === expected) {
        throw new Error(`Expected ${JSON.stringify(this.actual)} not to be ${JSON.stringify(expected)}`);
      }
    } else {
      if (this.actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(this.actual)}`);
      }
    }
  }

  toEqual(expected: unknown): void {
    const actualJson = JSON.stringify(this.actual);
    const expectedJson = JSON.stringify(expected);

    if (this.isNot) {
      if (actualJson === expectedJson) {
        throw new Error(`Expected values not to be deeply equal`);
      }
    } else {
      if (actualJson !== expectedJson) {
        throw new Error(`Expected ${expectedJson}, got ${actualJson}`);
      }
    }
  }

  toBeTruthy(): void {
    if (this.isNot) {
      if (this.actual) {
        throw new Error(`Expected ${JSON.stringify(this.actual)} to be falsy`);
      }
    } else {
      if (!this.actual) {
        throw new Error(`Expected ${JSON.stringify(this.actual)} to be truthy`);
      }
    }
  }

  toBeFalsy(): void {
    if (this.isNot) {
      if (!this.actual) {
        throw new Error(`Expected ${JSON.stringify(this.actual)} to be truthy`);
      }
    } else {
      if (this.actual) {
        throw new Error(`Expected ${JSON.stringify(this.actual)} to be falsy`);
      }
    }
  }

  toBeNull(): void {
    if (this.isNot) {
      if (this.actual === null) {
        throw new Error("Expected value not to be null");
      }
    } else {
      if (this.actual !== null) {
        throw new Error(`Expected null, got ${JSON.stringify(this.actual)}`);
      }
    }
  }

  toBeUndefined(): void {
    if (this.isNot) {
      if (this.actual === undefined) {
        throw new Error("Expected value not to be undefined");
      }
    } else {
      if (this.actual !== undefined) {
        throw new Error(`Expected undefined, got ${JSON.stringify(this.actual)}`);
      }
    }
  }

  toBeDefined(): void {
    if (this.isNot) {
      if (this.actual !== undefined && this.actual !== null) {
        throw new Error("Expected value to be null or undefined");
      }
    } else {
      if (this.actual === undefined || this.actual === null) {
        throw new Error("Expected value to be defined");
      }
    }
  }

  toBeGreaterThan(expected: number): void {
    if (this.isNot) {
      if ((this.actual as number) > expected) {
        throw new Error(`Expected ${this.actual} not to be greater than ${expected}`);
      }
    } else {
      if (!((this.actual as number) > expected)) {
        throw new Error(`Expected ${this.actual} to be greater than ${expected}`);
      }
    }
  }

  toBeLessThan(expected: number): void {
    if (this.isNot) {
      if ((this.actual as number) < expected) {
        throw new Error(`Expected ${this.actual} not to be less than ${expected}`);
      }
    } else {
      if (!((this.actual as number) < expected)) {
        throw new Error(`Expected ${this.actual} to be less than ${expected}`);
      }
    }
  }

  toContain(expected: unknown): void {
    if (Array.isArray(this.actual)) {
      if (this.isNot) {
        if (this.actual.includes(expected)) {
          throw new Error(`Expected array not to contain ${JSON.stringify(expected)}`);
        }
      } else {
        if (!this.actual.includes(expected)) {
          throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
        }
      }
    } else if (typeof this.actual === "string") {
      if (this.isNot) {
        if (this.actual.includes(expected as string)) {
          throw new Error(`Expected string not to contain "${expected}"`);
        }
      } else {
        if (!this.actual.includes(expected as string)) {
          throw new Error(`Expected string to contain "${expected}"`);
        }
      }
    }
  }

  toHaveLength(length: number): void {
    const actualLength = (this.actual as { length: number }).length;
    if (this.isNot) {
      if (actualLength === length) {
        throw new Error(`Expected length not to be ${length}`);
      }
    } else {
      if (actualLength !== length) {
        throw new Error(`Expected length ${length}, got ${actualLength}`);
      }
    }
  }

  toThrow(): void {
    if (typeof this.actual !== "function") {
      throw new Error("Expected a function");
    }

    try {
      (this.actual as () => void)();
      if (!this.isNot) {
        throw new Error("Expected function to throw");
      }
    } catch (error) {
      if (this.isNot) {
        throw new Error("Expected function not to throw");
      }
    }
  }

  toBeInstanceOf(expected: Function): void {
    if (this.isNot) {
      if (this.actual instanceof expected) {
        throw new Error(`Expected value not to be instance of ${expected.name}`);
      }
    } else {
      if (!(this.actual instanceof expected)) {
        throw new Error(`Expected instance of ${expected.name}`);
      }
    }
  }
}

export function expect(actual: unknown): Expect {
  return new Expect(actual);
}
