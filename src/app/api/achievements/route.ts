import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    achievements: [
      { id: "first-campaign", name: "First Steps", unlocked: true, xp: 10 },
      { id: "first-vote", name: "Voice Heard", unlocked: true, xp: 10 },
      { id: "earn-100", name: "Century Club", unlocked: true, xp: 50 },
      { id: "streak-7", name: "Week Warrior", unlocked: true, xp: 50 },
      { id: "earn-1000", name: "Grand Earner", unlocked: false, progress: 245, xp: 200 },
      { id: "top-10", name: "Top 10", unlocked: false, progress: 42, xp: 200 },
      { id: "win-5", name: "Campaign Champion", unlocked: false, progress: 2, xp: 500 },
      { id: "streak-30", name: "Monthly Master", unlocked: false, progress: 12, xp: 500 },
    ],
    totalXp: 120,
    unlockedCount: 4,
    timestamp: new Date().toISOString(),
  });
}
