import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    proposal: {
      active: 2,
      passed: 8,
      rejected: 2,
      total: 12,
      recent: [
        {
          id: "prop_1",
          title: "Increase Campaign Rewards Pool",
          status: "active",
          votesFor: 1250,
          votesAgainst: 340,
          endDate: "2026-07-01",
        },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
