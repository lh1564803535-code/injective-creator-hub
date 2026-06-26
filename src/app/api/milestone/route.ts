import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    milestones: [
      {
        id: "ms_1",
        title: "100 Creators",
        description: "Reached 100 active creators on the platform",
        date: "2026-06-15",
        achieved: true,
      },
      {
        id: "ms_2",
        title: "$100K Earnings",
        description: "Total creator earnings exceeded $100,000",
        date: "2026-06-20",
        achieved: true,
      },
      {
        id: "ms_3",
        title: "50 Campaigns",
        description: "50 campaigns completed successfully",
        date: "2026-06-25",
        achieved: false,
        progress: 42,
      },
      {
        id: "ms_4",
        title: "1000 Users",
        description: "Platform reached 1000 registered users",
        date: "2026-07-01",
        achieved: false,
        progress: 750,
      },
    ],
    total: 4,
    achieved: 2,
    timestamp: new Date().toISOString(),
  });
}
