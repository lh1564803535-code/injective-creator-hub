import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    agent: {
      name: "InjectiveCreatorHub",
      type: "other",
      description: "AI-powered creator settlement platform on Injective",
      status: "active",
      capabilities: [
        "Natural language trading",
        "Portfolio management",
        "Market analysis",
        "Cross-chain transfers",
      ],
    },
    sdk: {
      name: "@injective/agent-sdk",
      version: "latest",
      github: "https://github.com/InjectiveLabs/iAgent",
    },
    timestamp: new Date().toISOString(),
  });
}
