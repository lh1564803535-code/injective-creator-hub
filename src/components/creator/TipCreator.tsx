"use client";

import { useState } from "react";
import { Heart, DollarSign, X, Check } from "lucide-react";

interface TipCreatorProps {
  creatorAddress: string;
  creatorName: string;
}

const TIP_AMOUNTS = [1, 5, 10, 25, 50];

export function TipCreator({ creatorAddress, creatorName }: TipCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount <= 0) return;

    setIsSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setSent(true);

    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
      setSelectedAmount(null);
      setCustomAmount("");
    }, 2000);
  };

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-lg bg-pink-500/10 px-3 py-1.5 text-xs text-pink-400 transition hover:bg-pink-500/20"
      >
        <Heart className="h-3.5 w-3.5" />
        Tip
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/15">
                  <Heart className="h-4 w-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Tip Creator</p>
                  <p className="text-[10px] text-gray-500">{creatorName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sent ? (
              <div className="flex flex-col items-center py-8">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="text-lg font-semibold text-white">Tip Sent!</p>
                <p className="text-sm text-gray-500">
                  ${finalAmount} USDC sent to {creatorName}
                </p>
              </div>
            ) : (
              <>
                {/* Preset amounts */}
                <div className="mb-3 grid grid-cols-5 gap-2">
                  {TIP_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`rounded-lg py-2 text-sm font-medium transition ${
                        selectedAmount === amount
                          ? "bg-pink-500 text-white"
                          : "bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Custom amount"
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  />
                  <span className="text-xs text-gray-500">USDC</span>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={!finalAmount || finalAmount <= 0 || isSending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      Send ${finalAmount || "0"} USDC
                    </>
                  )}
                </button>

                <p className="mt-2 text-center text-[10px] text-gray-600">
                  Gas fee: ~0.00008 USD on Injective
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
