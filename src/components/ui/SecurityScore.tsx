"use client";

import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface SecurityScoreProps {
  score: number; // 0-100
  label?: string;
  details?: Array<{ name: string; passed: boolean }>;
  className?: string;
}

export function SecurityScore({
  score,
  label = "Security Score",
  details,
  className = "",
}: SecurityScoreProps) {
  const color =
    score >= 80
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : score >= 60
      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
      : "text-red-400 bg-red-500/10 border-red-500/20";

  const Icon = score >= 80 ? CheckCircle : score >= 60 ? Shield : AlertTriangle;

  return (
    <div className={`rounded-xl border ${color.split(" ")[2]} ${color.split(" ")[1]} p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color.split(" ")[1]}`}>
          <Icon className={`h-5 w-5 ${color.split(" ")[0]}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className={`text-2xl font-bold ${color.split(" ")[0]}`}>{score}/100</p>
        </div>
      </div>

      {details && (
        <div className="mt-3 space-y-1">
          {details.map((detail, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {detail.passed ? (
                <CheckCircle className="h-3 w-3 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-red-400" />
              )}
              <span className={detail.passed ? "text-gray-400" : "text-red-400"}>
                {detail.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
