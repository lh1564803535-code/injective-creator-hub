# Injective Creator Hub — 连接合约到 UI

## 背景
项目路径：/Users/longgg/Downloads/injective-creator-hub/

这是 Injective Nova Program（新星计划）黑客松项目，截止 2026年6月30日。

**项目已经有完整的智能合约和前端，但两者是断开的。** 你的任务是把它们连起来。

## 项目已有资产（不要重新创建）

### 智能合约
- `contracts/contracts/BountyCampaign.sol` — 完整的赏金合约（145行）
  - createCampaign：赞助商存入 USDC 创建活动
  - submit：创作者提交作品 URI
  - vote：社区投票（权重 1-5）
  - settle：按投票比例分配 USDC
  - claimReward：创作者领取奖励
- `contracts/scripts/deploy.ts` — 部署到 Injective 测试网
- 合约地址：`0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61`（注释中写的，需验证）

### 前端 hooks
- `src/hooks/useBounty.ts`（182行）— 完整的 wagmi hooks
  - 读取：useCampaignCount, useSubmissionCount, useCampaign, useSubmission, useHasVoted
  - 写入：useCreateCampaign, useSubmitContent, useVote, useSettle, useClaimReward
- `src/lib/contract-abi.ts` — ABI 定义 + 合约地址
- `src/lib/injective.ts` — 链配置 + 辅助函数（formatUSDC, shortenAddress 等）

### 页面
- `src/app/[locale]/campaign/[id]/page.tsx` — 已使用合约 hooks
- `src/app/[locale]/create/page.tsx` — 创建活动页面
- `src/components/campaign/CreateCampaignForm.tsx` — 创建活动表单

## 核心问题（必须解决）

### 问题 1：首页全是 mock 数据
`src/app/[locale]/page.tsx`（700行）使用 MOCK_CAMPAIGNS、MOCK_CREATORS 等硬编码数据。
应该用 useCampaignCount + useCampaign hooks 从合约读取真实数据。

### 问题 2：Dashboard 未连接合约
`src/app/[locale]/dashboard/page.tsx` 使用 mock 数据。
应该用 useCreatorSubmissions（如果有的话）或从合约读取当前用户的活动参与情况。

### 问题 3：双 ABI 问题
- `src/lib/contract-abi.ts` 用 JSON ABI
- `src/lib/injective.ts` 用 viem parseAbi()
两套 ABI 定义并存，容易不一致。应该统一为一套。

### 问题 4：agent-tools.ts 是 mock
`src/lib/agent-tools.ts` 有 mock campaign 数据，应该改为调用合约。

## 任务清单

### 任务 1：验证合约部署状态
检查合约是否真的部署在 Injective 测试网上。用 viem 的 publicClient 读取合约的 campaignCount()：
```ts
// 在 src/lib/injective.ts 中已有 publicClient 配置
// 尝试读取 campaignCount，如果返回 0 或报错，说明合约未部署
```
如果合约未部署，这个信息很重要 — 但不要尝试部署（需要测试网 INJ 和私钥）。

### 任务 2：首页连接合约数据
修改 `src/app/[locale]/page.tsx`：

**Hero 区保持简洁**（参考 PROMPT.md 的任务 2），但信任指标改为：
- 总奖励：从合约读取所有活动的 totalReward 之和（如果合约有数据）
- 活动数：useCampaignCount()
- 创作者数：从合约事件或 submissionCount 推断

**活动区**：替换 MOCK_CAMPAIGNS 为合约数据
- 用 useCampaignCount() 获取总数
- 循环 useCampaign(id) 获取每个活动详情
- 如果合约没有数据（campaignCount = 0），显示"暂无活动"而不是 mock 数据

**关键原则**：如果合约没有真实数据，显示空状态，不要 fallback 到 mock 数据。

### 任务 3：Dashboard 连接合约
修改 `src/app/[locale]/dashboard/page.tsx`：

钱包已连接后：
- 显示用户的活动参与情况（用合约数据）
- 显示用户的投票记录
- 显示待领取的奖励
- 如果没有数据，显示空状态引导

### 任务 4：统一 ABI
删除 `src/lib/injective.ts` 中的重复 ABI 定义。
统一使用 `src/lib/contract-abi.ts` 的 JSON ABI。
更新 `src/lib/injective.ts` 中的读取函数，使用统一的 ABI。

### 任务 5：AI 助手连接合约
修改 `src/components/creator/AIAssistant.tsx`：
- 在本地响应中添加"查询活动"功能
- 当用户问"有什么活动"时，调用合约读取真实数据
- 创建 `/api/chat/route.ts`（如果不存在），使用 OpenAI 兼容接口

### 任务 6：清理 mock 数据标注
在所有使用 mock 数据的位置添加 "Demo" 标签（灰色 pill）：
- 如果数据来自合约 → 不需要标签
- 如果数据是 mock → 必须有 "Demo" 标签

### 任务 7：ChainStatus 组件
创建 `src/components/ui/ChainStatus.tsx`：
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
放到首页 Hero 区或 Dashboard 顶部。

### 任务 8：middleware 修复
创建 `src/middleware.ts`：
```ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
export default createMiddleware(routing);
export const config = {
  matcher: ['/', '/(en|zh)/:path*']
};
```

### 任务 9：README.md
```md
# Injective Creator Hub
> AI-Powered Creator Bounties on Injective

## Smart Contract
- BountyCampaign.sol on Injective EVM Testnet
- Address: 0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61
- Functions: createCampaign, submit, vote, settle, claimReward

## How it works
1. Sponsor creates campaign with USDC reward
2. Creators submit content before deadline
3. Community votes after deadline
4. AI Agent settles — USDC distributed proportionally
5. Creators claim rewards

## Tech Stack
- Frontend: Next.js 16, React 19, Tailwind CSS 4
- Smart Contract: Solidity 0.8.20, OpenZeppelin 5.x
- Chain: Injective EVM (Chain ID 2525)
- Wallet: wagmi + viem + RainbowKit
- AI: OpenAI-compatible API

## Getting Started
npm install && npm run dev

## Contract
cd contracts && npx hardhat compile
```

## 禁止做的事
- 不要重新创建智能合约
- 不要重新创建 useBounty.ts hooks
- 不要删除现有页面文件
- 不要改动合约 ABI 结构
- 每次修改后确保 `npm run build` 无报错

## 验证清单
- [ ] `npm run build` 成功
- [ ] 首页显示合约数据（或"暂无活动"空状态）
- [ ] Dashboard 连接合约
- [ ] ChainStatus 显示真实区块号
- [ ] middleware 修复，`/` → `/en`
- [ ] mock 数据有 "Demo" 标签
- [ ] README.md 存在
