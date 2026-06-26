import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    faq: [
      {
        question: "What is Injective Creator Hub?",
        answer: "Injective Creator Hub is a decentralized content creation platform built on Injective EVM. Creators can participate in bounty campaigns, submit content, vote on submissions, and earn USDC rewards — all on-chain.",
      },
      {
        question: "How do I get started?",
        answer: "Simply connect your wallet (MetaMask or WalletConnect), get testnet tokens from the faucet, and start exploring campaigns.",
      },
      {
        question: "What are the fees?",
        answer: "Gas fees on Injective are nearly zero (~0.001 INJ per transaction). The platform doesn't charge any additional fees.",
      },
      {
        question: "How does the AI assistant work?",
        answer: "Our AI assistant helps you interact with the platform using natural language. You can ask about wallet setup, campaign participation, withdrawals, and more.",
      },
      {
        question: "What is real-time streaming?",
        answer: "Inspired by Superfluid protocol, your earnings flow every second. You can watch your balance grow in real-time.",
      },
      {
        question: "Is my data safe?",
        answer: "Yes. All transactions are on-chain and verifiable. We never store your private keys.",
      },
    ],
    total: 6,
    timestamp: new Date().toISOString(),
  });
}
