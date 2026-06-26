import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    build: {
      status: "success",
      duration: "45s",
      size: {
        javascript: "2.5 MB",
        css: "150 KB",
        images: "500 KB",
        total: "3.15 MB",
      },
      optimization: {
        minification: true,
        treeShaking: true,
        codesplitting: true,
        lazyLoading: true,
      },
      lastBuild: "2026-06-26T10:00:00Z",
    },
    timestamp: new Date().toISOString(),
  });
}
