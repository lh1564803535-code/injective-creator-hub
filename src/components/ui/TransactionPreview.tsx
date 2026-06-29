"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  ArrowRight,
  Eye,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
  FileText,
} from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TxRiskLevel = "safe" | "warning" | "danger";

export interface TxStep {
  label: string;
  detail: string;
  icon: typeof Shield;
  color: string;
}

export interface TxBalanceChange {
  token: string;
  amount: string;
  direction: "in" | "out" | "none";
  usdValue?: string;
}

export interface TransactionPreviewProps {
  /** Transaction title */
  title: string;
  /** Target contract name or address */
  target: string;
  /** Function being called */
  functionName: string;
  /** Steps the transaction will execute */
  steps: TxStep[];
  /** Balance changes simulation */
  balanceChanges: TxBalanceChange[];
  /** Estimated gas cost */
  estimatedGas: string;
  /** Estimated gas in USD */
  estimatedGasUSD?: string;
  /** Risk level */
  riskLevel?: TxRiskLevel;
  /** Risk message */
  riskMessage?: string;
  /** Whether contract is verified */
  contractVerified?: boolean;
  /** Network name */
  network?: string;
  /** Confirm callback */
  onConfirm: () => void;
  /** Cancel callback */
  onCancel: () => void;
  /** Whether the tx is currently processing */
  isProcessing?: boolean;
  /** Processing message */
  processingMessage?: string;
}

// ---------------------------------------------------------------------------
// Risk Badge
// ---------------------------------------------------------------------------

function RiskBadge({ level, message }: { level: TxRiskLevel; message?: string }) {
  const config = {
    safe: {
      icon: CheckCircle2,
      label: "Safe",
      className: "border-emerald-500/30 bg-[#00D4AA]/10 text-[#00D4AA]",
      dotClass: "bg-emerald-400",
    },
    warning: {
      icon: AlertTriangle,
      label: "Warning",
      className: "border-amber-500/30 bg-[#F0B90B]/10 text-[#F0B90B]",
      dotClass: "bg-amber-400",
    },
    danger: {
      icon: AlertTriangle,
      label: "Danger",
      className: "border-red-500/30 bg-[#F6465D]/10 text-[#F6465D]",
      dotClass: "bg-red-400",
    },
  };

  const cfg = config[level];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${cfg.className}`}>
      <Icon className="h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">{cfg.label}</p>
        {message && <p className="text-[11px] opacity-75">{message}</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Balance Change Row
// ---------------------------------------------------------------------------

function BalanceChangeRow({ change }: { change: TxBalanceChange }) {
  const directionConfig = {
    in: { prefix: "+", color: "text-[#00D4AA]", bg: "bg-[#00D4AA]/10", arrow: "text-[#00D4AA]" },
    out: { prefix: "-", color: "text-[#F6465D]", bg: "bg-[#F6465D]/10", arrow: "text-[#F6465D]" },
    none: { prefix: "", color: "text-[#848E9C]", bg: "bg-gray-500/10", arrow: "text-[#848E9C]" },
  };

  const cfg = directionConfig[change.direction];

  return (
    <div className="flex items-center justify-between rounded-lg bg-[#1E2329] px-3 py-2">
      <div className="flex items-center gap-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${cfg.bg}`}>
          <span className="text-[10px] font-bold">{change.token.slice(0, 2)}</span>
        </div>
        <span className="text-xs text-[#848E9C]">{change.token}</span>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${cfg.color}`}>
          {cfg.prefix}{change.amount}
        </p>
        {change.usdValue && (
          <p className="text-[10px] text-[#848E9C]">{change.usdValue}</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TransactionPreview({
  title,
  target,
  functionName,
  steps,
  balanceChanges,
  estimatedGas,
  estimatedGasUSD,
  riskLevel = "safe",
  riskMessage,
  contractVerified = true,
  network = "Injective EVM",
  onConfirm,
  onCancel,
  isProcessing = false,
  processingMessage = "Processing transaction...",
}: TransactionPreviewProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const reducedMotion = useReducedMotion();

  // Reset confirmation when props change
  useEffect(() => {
    setConfirmed(false);
  }, [title, functionName]);

  return (
    <div className="space-y-4">
      {/* Simulation Header */}
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-[#00D4AA]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#00D4AA]">
          Transaction Preview
        </span>
      </div>

      {/* Risk Assessment */}
      <RiskBadge level={riskLevel} message={riskMessage} />

      {/* Contract Info */}
      <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-[#848E9C]" />
            <span className="text-xs text-[#848E9C]">Contract</span>
          </div>
          {contractVerified && (
            <div className="flex items-center gap-1 text-[#00D4AA]">
              <CheckCircle2 className="h-3 w-3" />
              <span className="text-[10px] font-medium">Verified</span>
            </div>
          )}
        </div>
        <p className="font-mono text-xs text-[#EAECEF]">{target}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded bg-[#2B3139] px-1.5 py-0.5 font-mono text-[10px] text-[#848E9C]">
            {functionName}
          </span>
          <span className="text-[10px] text-[#848E9C]">on {network}</span>
        </div>
      </div>

      {/* Balance Changes */}
      {balanceChanges.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-[#848E9C]">Estimated Balance Changes</p>
          <div className="space-y-1.5">
            {balanceChanges.map((change, i) => (
              <BalanceChangeRow key={i} change={change} />
            ))}
          </div>
        </div>
      )}

      {/* Gas Estimate */}
      <div className="flex items-center justify-between rounded-xl border border-[#2B3139] bg-[#1E2329] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Fuel className="h-3.5 w-3.5 text-[#F0B90B]" />
          <span className="text-xs text-[#848E9C]">Estimated Gas</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-[#EAECEF]">{estimatedGas}</p>
          {estimatedGasUSD && (
            <p className="text-[10px] text-[#848E9C]">{estimatedGasUSD}</p>
          )}
        </div>
      </div>

      {/* Expandable Steps */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-xs text-[#848E9C] transition hover:text-[#EAECEF]"
        >
          <span>Transaction Steps ({steps.length})</span>
          {showDetails ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {showDetails && (
          <div className={`mt-2 space-y-2 ${reducedMotion ? "" : "animate-fade-in-up"}`}>
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg bg-[#1E2329] px-3 py-2"
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${step.color}`}
                  >
                    <StepIcon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#EAECEF]">{step.label}</p>
                    <p className="text-[11px] text-[#848E9C]">{step.detail}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-[#848E9C]" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security Footer */}
      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 px-3 py-2">
        <Lock className="h-3.5 w-3.5 text-emerald-500/50" />
        <p className="text-[10px] text-[#848E9C]">
          Simulated locally. No data leaves your browser until you confirm.
        </p>
      </div>

      {/* Confirmation Checkbox */}
      {!isProcessing && (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#2B3139] bg-[#1E2329] px-3 py-2.5 transition hover:bg-[#2B3139]">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#848E9C] bg-transparent text-[#00D4AA] focus:ring-[#00D4AA]/20"
          />
          <span className="text-xs text-[#848E9C]">
            I have reviewed the transaction details and understand the balance changes
          </span>
        </label>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 rounded-xl border border-[#2B3139] bg-[#1E2329] py-2.5 text-sm font-medium text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={!confirmed || isProcessing}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-[#EAECEF] shadow-lg transition ${
            confirmed && !isProcessing
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30"
              : "cursor-not-allowed bg-gray-700 text-[#848E9C] shadow-none"
          }`}
        >
          {isProcessing ? (
            <>
              <Zap className="h-4 w-4 animate-pulse" />
              {processingMessage}
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Confirm & Sign
            </>
          )}
        </button>
      </div>
    </div>
  );
}
