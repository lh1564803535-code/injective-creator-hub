import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    reputation: {
      score: 85,
      tier: "Gold",
      factors: {
        earnings: 90,
        consistency: 80,
        engagement: 85,
        quality: 88,
        longevity: 75,
      },
      achievements: [
        { name: "First Steps", unlocked: true },
        { name: "Week Warrior", unlocked: true },
        { name: "Century Club", unlocked: true },
        { name: "Grand Earner", unlocked: false, progress: 245 },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
