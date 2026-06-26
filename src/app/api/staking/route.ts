import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    staking: {
      pools: [
        {
          name: "Flexible",
          apy: 4.2,
          lockPeriod: "None",
          tvl: 125000,
        },
        {
          name: "30-Day Lock",
          apy: 8.5,
          lockPeriod: "30 days",
          tvl: 250000,
        },
        {
          name: "90-Day Lock",
          apy: 15.0,
          lockPeriod: "90 days",
          tvl: 500000,
        },
      ],
      totalStaked: 875000,
      averageApy: 9.2,
    },
    timestamp: new Date().toISOString(),
  });
}
