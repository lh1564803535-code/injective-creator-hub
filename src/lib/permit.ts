/**
 * Permit utilities (EIP-2612)
 */

interface PermitData {
  owner: string;
  spender: string;
  value: bigint;
  nonce: bigint;
  deadline: bigint;
}

interface PermitSignature {
  v: number;
  r: string;
  s: string;
}

class PermitManager {
  private nonces: Map<string, bigint> = new Map();

  getNonce(owner: string, token: string): bigint {
    const key = `${token}:${owner}`;
    return this.nonces.get(key) ?? 0n;
  }

  incrementNonce(owner: string, token: string): void {
    const key = `${token}:${owner}`;
    const current = this.nonces.get(key) ?? 0n;
    this.nonces.set(key, current + 1n);
  }

  buildPermitData(
    token: string,
    owner: string,
    spender: string,
    value: bigint,
    deadline: bigint
  ): PermitData {
    return {
      owner,
      spender,
      value,
      nonce: this.getNonce(owner, token),
      deadline,
    };
  }

  encodePermitData(data: PermitData): string {
    // Simplified encoding
    return `0x${data.owner.slice(2)}${data.spender.slice(2)}${data.value.toString(16).padStart(64, "0")}${data.nonce.toString(16).padStart(64, "0")}${data.deadline.toString(16).padStart(64, "0")}`;
  }

  getDomainSeparator(token: string, chainId: number): string {
    // Simplified domain separator
    return `0x${token.slice(2)}${chainId.toString(16).padStart(64, "0")}`;
  }

  clear(): void {
    this.nonces.clear();
  }
}

export function createPermitManager(): PermitManager {
  return new PermitManager();
}

// Encode permit call data
export function encodePermit(
  owner: string,
  spender: string,
  value: bigint,
  deadline: bigint,
  v: number,
  r: string,
  s: string
): string {
  // permit(address,address,uint256,uint256,uint8,bytes32,bytes32) selector: 0xd505accf
  return `0xd505accf${owner.slice(2).padStart(64, "0")}${spender.slice(2).padStart(64, "0")}${value.toString(16).padStart(64, "0")}${deadline.toString(16).padStart(64, "0")}${v.toString(16).padStart(64, "0")}${r.slice(2).padStart(64, "0")}${s.slice(2).padStart(64, "0")}`;
}

// Create permit deadline (current time + duration)
export function createPermitDeadline(durationSeconds: number = 3600): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + durationSeconds);
}

// Check if permit is expired
export function isPermitExpired(deadline: bigint): boolean {
  return BigInt(Math.floor(Date.now() / 1000)) > deadline;
}

// Parse permit signature
export function parsePermitSignature(signature: string): PermitSignature {
  const sig = signature.startsWith("0x") ? signature.slice(2) : signature;
  return {
    v: parseInt(sig.slice(128, 130), 16),
    r: "0x" + sig.slice(0, 64),
    s: "0x" + sig.slice(64, 128),
  };
}

// Global permit manager
let globalPermitManager: PermitManager | null = null;

export function getGlobalPermitManager(): PermitManager {
  if (!globalPermitManager) {
    globalPermitManager = createPermitManager();
  }
  return globalPermitManager;
}

export function setGlobalPermitManager(manager: PermitManager): void {
  globalPermitManager = manager;
}

// Convenience functions
export function getPermitNonce(owner: string, token: string): bigint {
  return getGlobalPermitManager().getNonce(owner, token);
}

export function buildPermitData(
  token: string,
  owner: string,
  spender: string,
  value: bigint,
  deadline: bigint
): PermitData {
  return getGlobalPermitManager().buildPermitData(token, owner, spender, value, deadline);
}

export function encodePermitCall(
  owner: string,
  spender: string,
  value: bigint,
  deadline: bigint,
  v: number,
  r: string,
  s: string
): string {
  return encodePermit(owner, spender, value, deadline, v, r, s);
}

export function createDeadline(durationSeconds?: number): bigint {
  return createPermitDeadline(durationSeconds);
}

export function isExpired(deadline: bigint): boolean {
  return isPermitExpired(deadline);
}
