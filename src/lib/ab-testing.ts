/**
 * A/B Testing utilities
 */

interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  trafficAllocation: number; // 0-100
  startDate: number;
  endDate?: number;
  status: "draft" | "running" | "paused" | "completed";
}

interface ABVariant {
  id: string;
  name: string;
  weight: number; // 0-100
  config: Record<string, unknown>;
}

class ABTestingManager {
  private tests: Map<string, ABTest> = new Map();
  private assignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId

  createTest(test: ABTest): void {
    this.tests.set(test.id, test);
  }

  deleteTest(testId: string): void {
    this.tests.delete(testId);
    this.assignments.forEach((userTests) => userTests.delete(testId));
  }

  getVariant(testId: string, userId: string): ABVariant | undefined {
    const test = this.tests.get(testId);
    if (!test || test.status !== "running") return undefined;

    // Check if user is already assigned
    const userAssignments = this.assignments.get(userId);
    if (userAssignments?.has(testId)) {
      const variantId = userAssignments.get(testId);
      return test.variants.find((v) => v.id === variantId);
    }

    // Assign user to variant based on weights
    const variant = this.assignVariant(test, userId);
    if (variant) {
      if (!this.assignments.has(userId)) {
        this.assignments.set(userId, new Map());
      }
      this.assignments.get(userId)!.set(testId, variant.id);
    }

    return variant;
  }

  private assignVariant(test: ABTest, userId: string): ABVariant | undefined {
    // Check traffic allocation
    const hash = this.hashString(userId + test.id);
    if (hash % 100 >= test.trafficAllocation) return undefined;

    // Assign based on variant weights
    let cumulative = 0;
    const random = (hash % 10000) / 100;

    for (const variant of test.variants) {
      cumulative += variant.weight;
      if (random < cumulative) {
        return variant;
      }
    }

    return test.variants[test.variants.length - 1];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  startTest(testId: string): void {
    const test = this.tests.get(testId);
    if (test) {
      test.status = "running";
      test.startDate = Date.now();
    }
  }

  pauseTest(testId: string): void {
    const test = this.tests.get(testId);
    if (test) {
      test.status = "paused";
    }
  }

  completeTest(testId: string): void {
    const test = this.tests.get(testId);
    if (test) {
      test.status = "completed";
      test.endDate = Date.now();
    }
  }

  getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId);
  }

  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }

  getRunningTests(): ABTest[] {
    return this.getAllTests().filter((t) => t.status === "running");
  }

  getUserAssignments(userId: string): Map<string, string> {
    return this.assignments.get(userId) || new Map();
  }

  clear(): void {
    this.tests.clear();
    this.assignments.clear();
  }
}

export function createABTestingManager(): ABTestingManager {
  return new ABTestingManager();
}

export function createABTest(
  name: string,
  variants: ABVariant[],
  options?: Partial<Omit<ABTest, "id" | "name" | "variants">>
): ABTest {
  return {
    id: crypto.randomUUID(),
    name,
    variants,
    trafficAllocation: 100,
    startDate: Date.now(),
    status: "draft",
    ...options,
  };
}

export function createABVariant(
  name: string,
  weight: number,
  config: Record<string, unknown> = {}
): ABVariant {
  return {
    id: crypto.randomUUID(),
    name,
    weight,
    config,
  };
}

// Global A/B testing manager
let globalABTestingManager: ABTestingManager | null = null;

export function getGlobalABTestingManager(): ABTestingManager {
  if (!globalABTestingManager) {
    globalABTestingManager = createABTestingManager();
  }
  return globalABTestingManager;
}

export function setGlobalABTestingManager(manager: ABTestingManager): void {
  globalABTestingManager = manager;
}

// Convenience functions
export function createGlobalABTest(
  name: string,
  variants: ABVariant[],
  options?: Partial<Omit<ABTest, "id" | "name" | "variants">>
): ABTest {
  const test = createABTest(name, variants, options);
  getGlobalABTestingManager().createTest(test);
  return test;
}

export function getABTestVariant(testId: string, userId: string): ABVariant | undefined {
  return getGlobalABTestingManager().getVariant(testId, userId);
}

export function startABTest(testId: string): void {
  getGlobalABTestingManager().startTest(testId);
}

export function pauseABTest(testId: string): void {
  getGlobalABTestingManager().pauseTest(testId);
}

export function completeABTest(testId: string): void {
  getGlobalABTestingManager().completeTest(testId);
}

export function getAllABTests(): ABTest[] {
  return getGlobalABTestingManager().getAllTests();
}

export function getRunningABTests(): ABTest[] {
  return getGlobalABTestingManager().getRunningTests();
}
