import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    governance: {
      totalProposals: 12,
      activeProposals: 2,
      passedProposals: 8,
      rejectedProposals: 2,
      votingPower: "1250 INJ",
      participationRate: "78%",
    },
    recentProposals: [
      {
        id: "prop_1",
        title: "Increase Campaign Rewards Pool",
        status: "active",
        votesFor: 1250,
        votesAgainst: 340,
      },
      {
        id: "prop_2",
        title: "Add New Campaign Categories",
        status: "passed",
        votesFor: 2100,
        votesAgainst: 150,
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
