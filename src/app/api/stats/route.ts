import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalEarnings: 124567.89,
    activeCreators: 156,
    campaignsCompleted: 42,
    averageBlockTime: 1.2,
    network: {
      chainId: 1439,
      name: "Injective EVM Testnet",
      rpc: "https://k8s.testnet.json-rpc.injective.network/",
    },
    timestamp: new Date().toISOString(),
  });
}
