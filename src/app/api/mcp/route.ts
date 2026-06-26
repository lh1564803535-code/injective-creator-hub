import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mcp: {
      name: "Injective MCP Server",
      description: "Model Context Protocol for AI agents on Injective",
      url: "https://docs.injective.network/developers-ai/index",
      tools: [
        { name: "perp_trade", description: "Execute perpetual futures trades" },
        { name: "spot_swap", description: "Swap tokens on Injective DEX" },
        { name: "bridge_assets", description: "Bridge assets across chains" },
        { name: "check_portfolio", description: "View wallet balances" },
        { name: "query_docs", description: "Search Injective documentation" },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
