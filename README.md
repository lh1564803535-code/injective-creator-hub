# Injective Creator Hub

Decentralized content creation platform on Injective EVM. Create bounty campaigns, submit content, vote on submissions, and earn USDC rewards — all on-chain.

## Features

- **Campaign System** — Create bounty campaigns with USDC rewards, deadlines, and multi-phase timelines (create -> submit -> vote -> settle)
- **Content Submissions** — Creators submit work to campaigns and earn rewards based on community votes
- **Weighted Voting** — Stake-weighted voting with 1-5x multiplier and star ratings
- **Settlement and Claims** — On-chain reward distribution with confetti celebration animations
- **Creator Dashboard** — Track earnings, submissions, and claim pending rewards
- **Leaderboard** — Ranked creators with pagination, search, CSV export, and campaign filtering
- **Wallet Integration** — MetaMask and WalletConnect via RainbowKit, configured for Injective EVM (chain ID 2525)
- **Smart Contract** — Solidity BountyCampaign.sol with full campaign lifecycle (Hardhat project in `contracts/`)
- **Responsive Design** — Mobile hamburger menu, adaptive layouts, safe-area padding
- **Dark Theme** — Consistent dark UI with cyan/blue accent palette, smooth animations, and glow effects

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| UI Components | Radix UI (Tabs, Separator, Slot) |
| Icons | Lucide React |
| Wallet | RainbowKit + wagmi + viem |
| Data Fetching | TanStack React Query |
| Validation | Zod v4 |
| Animations | Canvas Confetti + CSS keyframes |
| Smart Contract | Solidity (Hardhat) |
| Chain | Injective EVM (chain ID 2525) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to React 19 peer dependency conflicts with some Radix UI packages.

### Environment Variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS` | Deployed BountyCampaign contract address | — |
| `NEXT_PUBLIC_INJECTIVE_RPC` | Injective EVM RPC endpoint | `https://k8s.global.mainnet.lcd.injective.network` |
| `NEXT_PUBLIC_INJECTIVE_CHAIN_ID` | Injective EVM chain ID | `2525` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID | — |

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run start
```

## Deployment

### Vercel (Recommended)

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Set the environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

### Other Platforms

This is a standard Next.js app. It can be deployed anywhere that supports Node.js:

```bash
npm run build
npm run start
```

## Project Structure

```
injective-creator-hub/
├── contracts/                  # Hardhat smart contract project
│   ├── BountyCampaign.sol      # Campaign lifecycle contract
│   ├── hardhat.config.ts
│   └── scripts/deploy.ts
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (wallet provider, nav, footer)
│   │   ├── page.tsx            # Home page (hero, stats, featured campaign, activity feed)
│   │   ├── globals.css         # Global styles, animations, dark theme variables
│   │   ├── leaderboard/page.tsx
│   │   ├── create/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── campaign/[id]/page.tsx
│   ├── components/
│   │   ├── app-navigation.tsx  # Responsive navbar with wallet connect
│   │   ├── wallet-provider.tsx # RainbowKit + wagmi + React Query providers
│   │   ├── Footer.tsx
│   │   ├── ui/                 # Reusable UI primitives (button, card, input, etc.)
│   │   ├── campaign/           # CampaignCard, CampaignList, VoteDialog, SettleDialog, etc.
│   │   └── creator/            # LeaderboardTable, CreatorDashboard, RewardAnimation, etc.
│   ├── lib/
│   │   ├── injective.ts        # Chain utilities (address formatting, time helpers)
│   │   ├── wagmi.ts            # wagmi config with Injective EVM chain
│   │   ├── mock-data.ts        # Mock creators, campaigns, submissions, activity
│   │   └── utils.ts            # cn() utility for className merging
│   └── types/
│       └── creator-settlement.ts  # TypeScript types for the domain model
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

## License

MIT
