"use client";

import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Injective EVM chain configuration
const injectiveEvm = {
  id: Number(process.env.NEXT_PUBLIC_INJECTIVE_CHAIN_ID || 2525),
  name: "Injective",
  nativeCurrency: {
    name: "INJ",
    symbol: "INJ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_INJECTIVE_RPC || "https://k8s.global.mainnet.lcd.injective.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Injective Explorer",
      url: "https://explorer.injective.network",
    },
  },
} as const;

export const INJECTIVE_CHAIN_ID = injectiveEvm.id;

export const wagmiConfig = getDefaultConfig({
  appName: "Injective Creator Hub",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "2f5a2f12b7b95e71e9a2a5c5e0b1e3c4",
  chains: [injectiveEvm],
  transports: {
    [injectiveEvm.id]: http(process.env.NEXT_PUBLIC_INJECTIVE_RPC || "https://k8s.global.mainnet.lcd.injective.network"),
  },
  ssr: true,
});
