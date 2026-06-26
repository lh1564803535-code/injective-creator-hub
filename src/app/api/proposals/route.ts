import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    proposals: [
      {
        id: "prop_1",
        title: "Increase Campaign Rewards Pool",
        description: "Proposal to increase the monthly rewards pool from 10,000 to 25,000 USDC",
        status: "active",
        votesFor: 1250,
        votesAgainst: 340,
        endDate: Date.now() + 86400000 * 3,
      },
      {
        id: "prop_2",
        title: "Add New Campaign Categories",
        description: "Add Music, Video, and Podcast categories to the platform",
        status: "passed",
        votesFor: 2100,
        votesAgainst: 150,
        endDate: Date.now() - 86400000,
      },
    ],
    total: 2,
    timestamp: new Date().toISOString(),
  });
}
