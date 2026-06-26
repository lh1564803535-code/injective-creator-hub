import { NextResponse } from "next/server";
import { MOCK_CREATORS } from "@/lib/mock-data";

export async function GET() {
  // Sort by earnings
  const sorted = [...MOCK_CREATORS].sort((a, b) => b.earnings - a.earnings);

  return NextResponse.json({
    creators: sorted,
    total: sorted.length,
    timestamp: new Date().toISOString(),
  });
}
