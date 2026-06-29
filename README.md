# 🥷 Injective Creator Hub

> **AI Agent × x402 Micropayments × Creator Bounties on Injective**

A decentralized content creation platform where AI Agents autonomously settle creator rewards using Injective's x402 micropayment protocol — no human intervention, instant USDC payouts.

🌐 **Live Demo**: [localhost:3000](http://localhost:3000) (Testnet)

---

## 💡 What is this?

Injective Creator Hub is an AI-native creator bounty platform built on Injective EVM. Content creators earn USDC through on-chain bounty campaigns — AI handles the settlement automatically.

**The problem**: Creator payments across borders are slow (3-5 days), expensive (2-3% fees), and require bank accounts. In Web3, even simple transfers cost $5+ in gas on Ethereum.

**The solution**: AI Agents on Injective use x402 micropayments to automatically distribute USDC to creators — gas is $0.00008, settlement is instant (0.64s blocks), and no bank account needed.

---

## 🔄 How it works

```
Sponsor → creates campaign with USDC reward
    ↓
Creator → submits content (tweet, video, article)
    ↓
Community → votes (weight 1-5x)
    ↓
AI Agent → automatically settles USDC proportionally
    ↓
Creator → claims reward on-chain
```

---

## 🧠 AI × Web3 Integration (Innovation)

1. **AI Assistant** — Natural language chat for onboarding. Ask "how do I earn?" and get guided through the flow. Powered by OpenAI-compatible API with local fallback.
2. **x402 Protocol** — Injective's native micropayment protocol for AI Agents. Enables autonomous USDC payments without human sign-off.
3. **Transaction Preview** — AI assesses transaction risk (Safe/Warning/Danger) before signing.

---

## ⛓️ Injective Network Integration (Technical Execution)

| Component | Detail |
|-----------|--------|
| Smart Contract | `BountyCampaign.sol` (Solidity 0.8.20 + OpenZeppelin 5.x) |
| Contract Address | `0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61` |
| Chain | Injective EVM Testnet (Chain ID 1439) |
| USDC | `0xF22bede237A07E121B56d91A491EB7bCDfD1F590` |
| Functions | `createCampaign`, `submit`, `vote`, `settle`, `claimReward` |
| Frontend | wagmi + viem read/write hooks (`src/hooks/useBounty.ts`) |
| Block Explorer | [Testnet Blockscout](https://testnet.blockscout.injective.network) |

### Why Injective?

- **$0.00008 gas** — Micropayments become viable ($1 USDC bounty doesn't cost $5 in gas)
- **0.64s finality** — Payments settle almost instantly
- **Native EVM** — Full compatibility with Ethereum tooling
- **x402 protocol** — Unique to Injective, purpose-built for AI Agent payments

---

## ✨ Key Features

### 🏆 Campaign System
- Create bounty campaigns with USDC reward pools
- Multi-phase flow: Create → Submit → Vote → Settle
- Deadline enforcement on-chain
- Weighted voting (1-5x multiplier)

### 🤖 AI Assistant
- Natural language onboarding ("What is Gas?", "How do I withdraw?")
- 13+ preset Q&A shortcuts
- Transaction risk assessment
- Wallet-aware (shows address and balance)
- LLM-powered with fallback to local responses

### 💰 Live Earnings
- Real-time USDC streaming counter
- 7-day trend visualization
- 30-day forecast
- View-only mode (check any address)

### 📊 Dashboard & Leaderboard
- Creator earnings overview
- Submission tracking
- Reward claiming with confetti celebration
- Ranked leaderboard with search and CSV export

### 🌐 Multi-language
- English / 中文 (next-intl)
- Locale-based routing (`/en`, `/zh`)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Wallet | RainbowKit + wagmi + viem |
| Data | TanStack React Query |
| Smart Contract | Solidity 0.8.20 (Hardhat) |
| AI | OpenAI-compatible API |
| i18n | next-intl |
| Chain | Injective EVM (Testnet 1439) |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/lh1564803535-code/injective-creator-hub.git
cd injective-creator-hub

# Install
npm install --legacy-peer-deps

# Environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```
NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS=0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61
NEXT_PUBLIC_INJECTIVE_RPC=https://k8s.testnet.json-rpc.injective.network/
NEXT_PUBLIC_INJECTIVE_CHAIN_ID=1439
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_key
OPENAI_API_KEY=your_key          # Optional, has fallback
```

### MetaMask Setup

Add Injective EVM Testnet:
- **RPC**: `https://k8s.testnet.json-rpc.injective.network/`
- **Chain ID**: `1439`
- **Explorer**: `https://testnet.blockscout.injective.network`

Get testnet tokens: [Injective Faucet](https://testnet.faucet.injective.network/)

---

## 📁 Project Structure

```
injective-creator-hub/
├── contracts/
│   ├── contracts/BountyCampaign.sol    # On-chain bounty logic
│   ├── scripts/deploy.ts               # Deployment script
│   └── hardhat.config.ts               # Network configs
├── src/
│   ├── app/[locale]/
│   │   ├── page.tsx                    # Home (hero + campaigns)
│   │   ├── dashboard/page.tsx          # Creator dashboard
│   │   ├── create/page.tsx             # Create campaign
│   │   ├── campaign/[id]/page.tsx      # Campaign detail
│   │   └── leaderboard/page.tsx        # Rankings
│   ├── components/
│   │   ├── creator/AIAssistant.tsx     # AI chat
│   │   ├── creator/LiveEarnings.tsx    # Real-time earnings
│   │   ├── campaign/                   # Campaign components
│   │   └── ui/                         # UI primitives
│   ├── hooks/useBounty.ts             # Contract interaction hooks
│   ├── lib/
│   │   ├── contract-abi.ts            # ABI definitions
│   │   ├── injective.ts               # Chain utilities
│   │   └── wagmi.ts                   # Wallet config
│   └── i18n/                          # Translations
└── .env.example
```

---

## 🏗 Smart Contract

`BountyCampaign.sol` — 145 lines of Solidity handling the full bounty lifecycle:

- **createCampaign**: Sponsor deposits USDC, sets title/reward/duration
- **submit**: Creators submit content URI before deadline
- **vote**: Community votes with 1-5x weight after deadline
- **settle**: USDC distributed proportionally by votes
- **claimReward**: Creators claim their allocated reward

---

## 📋 Submission Checklist

- [x] GitHub open-source repo with README
- [x] Smart contract deployed on Injective EVM Testnet
- [x] Frontend with wallet connection (RainbowKit + wagmi)
- [x] i18n support (English + Chinese)
- [x] AI Assistant with OpenAI-compatible API
- [ ] Demo video (≤ 3 minutes)
- [ ] Pitch Deck
- [ ] TypeForm submission

---

## 📚 References

- [Injective Documentation](https://docs.injective.network)
- [x402 Protocol](https://docs.injective.network/developers-ai/x402)
- [iAgent SDK](https://github.com/InjectiveLabs/iagent-ts)
- [MCP Server](https://github.com/InjectiveLabs/mcp-server)
- [Injective Nova Program](https://injectivenova.com)

---

## 📄 License

MIT
