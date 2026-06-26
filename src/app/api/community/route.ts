import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    community: {
      discord: {
        members: 12500,
        online: 3200,
        channels: 25,
      },
      twitter: {
        followers: 125000,
        tweets: 5000,
        engagement: "3.2%",
      },
      telegram: {
        members: 8900,
        messages: 125000,
      },
    },
    events: [
      {
        name: "Creator Workshop",
        date: "2026-07-15",
        type: "online",
        attendees: 150,
      },
      {
        name: "Hackathon",
        date: "2026-08-01",
        type: "hybrid",
        attendees: 300,
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
