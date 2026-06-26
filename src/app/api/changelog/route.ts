import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    changelog: [
      {
        version: "1.0.0",
        date: "2026-06-26",
        changes: [
          "Initial release",
          "Campaign creation and management",
          "Content submission and voting",
          "USDC reward distribution",
          "AI assistant integration",
          "Real-time streaming payments",
          "Transaction preview",
          "MCP server integration",
        ],
      },
      {
        version: "0.9.0",
        date: "2026-06-15",
        changes: [
          "Beta release",
          "Testnet deployment",
          "Community testing",
        ],
      },
    ],
    currentVersion: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
