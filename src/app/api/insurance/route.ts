import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    insurance: {
      funds: [
        {
          name: "USDC Insurance Fund",
          balance: "$1,000,000",
          coverage: "Smart contract risks",
          status: "active",
        },
        {
          name: "INJ Insurance Fund",
          balance: "50,000 INJ",
          coverage: "Slashing risks",
          status: "active",
        },
      ],
      totalCoverage: "$2,500,000",
    },
    timestamp: new Date().toISOString(),
  });
}
