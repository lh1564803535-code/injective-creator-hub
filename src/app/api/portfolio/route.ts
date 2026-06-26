import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    portfolio: {
      totalValue: "2870.17",
      assets: [
        { symbol: "INJ", balance: "125.50", value: "3124.50", change: "+3.2%" },
        { symbol: "USDC", balance: "1245.67", value: "1245.67", change: "0%" },
        { symbol: "USDT", balance: "500.00", value: "500.00", change: "0%" },
      ],
      nfts: 5,
      campaigns: 3,
    },
    timestamp: new Date().toISOString(),
  });
}
