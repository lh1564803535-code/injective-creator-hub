import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    audit: {
      security: {
        lastAudit: "2026-06-01",
        auditor: "Internal",
        findings: 0,
        status: "passed",
      },
      compliance: {
        kyc: false,
        aml: true,
        dataProtection: true,
        status: "compliant",
      },
      transparency: {
        openSource: true,
        contractVerified: true,
        auditPublic: true,
        status: "transparent",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
