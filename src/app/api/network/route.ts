import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    network: {
      chainId: 1439,
      name: "Injective EVM Testnet",
      rpc: "https://k8s.testnet.json-rpc.injective.network/",
      explorer: "https://testnet.blockscout.injective.network/",
      currency: {
        name: "INJ",
        symbol: "INJ",
        decimals: 18,
      },
    },
    status: {
      connected: true,
      blockNumber: 8234567,
      blockTime: 1.2,
      peers: 156,
    },
    timestamp: new Date().toISOString(),
  });
}
