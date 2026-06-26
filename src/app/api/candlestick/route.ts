import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    candlestick: {
      market: "INJ/USDC",
      interval: "1h",
      data: [
        {
          time: "2026-06-26T09:00:00Z",
          open: "24.50",
          high: "24.90",
          low: "24.40",
          close: "24.85",
          volume: "50000",
        },
        {
          time: "2026-06-26T10:00:00Z",
          open: "24.85",
          high: "25.10",
          low: "24.70",
          close: "24.95",
          volume: "75000",
        },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
