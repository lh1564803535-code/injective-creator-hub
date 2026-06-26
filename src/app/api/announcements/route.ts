import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    announcements: [
      {
        id: "ann_1",
        title: "Injective Creator Hub Launch",
        content: "We're excited to announce the official launch of Injective Creator Hub!",
        date: "2026-06-26",
        type: "major",
      },
      {
        id: "ann_2",
        title: "Testnet Now Live",
        content: "Start earning USDC rewards on our testnet environment.",
        date: "2026-06-20",
        type: "feature",
      },
      {
        id: "ann_3",
        title: "AI Assistant Beta",
        content: "Try our new AI assistant for natural language blockchain interactions.",
        date: "2026-06-15",
        type: "feature",
      },
    ],
    total: 3,
    timestamp: new Date().toISOString(),
  });
}
