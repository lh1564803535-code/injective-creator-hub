import { NextResponse } from "next/server";

export async function POST() {
  // Mock submit response
  return NextResponse.json({
    success: true,
    message: "Submission created successfully",
    submission: {
      id: "sub_" + Date.now(),
      campaignId: "campaign_1",
      status: "pending",
    },
    transaction: {
      hash: "0x" + Math.random().toString(16).slice(2, 10) + "...",
      gas: "0.002 INJ",
      status: "confirmed",
    },
    timestamp: new Date().toISOString(),
  });
}
