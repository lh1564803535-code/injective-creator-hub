import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "1.0.0",
    build: "2026-06-26",
    environment: process.env.NODE_ENV || "development",
    features: {
      aiAssistant: "v1.0",
      realTimeStreaming: "v1.0",
      transactionPreview: "v1.0",
      socialFi: "v1.0",
      mcpIntegration: "v1.0",
    },
    timestamp: new Date().toISOString(),
  });
}
