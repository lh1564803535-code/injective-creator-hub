import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    debug: {
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      pid: process.pid,
    },
    timestamp: new Date().toISOString(),
  });
}
