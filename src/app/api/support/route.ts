import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    support: {
      channels: [
        {
          name: "Discord",
          url: "https://discord.gg/injective",
          responseTime: "< 1 hour",
          availability: "24/7",
        },
        {
          name: "Twitter",
          url: "https://twitter.com/Injective_",
          responseTime: "< 4 hours",
          availability: "Business hours",
        },
        {
          name: "Email",
          url: "support@injective.com",
          responseTime: "< 24 hours",
          availability: "Business days",
        },
      ],
      documentation: {
        guides: 25,
        tutorials: 15,
        videos: 10,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
