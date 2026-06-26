/**
 * Safety utilities
 */

interface SafetyCheck {
  name: string;
  check: () => Promise<boolean>;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface SafetyResult {
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    message: string;
    severity: string;
  }>;
  score: number; // 0-100
}

class SafetyChecker {
  private checks: SafetyCheck[] = [];

  addCheck(check: SafetyCheck): void {
    this.checks.push(check);
  }

  removeCheck(name: string): void {
    this.checks = this.checks.filter((c) => c.name !== name);
  }

  async runAll(): Promise<SafetyResult> {
    const results: SafetyResult["checks"] = [];
    let passedCount = 0;

    for (const check of this.checks) {
      try {
        const passed = await check.check();
        results.push({
          name: check.name,
          passed,
          message: check.message,
          severity: check.severity,
        });
        if (passed) passedCount++;
      } catch {
        results.push({
          name: check.name,
          passed: false,
          message: `Check failed: ${check.message}`,
          severity: check.severity,
        });
      }
    }

    const score = this.checks.length > 0
      ? Math.round((passedCount / this.checks.length) * 100)
      : 100;

    return {
      passed: passedCount === this.checks.length,
      checks: results,
      score,
    };
  }

  async runSingle(name: string): Promise<boolean> {
    const check = this.checks.find((c) => c.name === name);
    if (!check) throw new Error(`Check "${name}" not found`);
    return check.check();
  }

  getChecks(): SafetyCheck[] {
    return [...this.checks];
  }

  clear(): void {
    this.checks = [];
  }
}

export function createSafetyChecker(): SafetyChecker {
  return new SafetyChecker();
}

export function createSafetyCheck(
  name: string,
  check: () => Promise<boolean>,
  message: string,
  severity: SafetyCheck["severity"] = "medium"
): SafetyCheck {
  return { name, check, message, severity };
}

// Common safety checks
export function createAddressCheck(address: string): SafetyCheck {
  return createSafetyCheck(
    "address-valid",
    async () => /^0x[a-fA-F0-9]{40}$/.test(address),
    "Address must be a valid Ethereum address",
    "critical"
  );
}

export function createBalanceCheck(
  balanceFn: () => Promise<bigint>,
  minBalance: bigint
): SafetyCheck {
  return createSafetyCheck(
    "balance-sufficient",
    async () => {
      const balance = await balanceFn();
      return balance >= minBalance;
    },
    "Insufficient balance for transaction",
    "high"
  );
}

export function createAllowanceCheck(
  allowanceFn: () => Promise<bigint>,
  requiredAmount: bigint
): SafetyCheck {
  return createSafetyCheck(
    "allowance-sufficient",
    async () => {
      const allowance = await allowanceFn();
      return allowance >= requiredAmount;
    },
    "Insufficient token allowance",
    "high"
  );
}

export function createGasCheck(
  gasPriceFn: () => Promise<bigint>,
  maxGasPrice: bigint
): SafetyCheck {
  return createSafetyCheck(
    "gas-price-acceptable",
    async () => {
      const gasPrice = await gasPriceFn();
      return gasPrice <= maxGasPrice;
    },
    "Gas price exceeds maximum acceptable level",
    "medium"
  );
}

export function createDeadlineCheck(deadline: number): SafetyCheck {
  return createSafetyCheck(
    "deadline-valid",
    async () => Date.now() < deadline,
    "Transaction deadline has passed",
    "high"
  );
}

// Risk scoring
export function calculateRiskScore(result: SafetyResult): {
  score: number;
  level: "low" | "medium" | "high" | "critical";
  recommendation: string;
} {
  const { score } = result;

  if (score >= 90) {
    return { score, level: "low", recommendation: "Safe to proceed" };
  }
  if (score >= 70) {
    return { score, level: "medium", recommendation: "Proceed with caution" };
  }
  if (score >= 50) {
    return { score, level: "high", recommendation: "Review failed checks before proceeding" };
  }
  return { score, level: "critical", recommendation: "Do not proceed without addressing critical issues" };
}

// Global safety checker
let globalSafetyChecker: SafetyChecker | null = null;

export function getGlobalSafetyChecker(): SafetyChecker {
  if (!globalSafetyChecker) {
    globalSafetyChecker = createSafetyChecker();
  }
  return globalSafetyChecker;
}

export function setGlobalSafetyChecker(checker: SafetyChecker): void {
  globalSafetyChecker = checker;
}

// Convenience functions
export function addSafetyCheck(check: SafetyCheck): void {
  getGlobalSafetyChecker().addCheck(check);
}

export async function runSafetyChecks(): Promise<SafetyResult> {
  return getGlobalSafetyChecker().runAll();
}

export async function runSingleSafetyCheck(name: string): Promise<boolean> {
  return getGlobalSafetyChecker().runSingle(name);
}

export function getSafetyChecks(): SafetyCheck[] {
  return getGlobalSafetyChecker().getChecks();
}

export function clearSafetyChecks(): void {
  getGlobalSafetyChecker().clear();
}
