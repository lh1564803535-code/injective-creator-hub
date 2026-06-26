import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    token: {
      name: "INJ",
      symbol: "INJ",
      decimals: 18,
      totalSupply: "100,000,000",
      circulatingSupply: "80,000,000",
      price: "24.85",
      marketCap: "$1,988,000,000",
      volume24h: "$125,000,000",
    },
    timestamp: new Date().toISOString(),
  });
}
