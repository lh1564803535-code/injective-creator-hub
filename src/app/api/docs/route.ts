import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    docs: {
      gettingStarted: {
        title: "Getting Started",
        sections: [
          "Connect Wallet",
          "Get Testnet Tokens",
          "Explore Campaigns",
          "Submit Content",
          "Earn Rewards",
        ],
      },
      api: {
        title: "API Documentation",
        endpoints: [
          { path: "/api/health", method: "GET", description: "Health check" },
          { path: "/api/stats", method: "GET", description: "Platform statistics" },
          { path: "/api/campaigns", method: "GET", description: "List campaigns" },
          { path: "/api/creators", method: "GET", description: "List creators" },
          { path: "/api/chat", method: "POST", description: "AI chat" },
        ],
      },
    },
    timestamp: new Date().toISOString(),
  });
}
