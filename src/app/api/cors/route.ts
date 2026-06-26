import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cors: {
      allowedOrigins: ["*"],
      allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: "86400",
      credentials: true,
    },
    timestamp: new Date().toISOString(),
  });
}
