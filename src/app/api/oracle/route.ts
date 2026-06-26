import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    oracle: {
      provider: "Chainlink",
      status: "active",
      feeds: [
        {
          name: "INJ/USD",
          price: "24.85",
          updatedAt: "2026-06-26T10:00:00Z",
        },
        {
          name: "USDC/USD",
          price: "1.00",
          updatedAt: "2026-06-26T10:00:00Z",
        },
      ],
      latency: "500ms",
    },
    timestamp: new Date().toISOString(),
  });
}
