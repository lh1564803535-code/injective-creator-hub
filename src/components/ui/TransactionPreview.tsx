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
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      dotClass: "bg-emerald-400",
    },
    warning: {
      icon: AlertTriangle,
      label: "Warning",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      dotClass: "bg-amber-400",
    },
    danger: {
      icon: AlertTriangle,
      label: "Danger",
      className: "border-red-500/30 bg-red-500/10 text-red-400",
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
    in: { prefix: "+", color: "text-emerald-400", bg: "bg-emerald-500/10", arrow: "text-emerald-400" },
    out: { prefix: "-", color: "text-red-400", bg: "bg-red-500/10", arrow: "text-red-400" },
    none: { prefix: "", color: "text-gray-400", bg: "bg-gray-500/10", arrow: "text-gray-400" },
  };

  const cfg = directionConfig[change.direction];

  return (
    <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
      <div className="flex items-center gap-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${cfg.bg}`}>
          <span className="text-[10px] font-bold">{change.token.slice(0, 2)}</span>
        </div>
        <span className="text-xs text-gray-400">{change.token}</span>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${cfg.color}`}>
          {cfg.prefix}{change.amount}
        </p>
        {change.usdValue && (
          <p className="text-[10px] text-gray-600">{change.usdValue}</p>
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
        <Eye className="h-4 w-4 text-cyan-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Transaction Preview
        </span>
      </div>

      {/* Risk Assessment */}
      <RiskBadge level={riskLevel} message={riskMessage} />

      {/* Contract Info */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">Contract</span>
          </div>
          {contractVerified && (
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span className="text-[10px] font-medium">Verified</span>
            </div>
          )}
        </div>
        <p className="font-mono text-xs text-gray-300">{target}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
            {functionName}
          </span>
          <span className="text-[10px] text-gray-600">on {network}</span>
        </div>
      </div>

      {/* Balance Changes */}
      {balanceChanges.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-400">Estimated Balance Changes</p>
          <div className="space-y-1.5">
            {balanceChanges.map((change, i) => (
              <BalanceChangeRow key={i} change={change} />
            ))}
          </div>
        </div>
      )}

      {/* Gas Estimate */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Fuel className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs text-gray-400">Estimated Gas</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-white">{estimatedGas}</p>
          {estimatedGasUSD && (
            <p className="text-[10px] text-gray-600">{estimatedGasUSD}</p>
          )}
        </div>
      </div>

      {/* Expandable Steps */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-xs text-gray-500 transition hover:text-gray-300"
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
                  className="flex items-start gap-3 rounded-lg bg-white/[0.02] px-3 py-2"
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${step.color}`}
                  >
                    <StepIcon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-300">{step.label}</p>
                    <p className="text-[11px] text-gray-600">{step.detail}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-gray-700" />
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
        <p className="text-[10px] text-gray-500">
          Simulated locally. No data leaves your browser until you confirm.
        </p>
      </div>

      {/* Confirmation Checkbox */}
      {!isProcessing && (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition hover:bg-white/[0.04]">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-transparent text-cyan-500 focus:ring-cyan-500/20"
          />
          <span className="text-xs text-gray-400">
            I have reviewed the transaction details and understand the balance changes
          </span>
        </label>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={!confirmed || isProcessing}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-lg transition ${
            confirmed && !isProcessing
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30"
              : "cursor-not-allowed bg-gray-700 text-gray-500 shadow-none"
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
