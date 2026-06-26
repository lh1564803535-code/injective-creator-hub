import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    treasury: {
      totalBalance: "125000.00",
      assets: [
        { symbol: "USDC", balance: "100000.00", value: "100000.00" },
        { symbol: "INJ", balance: "1000.00", value: "25000.00" },
      ],
      monthlyDistribution: "25000.00",
      totalDistributed: "500000.00",
    },
    timestamp: new Date().toISOString(),
  });
}
