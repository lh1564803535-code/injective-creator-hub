import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Feedback submitted successfully",
    feedbackId: "fb_" + Date.now(),
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    feedback: {
      total: 250,
      averageRating: 4.7,
      categories: [
        { name: "UI/UX", count: 120, rating: 4.8 },
        { name: "Performance", count: 80, rating: 4.6 },
        { name: "Features", count: 50, rating: 4.5 },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
