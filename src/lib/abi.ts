/**
 * ABI utilities
 */

// Common ABI types
export const ABI_TYPES = {
  UINT256: "uint256",
  INT256: "int256",
  ADDRESS: "address",
  BOOL: "bool",
  STRING: "string",
  BYTES: "bytes",
  BYTES32: "bytes32",
} as const;

// Encode function call
export function encodeFunctionCall(
  abi: unknown[],
  functionName: string,
  params: unknown[]
): string {
  // Simplified encoding - in production use ethers.js or viem
  const functionAbi = (abi as Array<{ name: string; type: string }>).find(
    (item) => item.name === functionName
  );
  if (!functionAbi) {
    throw new Error(`Function ${functionName} not found in ABI`);
  }

  // Create a simple hash of the function signature
  const signature = `${functionName}(${functionAbi.type})`;
  const selector = simpleHash(signature).slice(0, 8);

  // Encode parameters (simplified)
  const encodedParams = params
    .map((param) => encodeParam(param))
    .join("");

  return `0x${selector}${encodedParams}`;
}

// Decode function result
export function decodeFunctionResult(
  abi: unknown[],
  functionName: string,
  data: string
): unknown {
  // Simplified decoding - in production use ethers.js or viem
  const functionAbi = (abi as Array<{ name: string; outputs?: Array<{ type: string }> }>).find(
    (item) => item.name === functionName
  );
  if (!functionAbi?.outputs?.length) {
    throw new Error(`Function ${functionName} not found or has no outputs`);
  }

  // Simple decoding based on type
  const output = functionAbi.outputs[0];
  return decodeParam(output.type, data.slice(10)); // Remove selector
}

// Encode event topics
export function encodeEventTopics(
  abi: unknown[],
  eventName: string,
  params?: Record<string, unknown>
): string[] {
  const eventAbi = (abi as Array<{ name: string; type: string }>).find(
    (item) => item.name === eventName && item.type === "event"
  );
  if (!eventAbi) {
    throw new Error(`Event ${eventName} not found in ABI`);
  }

  const signature = `${eventName}(${eventAbi.type})`;
  const topic = simpleHash(signature);

  const topics = [`0x${topic}`];

  if (params) {
    for (const value of Object.values(params)) {
      topics.push(encodeTopic(value));
    }
  }

  return topics;
}

// Helper functions
function simpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, "0");
}

function encodeParam(value: unknown): string {
  if (typeof value === "number") {
    return value.toString(16).padStart(64, "0");
  }
  if (typeof value === "string") {
    if (value.startsWith("0x")) {
      return value.slice(2).padStart(64, "0");
    }
    return Buffer.from(value).toString("hex").padStart(64, "0");
  }
  if (typeof value === "boolean") {
    return value ? "1".padStart(64, "0") : "0".padStart(64, "0");
  }
  return "".padStart(64, "0");
}

function decodeParam(type: string, data: string): unknown {
  switch (type) {
    case "uint256":
    case "int256":
      return parseInt(data.slice(0, 64), 16);
    case "address":
      return "0x" + data.slice(24, 64);
    case "bool":
      return data.slice(0, 64) !== "0".padStart(64, "0");
    case "string":
      return Buffer.from(data, "hex").toString().replace(/\0/g, "");
    default:
      return "0x" + data;
  }
}

function encodeTopic(value: unknown): string {
  if (typeof value === "string" && value.startsWith("0x")) {
    return value.padEnd(66, "0"); // 32 bytes = 64 hex chars + 0x
  }
  return "0x" + encodeParam(value);
}

// Common ABIs
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

export const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function approve(address to, uint256 tokenId)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
];

// Get function selector (first 4 bytes of keccak256)
export function getFunctionSelector(signature: string): string {
  return simpleHash(signature).slice(0, 8);
}

// Parse function signature
export function parseFunctionSignature(signature: string): {
  name: string;
  inputs: Array<{ name: string; type: string }>;
} {
  const match = signature.match(/^(\w+)\(([^)]*)\)$/);
  if (!match) {
    throw new Error(`Invalid function signature: ${signature}`);
  }

  const name = match[1];
  const inputs = match[2]
    ? match[2].split(",").map((param, index) => ({
        name: `param${index}`,
        type: param.trim(),
      }))
    : [];

  return { name, inputs };
}
