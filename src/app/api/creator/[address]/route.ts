import { NextResponse } from "next/server";
import { MOCK_CREATORS } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const creator = MOCK_CREATORS.find(
    (c) => c.address.toLowerCase() === address.toLowerCase()
  );

  if (!creator) {
    return NextResponse.json(
      { error: "Creator not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    creator,
    timestamp: new Date().toISOString(),
  });
}
