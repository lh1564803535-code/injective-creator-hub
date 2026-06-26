import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    social: {
      farcaster: {
        handle: "@injectivecreator",
        followers: 1250,
        weeklyRewards: 25000,
      },
      lens: {
        handle: "injectivecreator.lens",
        followers: 890,
        monthlyEarnings: 1300,
      },
      twitter: {
        handle: "@Injective_",
        followers: 125000,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
