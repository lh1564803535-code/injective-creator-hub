import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    bridge: {
      supported: [
        {
          name: "IBC",
          chains: ["Cosmos Hub", "Osmosis", "Juno"],
          status: "active",
        },
        {
          name: "Ethereum Bridge",
          chains: ["Ethereum"],
          status: "active",
        },
      ],
      totalBridged: "$500,000",
      averageTime: "5 minutes",
    },
    timestamp: new Date().toISOString(),
  });
}
