import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    history: [
      {
        id: "1",
        type: "claim",
        amount: "50.00",
        token: "USDC",
        from: "Campaign: DeFi Content Challenge",
        timestamp: Date.now() - 3600000,
        hash: "0xabc...def",
        status: "confirmed",
      },
      {
        id: "2",
        type: "vote",
        amount: "0",
        token: "INJ",
        to: "Campaign: NFT Art Showcase",
        timestamp: Date.now() - 7200000,
        hash: "0x123...456",
        status: "confirmed",
      },
      {
        id: "3",
        type: "receive",
        amount: "125.50",
        token: "USDC",
        from: "0x1234...5678",
        timestamp: Date.now() - 86400000,
        hash: "0x789...012",
        status: "confirmed",
      },
    ],
    total: 3,
    timestamp: new Date().toISOString(),
  });
}
