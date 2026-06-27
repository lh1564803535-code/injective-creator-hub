/**
 * Approval utilities
 */

interface ApprovalRequest {
  token: string;
  owner: string;
  spender: string;
  amount: bigint;
}

interface ApprovalStatus {
  approved: boolean;
  allowance: bigint;
  needsApproval: boolean;
}

class ApprovalManager {
  private approvals: Map<string, ApprovalStatus> = new Map();

  private getKey(token: string, owner: string, spender: string): string {
    return `${token}:${owner}:${spender}`;
  }

  checkApproval(token: string, owner: string, spender: string, requiredAmount: bigint): ApprovalStatus {
    const key = this.getKey(token, owner, spender);
    const current = this.approvals.get(key);

    if (!current) {
      return {
        approved: false,
        allowance: BigInt(0),
        needsApproval: true,
      };
    }

    return {
      approved: current.allowance >= requiredAmount,
      allowance: current.allowance,
      needsApproval: current.allowance < requiredAmount,
    };
  }

  setApproval(token: string, owner: string, spender: string, amount: bigint): void {
    const key = this.getKey(token, owner, spender);
    this.approvals.set(key, {
      approved: amount > BigInt(0),
      allowance: amount,
      needsApproval: false,
    });
  }

  revokeApproval(token: string, owner: string, spender: string): void {
    const key = this.getKey(token, owner, spender);
    this.approvals.set(key, {
      approved: false,
      allowance: BigInt(0),
      needsApproval: true,
    });
  }

  getMaxApproval(token: string, owner: string, spender: string): void {
    const maxAmount = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    this.setApproval(token, owner, spender, maxAmount);
  }

  getApproval(token: string, owner: string, spender: string): ApprovalStatus | undefined {
    return this.approvals.get(this.getKey(token, owner, spender));
  }

  clear(): void {
    this.approvals.clear();
  }
}

export function createApprovalManager(): ApprovalManager {
  return new ApprovalManager();
}

// Encode approval call data
export function encodeApproval(spender: string, amount: bigint): string {
  // approve(address,uint256) selector: 0x095ea7b3
  return `0x095ea7b3${spender.slice(2).padStart(64, "0")}${amount.toString(16).padStart(64, "0")}`;
}

// Encode max approval
export function encodeMaxApproval(spender: string): string {
  const maxAmount = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  return encodeApproval(spender, maxAmount);
}

// Parse approval amount from return data
export function parseApprovalAmount(data: string): bigint {
  if (!data || data === "0x") return BigInt(0);
  return BigInt(data);
}

// Check if approval is sufficient
export function isApprovalSufficient(
  currentAllowance: bigint,
  requiredAmount: bigint
): boolean {
  return currentAllowance >= requiredAmount;
}

// Global approval manager
let globalApprovalManager: ApprovalManager | null = null;

export function getGlobalApprovalManager(): ApprovalManager {
  if (!globalApprovalManager) {
    globalApprovalManager = createApprovalManager();
  }
  return globalApprovalManager;
}

export function setGlobalApprovalManager(manager: ApprovalManager): void {
  globalApprovalManager = manager;
}

// Convenience functions
export function checkApproval(token: string, owner: string, spender: string, amount: bigint): ApprovalStatus {
  return getGlobalApprovalManager().checkApproval(token, owner, spender, amount);
}

export function setApproval(token: string, owner: string, spender: string, amount: bigint): void {
  getGlobalApprovalManager().setApproval(token, owner, spender, amount);
}

export function revokeApproval(token: string, owner: string, spender: string): void {
  getGlobalApprovalManager().revokeApproval(token, owner, spender);
}

export function needsApproval(token: string, owner: string, spender: string, amount: bigint): boolean {
  return getGlobalApprovalManager().checkApproval(token, owner, spender, amount).needsApproval;
}
