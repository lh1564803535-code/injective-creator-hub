import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    exchange: {
      name: "Injective Exchange",
      status: "active",
      markets: {
        spot: 156,
        perpetual: 25,
        expiry: 10,
      },
      volume24h: "$250M",
      users24h: 15000,
      trades24h: 125000,
    },
    timestamp: new Date().toISOString(),
  });
}
