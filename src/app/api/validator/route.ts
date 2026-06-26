import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    validator: {
      totalValidators: 100,
      activeValidators: 85,
      totalStaked: "50,000,000 INJ",
      averageCommission: "10%",
      topValidators: [
        {
          name: "Validator A",
          stake: "5,000,000 INJ",
          commission: "5%",
          uptime: "99.9%",
        },
        {
          name: "Validator B",
          stake: "4,500,000 INJ",
          commission: "8%",
          uptime: "99.8%",
        },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
