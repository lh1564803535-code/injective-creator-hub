import { NextResponse } from "next/server";
import { MOCK_CREATORS } from "@/lib/mock-data";

export async function GET() {
  // Sort by earnings
  const sorted = [...MOCK_CREATORS].sort((a, b) => Number(b.totalEarnings) - Number(a.totalEarnings));

  return NextResponse.json({
    creators: sorted,
    total: sorted.length,
    timestamp: new Date().toISOString(),
  });
}
