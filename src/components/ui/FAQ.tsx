"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is Injective Creator Hub?",
    answer: "Injective Creator Hub is a decentralized content creation platform built on Injective EVM. Creators can participate in bounty campaigns, submit content, vote on submissions, and earn USDC rewards — all on-chain.",
  },
  {
    question: "How do I get started?",
    answer: "Simply connect your wallet (MetaMask or WalletConnect), get testnet tokens from the faucet, and start exploring campaigns. You can create your own campaign or submit content to existing ones.",
  },
  {
    question: "What are the fees?",
    answer: "Gas fees on Injective are nearly zero (~0.001 INJ per transaction). The platform doesn't charge any additional fees for voting, submitting, or claiming rewards.",
  },
  {
    question: "How does the AI assistant work?",
    answer: "Our AI assistant helps you interact with the platform using natural language. You can ask about wallet setup, campaign participation, withdrawals, and more. It provides transaction previews before you sign.",
  },
  {
    question: "What is real-time streaming?",
    answer: "Inspired by Superfluid protocol, your earnings flow every second. You can watch your balance grow in real-time, similar to a taxi meter. This provides instant gratification and transparency.",
  },
  {
    question: "Is my data safe?",
    answer: "Yes. All transactions are on-chain and verifiable. We never store your private keys. The platform uses industry-standard security practices and provides transaction previews for review before signing.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] transition hover:bg-white/[0.04]"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 shrink-0 text-cyan-400" />
                <span className="text-sm font-medium text-white">{item.question}</span>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-white/[0.04] px-4 pb-4 pt-3">
                <p className="pl-8 text-sm text-gray-400">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
