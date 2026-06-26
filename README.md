# Injective Creator Hub

Decentralized content creation platform on Injective EVM. Create bounty campaigns, submit content, vote on submissions, and earn USDC rewards — all on-chain.

**Built for [Injective Nova Program](https://form.typeform.com/to/ug03BC6z)**

## Features

### Core Platform
- **Campaign System** — Create bounty campaigns with USDC rewards, deadlines, and multi-phase timelines (create → submit → vote → settle)
- **Content Submissions** — Creators submit work to campaigns and earn rewards based on community votes
- **Weighted Voting** — Stake-weighted voting with 1-5x multiplier and star ratings
- **Settlement and Claims** — On-chain reward distribution with confetti celebration animations
- **Creator Dashboard** — Track earnings, submissions, and claim pending rewards
- **Leaderboard** — Ranked creators with pagination, search, CSV export, and campaign filtering

### Real-Time Earnings (Superfluid-inspired)
- **LiveEarnings** — Real-time USDC counter with requestAnimationFrame animation
- **7-Day Trend Chart** — SVG sparkline showing earnings history
- **30-Day Forecast** — Predicted earnings based on current streaming rate
- **View-Only Mode** — View any address's earnings without connecting wallet
- **ScrollEarningsCounter** — "YOU SCROLL, WE STREAM" interactive experience

### AI Assistant (TxGPT/Coinbase-inspired)
- **Natural Language Chat** — Ask questions about wallet, campaigns, Gas, USDC, etc.
- **13 Preset Q&A** — Wallet creation, withdrawals, voting, SocialFi, AI Agent, streaming
- **Transaction Preview** — Risk assessment before signing (Safe/Warning/Danger)
- **Wallet-Aware** — Shows connected address and balance
- **Real AI API** — Ollama integration (qwen3:14b) with mock fallback
- **Quick Buttons** — 6 shortcut buttons for common queries

### Blockchain Integration
- **Wallet Integration** — MetaMask and WalletConnect via RainbowKit
- **Smart Contract** — Solidity BountyCampaign.sol (Hardhat project in `contracts/`)
- **iAgent SDK** — TypeScript interface for Injective's AI Agent capabilities
- **Testnet Ready** — Configured for Injective EVM Testnet (Chain ID 1439)

### UX & Accessibility
- **Dark Theme** — Consistent dark UI (#0a0a0a) with cyan/amber accents
- **Reduced Motion** — All animations respect `prefers-reduced-motion`
- **Responsive Design** — Mobile hamburger menu, adaptive layouts
- **Command Palette** — Cmd+K quick navigation and actions
- **Notification Center** — Real-time alerts for votes, rewards, deadlines

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
| AI | Ollama (qwen3:14b) + Mock fallback |
| Smart Contract | Solidity (Hardhat) |
| Chain | Injective EVM (Testnet 1439 / Mainnet 2525) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)
- MetaMask or WalletConnect compatible wallet

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
| `NEXT_PUBLIC_INJECTIVE_RPC` | Injective EVM RPC endpoint | `https://k8s.testnet.json-rpc.injective.network/` |
| `NEXT_PUBLIC_INJECTIVE_CHAIN_ID` | Injective EVM chain ID | `1439` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID | — |
| `OLLAMA_URL` | Ollama API URL (optional) | `http://localhost:11434` |
| `OLLAMA_MODEL` | Ollama model name (optional) | `qwen3:14b` |

### Injective Testnet Configuration

Add to MetaMask:
- **Network Name**: Injective EVM Testnet
- **RPC URL**: `https://k8s.testnet.json-rpc.injective.network/`
- **Chain ID**: `1439`
- **Currency Symbol**: INJ
- **Block Explorer**: `https://testnet.blockscout.injective.network/blocks`

### Get Testnet Tokens

- Official Faucet: https://testnet.faucet.injective.network/
- Google Faucet: https://cloud.google.com/application/web3/faucet/injective/testnet

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

## Smart Contracts

### Compile

```bash
cd contracts
npm install
npx hardhat compile
```

### Deploy to Testnet

```bash
# Create .env file with your private key
echo "PRIVATE_KEY=your_private_key" > contracts/.env

# Deploy
cd contracts
npm run deploy:testnet
```

### Verify on Blockscout

```bash
npx hardhat verify --network injective-testnet DEPLOYED_CONTRACT_ADDRESS
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
│   ├── hardhat.config.ts       # Network configs (testnet + mainnet)
│   └── scripts/deploy.ts
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (providers, nav, AI assistant)
│   │   ├── page.tsx            # Home page (hero, stats, campaigns)
│   │   ├── globals.css         # Global styles, animations, dark theme
│   │   ├── api/chat/route.ts   # AI Chat API (Ollama + mock)
│   │   ├── leaderboard/
│   │   ├── create/
│   │   ├── dashboard/
│   │   └── campaign/[id]/
│   ├── components/
│   │   ├── app-navigation.tsx  # Responsive navbar with wallet
│   │   ├── wallet-provider.tsx # RainbowKit + wagmi providers
│   │   ├── Footer.tsx
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── ScrollEarningsCounter.tsx  # "YOU SCROLL, WE STREAM"
│   │   │   ├── CommandPalette.tsx         # Cmd+K quick actions
│   │   │   └── NotificationCenter.tsx     # Real-time alerts
│   │   ├── campaign/           # CampaignCard, VoteDialog, SettleDialog
│   │   └── creator/
│   │       ├── LiveEarnings.tsx      # Real-time USDC counter
│   │       ├── AIAssistant.tsx       # AI chat with transaction preview
│   │       ├── CreatorDashboard.tsx  # Main dashboard view
│   │       └── ...
│   ├── lib/
│   │   ├── injective.ts        # Chain utilities
│   │   ├── wagmi.ts            # wagmi config
│   │   ├── iagent.ts           # iAgent SDK integration
│   │   ├── mock-data.ts        # Mock data
│   │   └── utils.ts            # Utilities
│   └── types/
│       └── creator-settlement.ts
├── research-live-earnings-ai-assistant/  # Research artifacts
│   ├── outline.yaml
│   ├── fields.yaml
│   └── results.md
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Research & Development

This project incorporates research from:

- **Superfluid** — Real-time streaming payments, local interpolation, View-only mode
- **Coinbase Agentic Wallets** — x402 protocol, 4-layer permissions, session keys
- **Farcaster/Lens** — SocialFi creator earnings, Collect model, instant settlement
- **TxGPT Bot** — Natural language blockchain interaction
- **Rabby Wallet** — Transaction simulation and risk assessment

See `research-live-earnings-ai-assistant/results.md` for detailed findings.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Links

- [Injective Documentation](https://docs.injective.network)
- [Injective Testnet Faucet](https://testnet.faucet.injective.network/)
- [Testnet Block Explorer](https://testnet.blockscout.injective.network)
- [iAgent SDK](https://github.com/InjectiveLabs/iAgent)
- [Nova Program Registration](https://form.typeform.com/to/ug03BC6z)
