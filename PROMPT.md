# Injective Creator Hub — 新星计划冲刺 Prompt

## 背景
你在维护一个 Next.js 16 项目：Injective Creator Hub（路径：/Users/longgg/Downloads/injective-creator-hub/）。

这是参加 **Injective Nova Program（新星计划）** 黑客松的项目，**截止提交：2026年6月30日**。

项目定位：**AI Agent × x402 微支付 × 创作者赏金** — AI Agent 通过 Injective 的 x402 协议自动结算创作者 USDC 赏金，实现"AI 决策 → 链上执行 → 自动付款"的闭环。

## 为什么这个方向能赢
Injective 生态有 3 个独特工具，你的项目应该深度集成：

1. **x402 协议**（https://docs.injective.network/developers-ai/x402）
   - Injective 原生的 AI Agent 微支付协议
   - AI Agent 可以在无人工干预的情况下自动支付 USDC
   - 比传统支付快、便宜（Injective Gas ≈ $0.00008）
   - **你的项目用这个**：AI Agent 自动向创作者支付赏金

2. **iAgent SDK**（https://github.com/InjectiveLabs/iagent-ts）
   - TypeScript SDK，用自然语言控制 Injective 链上操作
   - 支持发送支付、查询余额、执行交易
   - **你的项目用这个**：AI 助手理解用户意图后调用链上操作

3. **MCP Server**（https://github.com/InjectiveLabs/mcp-server）
   - AI Agent 的 Injective 交易能力接口
   - 兼容 Claude Desktop、Cursor、LangChain
   - **你的项目用这个**：AI 助手的后端能力

## ⚠️ 竞争情报（你必须知道的）
1. **AdventureX 2025 已有类似项目**：Injective DevRel 博客明确提到，去年黑客松上有一个"去中心化赏金平台，用户发布任务附带加密奖励，AI Agent 从链接自动创建任务"。你的项目必须差异化。
2. **你的差异化是 x402**：去年那个项目只做了"AI 创建任务"，没有做"AI 自动付款"。你用 x402 协议实现 AI Agent 自主结算，这是注入生态的独特能力。
3. **80%+ 的团队用了 AI**：光有 AI 不够，必须展示 AI 与链上执行的深度结合。
4. **2023 Injective Hackathon 冠军是 Exotic Markets**（收益生成），Pyth Bounty 赢家是 Magik（资产管理）— 评委喜欢"金融创新 + 技术深度"的组合。

## 评估标准（评委看什么）
1. **创新性（25%）**：AI × Web3 结合方式是否有新意 → x402 + 创作者赏金 = 新
2. **技术实现（25%）**：是否集成 Injective 主网/测试网，AI 与链上能力结合深度
3. **应用价值（20%）**：是否解决真实问题 → 创作者结算难、跨境支付贵
4. **产品体验（15%）**：UX 流畅，AI 降低门槛
5. **生态契合度（15%）**：长期发展与孵化价值

## 技术栈
- Next.js 16 + React 19 + Tailwind CSS 4
- wagmi + viem + RainbowKit（已配置 Injective EVM chain ID 2525）
- next-intl（中英文，已有 [locale] 路由和 en.json/zh.json）
- @tanstack/react-query
- 可选新增：@injectivelabs/sdk-ts（链上交互）、@injectivelabs/iagent-ts（AI Agent SDK）

## 当前状态
- ✅ RainbowKit compact 模式已启用（src/components/wallet-provider.tsx）
- ✅ i18n 基础结构存在（src/i18n/）
- ✅ 钱包配置正确（src/lib/wagmi.ts，chain ID 2525）
- ❌ middleware.ts 已删除（i18n 路由断了）
- ❌ 全页面都是 mock 数据，无真实链上交互
- ❌ AI Assistant 是硬编码本地响应（src/components/creator/AIAssistant.tsx）
- ❌ 首页信息过载（700 行 src/app/[locale]/page.tsx）
- ❌ Dashboard 空状态无引导

## 必须完成的任务（按优先级）

### 任务 1：修复 middleware + i18n 路由
创建 `src/middleware.ts`：
```ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
export default createMiddleware(routing);
export const config = {
  matcher: ['/', '/(en|zh)/:path*']
};
```
确保 `/` → `/en`，`/zh` 正常。

### 任务 2：首页 Hero 区精简
修改 `src/app/[locale]/page.tsx`（当前 700 行）：

**只改 Hero 区**（页面顶部到第一个 section 之前），改为：
- 大标题："AI Agent Pays Creators on Injective"
- 副标题："x402 micropayments. Zero human intervention. Instant USDC."
- 两个 CTA：「Start Earning」+「Read Docs」
- 3 个信任数字（总奖励 / 创作者数 / 活动数），每个带 "Demo" pill

**移除这些组件的渲染**（保留文件不删）：AIAgentSection、MCPIntegration、NetworkStats、LiveEarnings、ScrollEarningsCounter、HomepageStats

**保留**：CampaignList、LeaderboardTable、FeatureHighlights、CTASection、FAQ、RoadmapTimeline、NewsletterSignup

### 任务 3：Dashboard 空状态
修改 `src/app/[locale]/dashboard/page.tsx`：

钱包未连接 → 显示引导页：
- "Connect Your Wallet to Start Earning"
- ConnectButton + 3 步引导（连接→参加→赚取）

钱包已连接无活动 → 显示：
- "No campaigns yet. Browse available campaigns."
- "Browse Campaigns" 按钮

### 任务 4：AI 助手改造（关键任务）

**改造 `src/components/creator/AIAssistant.tsx`**：
1. 保留现有 `getLocalAIResponse()` 作为 fallback
2. 添加 `/api/chat` 调用逻辑（先调接口，失败 fallback）
3. 新增快捷按钮：「查看收益」「如何提现」「什么是 x402」
4. AI 回答中引用 Injective 生态真实信息（x402、iAgent、Gas 便宜）

**创建 `src/app/api/chat/route.ts`**：
```ts
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  const {messages} = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  if (!apiKey) {
    // Fallback: return a helpful message instead of error
    return NextResponse.json({
      message: 'AI 助手暂时不可用，但你可以浏览下方快捷按钮获取帮助。'
    });
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `你是 Injective Creator Hub 的 AI 助手。你的核心能力：
1. 帮助创作者在 Injective 区块链上通过内容创作赚取 USDC
2. 解释 x402 微支付协议：AI Agent 如何自动向创作者支付赏金
3. 引导用户连接钱包、参加活动、查看收益
4. 用简单语言解释 Web3 概念（Gas、钱包、USDC）

关于 Injective 的关键信息：
- 链 ID：2525（EVM 兼容）
- Gas 费：约 $0.00008（几乎为零）
- 支持 USDC 原生转账
- x402 协议：AI Agent 的自动微支付协议

回答规则：
- 简洁友好，用中文
- 不编造链上数据
- 引导用户到 Dashboard 查看真实数据
- 提到 x402 时说明这是 Injective 的独特能力`
          },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return NextResponse.json({
      message: data.choices[0].message.content
    });
  } catch {
    return NextResponse.json({
      message: 'AI 助手暂时不可用，但你可以浏览下方快捷按钮获取帮助。'
    });
  }
}
```

### 任务 5：Mock 数据标注
统一 "Demo" pill 样式：
```tsx
<span className="ml-2 inline-flex items-center rounded-full bg-gray-700/50 px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Demo</span>
```

添加位置：
- `src/components/creator/LiveEarnings.tsx` — 标题旁
- `src/components/ui/NetworkStats.tsx` — 标题旁
- `src/components/creator/LeaderboardTable.tsx` — 表格上方
- 首页统计数字（任务 2）

### 任务 6：README.md
```md
# Injective Creator Hub

> AI Agent × x402 Micropayments × Creator Bounties on Injective

## What is this?
An AI-native creator bounty platform on Injective. AI Agents autonomously 
settle creator rewards using Injective's x402 micropayment protocol — 
no human intervention, instant USDC payouts.

## Why Injective?
- **x402 Protocol**: AI Agents pay for services without human setup
- **Near-zero gas**: $0.00008 per transaction — micropayments are viable
- **Native EVM**: Compatible with all Ethereum tooling
- **0.64s finality**: Payments settle almost instantly

## Key Features
- 🤖 AI Assistant with real LLM integration (OpenAI-compatible)
- 💰 x402-powered autonomous USDC payouts
- 🏆 Campaign-based creator bounties with community voting
- 🌐 Bilingual (EN/ZH)
- 🔗 RainbowKit wallet integration (Injective EVM)

## Architecture
```
User → AI Assistant (Next.js API) → x402 Payment → Injective EVM → USDC
```

## Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Wallet**: wagmi + viem + RainbowKit
- **Chain**: Injective EVM (Chain ID 2525)
- **AI**: OpenAI-compatible API (configurable)
- **i18n**: next-intl

## Getting Started
\`\`\`bash
npm install
cp .env.example .env.local  # Add your keys
npm run dev
\`\`\`

### Environment Variables
\`\`\`
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_key
OPENAI_API_KEY=your_key          # Optional, has fallback
OPENAI_BASE_URL=https://api.openai.com/v1  # Optional
\`\`\`

## Injective Integration
- Chain ID: 2525 (Injective EVM Mainnet)
- RPC: k8s.global.mainnet.lcd.injective.network
- Explorer: explorer.injective.network
- x402 Docs: docs.injective.network/developers-ai/x402

## References
- [Injective Docs](https://docs.injective.network)
- [x402 Protocol](https://docs.injective.network/developers-ai/x402)
- [iAgent SDK](https://github.com/InjectiveLabs/iagent-ts)
- [MCP Server](https://github.com/InjectiveLabs/mcp-server)
```

### 任务 7：添加真实链上数据（关键 — 评估标准第2项）
评委看的是"是否集成 Injective 主网/测试网"。你需要在项目中至少有一个真实链上数据展示。

**在首页或 Dashboard 添加一个 Injective Network Status 组件**：
- 从 Injective RPC 获取真实区块高度（block number）
- 获取链 ID 确认（2525）
- 显示 "Connected to Injective EVM Mainnet" + 当前区块号
- 使用 viem 的 `getBlockNumber` 即可，不需要额外依赖

示例代码（创建 `src/components/ui/ChainStatus.tsx`）：
```tsx
"use client";
import { useBlockNumber } from 'wagmi';

export function ChainStatus() {
  const { data: blockNumber, isLoading } = useBlockNumber();

  return (
    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-emerald-300">
        Injective EVM #{isLoading ? '...' : blockNumber?.toString()}
      </span>
    </div>
  );
}
```

把这个组件放到首页 Hero 区的信任指标旁边，或 Dashboard 顶部。

### 任务 8：创建 .env.example
```
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Injective EVM
NEXT_PUBLIC_INJECTIVE_CHAIN_ID=2525
NEXT_PUBLIC_INJECTIVE_RPC=https://k8s.global.mainnet.lcd.injective.network

# AI (optional — has fallback)
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
```

## 禁止做的事
- 不要删除现有组件文件，只修改或新增
- 不要改动 `src/lib/wagmi.ts` 的链配置
- 不要引入新的 CSS 框架或组件库
- 不要重写整个首页 — 只改 Hero 区 + 移除冗余区块渲染
- 不要动 Footer、AppNavigation 的结构
- 每次修改后确保 `npm run build` 无报错

## 验证清单
- [ ] `npm run build` 成功
- [ ] `/` 自动重定向到 `/en`
- [ ] `/en` 和 `/zh` 首页正常渲染
- [ ] Hero 区简洁，有 CTA，数字有 "Demo" 标识
- [ ] Dashboard 空状态有引导
- [ ] AI 助手调用 `/api/chat`（无 API key 时有 fallback）
- [ ] Mock 数据有 "Demo" pill
- [ ] ChainStatus 组件显示真实区块高度（Connected to Injective EVM #xxxxx）
- [ ] README.md 完整且包含 Injective 生态链接（x402、iAgent、MCP Server）
- [ ] .env.example 存在
