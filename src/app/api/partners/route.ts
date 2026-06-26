import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    partners: [
      {
        name: "Injective",
        type: "Blockchain",
        description: "Layer 1 blockchain for DeFi",
        url: "https://injective.com",
      },
      {
        name: "Superfluid",
        type: "Streaming",
        description: "Real-time streaming payments protocol",
        url: "https://superfluid.org",
      },
      {
        name: "Farcaster",
        type: "Social",
        description: "Decentralized social protocol",
        url: "https://farcaster.xyz",
      },
      {
        name: "Lens Protocol",
        type: "Social",
        description: "Decentralized social graph",
        url: "https://lens.xyz",
      },
    ],
    total: 4,
    timestamp: new Date().toISOString(),
  });
}
