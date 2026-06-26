import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    escrow: {
      totalLocked: "5000.00 USDC",
      activeEscrows: 3,
      completedEscrows: 12,
      releasedFunds: "15000.00 USDC",
    },
    recentEscrows: [
      {
        id: "esc_1",
        campaign: "DeFi Content Challenge",
        amount: "2000.00 USDC",
        status: "locked",
        releaseDate: "2026-07-26",
      },
      {
        id: "esc_2",
        campaign: "NFT Art Showcase",
        amount: "1500.00 USDC",
        status: "released",
        releaseDate: "2026-06-20",
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
