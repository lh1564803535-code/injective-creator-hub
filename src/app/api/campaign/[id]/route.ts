import { NextResponse } from "next/server";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = MOCK_CAMPAIGNS.find((c) => String(c.id) === id);

  if (!campaign) {
    return NextResponse.json(
      { error: "Campaign not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    campaign,
    timestamp: new Date().toISOString(),
  });
}
