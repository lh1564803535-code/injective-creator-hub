/**
 * Signer utilities
 */

interface SignResult {
  signature: string;
  message: string;
  timestamp: number;
}

interface VerifyResult {
  valid: boolean;
  signer?: string;
}

// Sign message with private key (simplified - in production use ethers.js)
export async function signMessage(message: string, privateKey: string): Promise<SignResult> {
  // This is a simplified implementation
  // In production, use ethers.js or viem for proper signing
  const timestamp = Date.now();
  const dataToSign = `${message}:${timestamp}`;

  // For demo purposes, create a mock signature
  // In production: const signature = await wallet.signMessage(dataToSign)
  const signature = await createMockSignature(dataToSign, privateKey);

  return {
    signature,
    message: dataToSign,
    timestamp,
  };
}

// Verify signature (simplified)
export async function verifySignature(
  message: string,
  signature: string,
  expectedSigner: string
): Promise<VerifyResult> {
  // This is a simplified implementation
  // In production: const recoveredAddress = ethers.verifyMessage(message, signature)
  const recoveredAddress = await recoverAddressFromSignature(message, signature);

  return {
    valid: recoveredAddress.toLowerCase() === expectedSigner.toLowerCase(),
    signer: recoveredAddress,
  };
}

// Create typed data signature (EIP-712)
export async function signTypedData(
  domain: Record<string, unknown>,
  types: Record<string, Array<{ name: string; type: string }>>,
  value: Record<string, unknown>,
  privateKey: string
): Promise<string> {
  // Simplified implementation
  // In production: const signature = await wallet._signTypedData(domain, types, value)
  const data = JSON.stringify({ domain, types, value });
  return createMockSignature(data, privateKey);
}

// Mock signature creation (for demo purposes)
async function createMockSignature(data: string, privateKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data + privateKey));
  const bytes = new Uint8Array(buffer);
  return "0x" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Mock address recovery (for demo purposes)
async function recoverAddressFromSignature(message: string, signature: string): Promise<string> {
  // Simplified - in production use ethers.recoverAddress
  const hash = await sha256(message + signature);
  return "0x" + hash.slice(0, 40);
}

// Helper: SHA-256
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Sign transaction (simplified)
export async function signTransaction(
  transaction: Record<string, unknown>,
  privateKey: string
): Promise<string> {
  const data = JSON.stringify(transaction);
  return createMockSignature(data, privateKey);
}

// Generate signing key pair
export async function generateSigningKeyPair(): Promise<{
  privateKey: string;
  publicKey: string;
  address: string;
}> {
  // Simplified key generation
  // In production: use ethers.Wallet.createRandom()
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const privateKey = "0x" + Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const publicKey = await derivePublicKey(privateKey);
  const address = await deriveAddress(publicKey);

  return { privateKey, publicKey, address };
}

async function derivePublicKey(privateKey: string): Promise<string> {
  const hash = await sha256(privateKey);
  return "0x04" + hash; // Uncompressed public key prefix
}

async function deriveAddress(publicKey: string): Promise<string> {
  const hash = await sha256(publicKey);
  return "0x" + hash.slice(-40);
}

// Format signature for display
export function formatSignature(signature: string, chars: number = 6): string {
  return `${signature.slice(0, chars + 2)}...${signature.slice(-chars)}`;
}

// Validate signature format
export function isValidSignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature); // 65 bytes = 130 hex chars
}
