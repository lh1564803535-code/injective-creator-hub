import { NextResponse } from "next/server";
import { MOCK_ACTIVITY } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    activity: MOCK_ACTIVITY,
    total: MOCK_ACTIVITY.length,
    timestamp: new Date().toISOString(),
  });
}
