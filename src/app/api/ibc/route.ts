import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ibc: {
      channels: [
        {
          id: "channel-0",
          counterparty: "Cosmos Hub",
          status: "active",
          volume24h: "$500,000",
        },
        {
          id: "channel-1",
          counterparty: "Osmosis",
          status: "active",
          volume24h: "$750,000",
        },
      ],
      totalChannels: 15,
      totalVolume24h: "$5,000,000",
    },
    timestamp: new Date().toISOString(),
  });
}
