import { NextResponse } from "next/server";
import { MOCK_CREATORS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    creators: MOCK_CREATORS,
    total: MOCK_CREATORS.length,
    timestamp: new Date().toISOString(),
  });
}
