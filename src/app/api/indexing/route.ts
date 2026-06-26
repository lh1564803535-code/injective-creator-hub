import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    indexing: {
      provider: "The Graph",
      status: "active",
      subgraphs: [
        {
          name: "injective-creator-hub",
          status: "synced",
          latestBlock: 8234567,
          chain: "Injective EVM Testnet",
        },
      ],
      queries: {
        total: 125000,
        averageTime: "15ms",
        cacheHitRate: "85%",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
