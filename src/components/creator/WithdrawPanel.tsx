"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Wallet,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

type WithdrawMethod = "usdc_onchain" | "fiat_guide";
type WithdrawStatus = "idle" | "confirming" | "processing" | "success" | "error";

const BLOCKSCOUT_BASE = "https://testnet.blockscout.injective.network/tx";

// Mock balance
const AVAILABLE_BALANCE = 234.75;

interface WithdrawPanelProps {
  balance?: number;
}

export function WithdrawPanel({ balance = AVAILABLE_BALANCE }: WithdrawPanelProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<WithdrawMethod>("usdc_onchain");
  const [status, setStatus] = useState<WithdrawStatus>("idle");
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);

  const parsedAmount = parseFloat(amount) || 0;
  const isValidAmount = parsedAmount > 0 && parsedAmount <= balance;

  const handleWithdraw = () => {
    if (!isValidAmount || method !== "usdc_onchain") return;

    setStatus("confirming");
    setTimeout(() => {
      setStatus("processing");
      setTimeout(() => {
        const mockHash =
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");
        setTxHash(mockHash);
        setStatus("success");
      }, 2000);
    }, 1000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setAmount("");
    setStatus("idle");
    setTxHash("");
  };

  const setMax = () => {
    setAmount(balance.toFixed(2));
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <ArrowUpRight className="h-5 w-5 text-gray-400" />
        Withdraw
      </h3>

      {/* Balance display */}
      <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
        <p className="text-xs text-emerald-400/70">Available Balance</p>
        <p className="mt-1 text-2xl font-bold text-emerald-400">
          ${balance.toFixed(2)} <span className="text-sm font-normal text-emerald-400/60">USDC</span>
        </p>
      </div>

      {status === "success" ? (
        /* Success state */
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-400">
                Withdrawal Successful
              </p>
              <p className="text-xs text-emerald-400/60">
                ${parsedAmount.toFixed(2)} USDC sent to your wallet
              </p>
            </div>
          </div>

          {/* Transaction hash */}
          {txHash && (
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Transaction Hash</span>
                <button
                  onClick={() => handleCopy(txHash)}
                  className="flex items-center gap-1 text-gray-400 transition hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="break-all font-mono text-xs text-gray-300">
                {txHash}
              </p>
              <a
                href={`${BLOCKSCOUT_BASE}/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 transition-all hover:border-emerald-500/30 hover:bg-white/[0.06] hover:text-emerald-400"
              >
                <ExternalLink className="h-4 w-4" />
                View on Blockscout
              </a>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.06]"
          >
            Make Another Withdrawal
          </button>
        </div>
      ) : status === "processing" || status === "confirming" ? (
        /* Processing state */
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="mt-4 text-sm text-gray-300">
            {status === "confirming"
              ? "Confirming transaction..."
              : "Processing withdrawal..."}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            ${parsedAmount.toFixed(2)} USDC
          </p>
        </div>
      ) : (
        /* Input state */
        <div className="space-y-4">
          {/* Amount input */}
          <div>
            <label className="mb-2 block text-xs text-gray-400">
              Withdrawal Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                max={balance}
                step="0.01"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-3 pl-8 pr-20 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-cyan-500/40"
              />
              <button
                onClick={setMax}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white/[0.06] px-2 py-1 text-xs font-medium text-cyan-400 transition hover:bg-white/[0.1]"
              >
                MAX
              </button>
            </div>
            {amount && !isValidAmount && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3 w-3" />
                {parsedAmount <= 0
                  ? "Enter a valid amount"
                  : "Exceeds available balance"}
              </p>
            )}
          </div>

          {/* Withdraw method */}
          <div>
            <label className="mb-2 block text-xs text-gray-400">
              Withdrawal Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMethod("usdc_onchain")}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                  method === "usdc_onchain"
                    ? "border-cyan-500/30 bg-cyan-500/[0.08]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    method === "usdc_onchain"
                      ? "bg-cyan-500/15"
                      : "bg-white/[0.04]"
                  }`}
                >
                  <Wallet
                    className={`h-4.5 w-4.5 ${
                      method === "usdc_onchain"
                        ? "text-cyan-400"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      method === "usdc_onchain"
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    USDC On-chain
                  </p>
                  <p className="text-xs text-gray-500">Direct transfer</p>
                </div>
              </button>

              <button
                onClick={() => setMethod("fiat_guide")}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                  method === "fiat_guide"
                    ? "border-amber-500/30 bg-amber-500/[0.08]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    method === "fiat_guide"
                      ? "bg-amber-500/15"
                      : "bg-white/[0.04]"
                  }`}
                >
                  <CreditCard
                    className={`h-4.5 w-4.5 ${
                      method === "fiat_guide"
                        ? "text-amber-400"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      method === "fiat_guide"
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    Fiat Off-ramp
                  </p>
                  <p className="text-xs text-gray-500">Convert to cash</p>
                </div>
              </button>
            </div>
          </div>

          {/* Fiat guide notice */}
          {method === "fiat_guide" && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-4">
              <p className="text-xs text-amber-400/80">
                Fiat off-ramp is not directly supported. You can bridge USDC to
                a supported chain and use services like MoonPay or Transak to
                convert to fiat.
              </p>
              <a
                href="https://transak.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-400 transition hover:text-amber-300"
              >
                Learn more <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Confirm button */}
          <button
            onClick={handleWithdraw}
            disabled={!isValidAmount || method !== "usdc_onchain"}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUpRight className="h-4 w-4" />
            {method === "usdc_onchain"
              ? `Withdraw $${parsedAmount.toFixed(2)} USDC`
              : "Select On-chain to Withdraw"}
          </button>
        </div>
      )}
    </div>
  );
}
