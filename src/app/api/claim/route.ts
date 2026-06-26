import { NextResponse } from "next/server";

export async function POST() {
  // Mock claim response
  return NextResponse.json({
    success: true,
    message: "Reward claimed successfully",
    reward: {
      amount: "50.00",
      token: "USDC",
      campaign: "DeFi Content Challenge",
    },
    transaction: {
      hash: "0x" + Math.random().toString(16).slice(2, 10) + "...",
      gas: "0.001 INJ",
      status: "confirmed",
    },
    timestamp: new Date().toISOString(),
  });
}
