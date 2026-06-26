import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    trade: {
      recent: [
        {
          id: "trade_1",
          market: "INJ/USDC",
          side: "buy",
          price: "24.85",
          quantity: "100",
          timestamp: "2026-06-26T10:00:00Z",
        },
        {
          id: "trade_2",
          market: "INJ/USDC",
          side: "sell",
          price: "24.80",
          quantity: "50",
          timestamp: "2026-06-26T09:55:00Z",
        },
      ],
      total24h: 125000,
      volume24h: "$12.5M",
    },
    timestamp: new Date().toISOString(),
  });
}
