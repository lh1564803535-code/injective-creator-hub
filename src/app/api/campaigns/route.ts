import { NextResponse } from "next/server";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    campaigns: MOCK_CAMPAIGNS,
    total: MOCK_CAMPAIGNS.length,
    timestamp: new Date().toISOString(),
  });
}
