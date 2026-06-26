import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    roadmap: [
      {
        phase: "Phase 1",
        title: "Core Platform",
        description: "Campaign creation, submissions, voting, and reward distribution",
        status: "completed",
        date: "Q2 2026",
      },
      {
        phase: "Phase 2",
        title: "AI Integration",
        description: "AI assistant, natural language commands, transaction previews",
        status: "completed",
        date: "Q2 2026",
      },
      {
        phase: "Phase 3",
        title: "Real-Time Streaming",
        description: "Superfluid-inspired earnings, live counters, streaming payments",
        status: "completed",
        date: "Q2 2026",
      },
      {
        phase: "Phase 4",
        title: "Testnet Launch",
        description: "Deploy to Injective testnet, community testing, bug fixes",
        status: "in-progress",
        date: "Q3 2026",
      },
      {
        phase: "Phase 5",
        title: "Mainnet & Growth",
        description: "Mainnet deployment, partnerships, creator onboarding",
        status: "upcoming",
        date: "Q4 2026",
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
