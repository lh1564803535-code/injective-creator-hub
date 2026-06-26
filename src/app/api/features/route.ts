import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    features: [
      {
        name: "AI-Powered Assistant",
        description: "Natural language commands for wallet management, campaign participation, and blockchain interactions",
        status: "active",
      },
      {
        name: "Real-Time Streaming",
        description: "Earnings flow every second using Superfluid-inspired technology",
        status: "active",
      },
      {
        name: "Transaction Preview",
        description: "Review every transaction before signing with risk assessment",
        status: "active",
      },
      {
        name: "Cross-Chain Ready",
        description: "Built on Injective EVM with IBC support for 40+ chains",
        status: "active",
      },
      {
        name: "Instant Finality",
        description: "Sub-second block times with 1.2s finality",
        status: "active",
      },
      {
        name: "Community Governance",
        description: "Decentralized campaign creation, voting, and reward distribution",
        status: "active",
      },
    ],
    total: 6,
    timestamp: new Date().toISOString(),
  });
}
