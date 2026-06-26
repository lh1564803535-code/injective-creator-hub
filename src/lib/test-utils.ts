/**
 * Test utilities
 */

export function mockDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mockRandom(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function mockRandomInt(min: number, max: number): number {
  return Math.floor(mockRandom(min, max + 1));
}

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

export function mockTimestamp(daysAgo: number = 0): number {
  return Date.now() - daysAgo * 24 * 60 * 60 * 1000;
}

export function mockPrice(min: number = 0.01, max: number = 100): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export function mockPercentage(): number {
  return parseFloat((Math.random() * 20 - 10).toFixed(2));
}

export function mockVolume(): number {
  return Math.floor(Math.random() * 1000000);
}

export function mockUser() {
  return {
    address: mockAddress(),
    balance: mockPrice(100, 10000),
    rank: mockRandomInt(1, 100),
    earnings: mockPrice(100, 50000),
    votes: mockRandomInt(0, 1000),
    submissions: mockRandomInt(0, 50),
  };
}

export function mockCampaign() {
  return {
    id: mockRandomInt(1, 1000),
    title: `Campaign ${mockRandomInt(1, 100)}`,
    description: "A sample campaign description",
    totalReward: BigInt(mockRandomInt(100, 10000)) * BigInt(10 ** 6),
    deadline: mockTimestamp(-mockRandomInt(1, 30)),
    submissionCount: mockRandomInt(0, 100),
    settled: Math.random() > 0.5,
    sponsor: mockAddress(),
  };
}

export function mockTransaction() {
  return {
    hash: mockHash(),
    from: mockAddress(),
    to: mockAddress(),
    value: mockPrice(0.01, 100),
    timestamp: mockTimestamp(-mockRandomInt(0, 7)),
    status: Math.random() > 0.1 ? "confirmed" : "pending",
  };
}

export function mockNotification() {
  const types = ["reward", "vote", "deadline", "settle"];
  return {
    id: `notif_${mockRandomInt(1, 10000)}`,
    type: types[mockRandomInt(0, types.length - 1)],
    title: "Notification Title",
    detail: "Notification detail text",
    timestamp: mockTimestamp(-mockRandomInt(0, 7)),
    read: Math.random() > 0.5,
  };
}
