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
          <div className="w-full max-w-sm rounded-xl border border-[#2B3139] bg-[#1a1a1a] p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/15">
                  <Heart className="h-4 w-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#EAECEF]">Tip Creator</p>
                  <p className="text-[10px] text-[#848E9C]">{creatorName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#848E9C] hover:text-[#EAECEF]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sent ? (
              <div className="flex flex-col items-center py-8">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check className="h-6 w-6 text-[#00D4AA]" />
                </div>
                <p className="text-lg font-semibold text-[#EAECEF]">Tip Sent!</p>
                <p className="text-sm text-[#848E9C]">
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
                          ? "bg-pink-500 text-[#EAECEF]"
                          : "bg-[#2B3139] text-[#848E9C] hover:bg-white/[0.08]"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#2B3139] px-3 py-2">
                  <DollarSign className="h-4 w-4 text-[#848E9C]" />
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Custom amount"
                    className="flex-1 bg-transparent text-sm text-[#EAECEF] outline-none placeholder:text-[#848E9C]"
                  />
                  <span className="text-xs text-[#848E9C]">USDC</span>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={!finalAmount || finalAmount <= 0 || isSending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-semibold text-[#EAECEF] transition hover:opacity-90 disabled:opacity-50"
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

                <p className="mt-2 text-center text-[10px] text-[#848E9C]">
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
