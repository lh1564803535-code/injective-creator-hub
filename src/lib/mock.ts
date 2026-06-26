/**
 * Mock utilities
 */

export function createMock<T>(overrides: Partial<T> = {}): T {
  return overrides as T;
}

export function createMockFunction<TArgs extends unknown[], TReturn>(
  returnValue: TReturn
): (...args: TArgs) => TReturn {
  return (..._args: TArgs) => returnValue;
}

export function createMockAsyncFunction<TArgs extends unknown[], TReturn>(
  returnValue: TReturn,
  delay: number = 0
): (...args: TArgs) => Promise<TReturn> {
  return async (..._args: TArgs) => {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return returnValue;
  };
}

export function createMockWithHistory<TArgs extends unknown[], TReturn>(
  returnValue: TReturn
): {
  fn: (...args: TArgs) => TReturn;
  calls: TArgs[];
  callCount: number;
  lastCall: TArgs | null;
} {
  const calls: TArgs[] = [];

  const fn = (...args: TArgs): TReturn => {
    calls.push(args);
    return returnValue;
  };

  return {
    fn,
    calls,
    get callCount() {
      return calls.length;
    },
    get lastCall() {
      return calls.length > 0 ? calls[calls.length - 1] : null;
    },
  };
}

// Mock data generators
export function mockAddress(): string {
  const chars = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

export function mockHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function mockAmount(min: number = 0.01, max: number = 100): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export function mockTimestamp(daysAgo: number = 0): number {
  return Date.now() - daysAgo * 24 * 60 * 60 * 1000;
}

export function mockUser() {
  return {
    address: mockAddress(),
    balance: mockAmount(100, 10000),
    rank: Math.floor(Math.random() * 100) + 1,
    earnings: mockAmount(100, 50000),
    votes: Math.floor(Math.random() * 1000),
    submissions: Math.floor(Math.random() * 50),
  };
}

export function mockCampaign() {
  return {
    id: Math.floor(Math.random() * 1000) + 1,
    title: `Campaign ${Math.floor(Math.random() * 100) + 1}`,
    description: "A sample campaign description",
    totalReward: BigInt(Math.floor(Math.random() * 10000) + 100) * BigInt(10 ** 6),
    deadline: mockTimestamp(-Math.floor(Math.random() * 30) - 1),
    submissionCount: Math.floor(Math.random() * 100),
    settled: Math.random() > 0.5,
    sponsor: mockAddress(),
  };
}

export function mockTransaction() {
  return {
    hash: mockHash(),
    from: mockAddress(),
    to: mockAddress(),
    value: mockAmount(0.01, 100),
    timestamp: mockTimestamp(-Math.floor(Math.random() * 7)),
    status: Math.random() > 0.1 ? "confirmed" : "pending",
  };
}
