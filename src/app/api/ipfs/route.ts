import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ipfs: {
      gateway: "https://ipfs.io",
      pinningService: "Pinata",
      totalPins: 1250,
      storageUsed: "5 GB",
      status: "active",
    },
    timestamp: new Date().toISOString(),
  });
}
