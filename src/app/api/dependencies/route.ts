import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    dependencies: {
      total: 45,
      outdated: 3,
      vulnerable: 0,
      categories: {
        runtime: 25,
        development: 20,
      },
      notable: [
        { name: "next", version: "16.2.9", latest: "16.2.9" },
        { name: "react", version: "19.0.0", latest: "19.0.0" },
        { name: "viem", version: "2.0.0", latest: "2.0.0" },
        { name: "wagmi", version: "2.0.0", latest: "2.0.0" },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
