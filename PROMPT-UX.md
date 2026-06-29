# Injective Creator Hub — UI 叙事对齐 + 体验打磨

## 背景
项目路径：/Users/longgg/Downloads/injective-creator-hub/
这是 Injective Nova 黑客松项目，截止 2026年6月30日。

**项目已有完整功能（合约已部署、前端已连通、Demo 按钮已就绪），但 UI 叙事和产品定位不一致。** 你的任务是把前端体验对齐到真实产品定位。

## 产品定位

### 我们做什么
链上自动化版的 Zealy/EngageR — 社区创建 Twitter 赏金活动，创作者发推提交链接，社区评审打分，USDC 按贡献自动分配。

### 核心用户
- **发起方（Sponsor）**：Injective 生态项目方、社区管理员、DAO
- **参与方（Creator）**：KOL、内容创作者、社区成员

### 真实使用场景
Injective 官方社区经常发活动：
- "发推讨论 Injective，按浏览量奖励 INJ"
- "做一条关于 Injective 的视频，社区投票选最佳"
- Zealy Tasks、Ninja Masters 大使计划、Kaito Yapper 排行榜

**痛点：** 这些活动全靠人工管理 — 手动统计谁发了推、手动看浏览量、手动转账。效率低、不透明、容易漏发。

### 我们的解决方案
- 社区发起赏金活动，存入 USDC 奖金池
- 创作者发推后提交推文链接
- 到期后社区评审打分（投票权重 1-5）
- USDC 按评审分数比例自动分配，链上可验证

## 当前代码状态

### 合约（不需要改）
- 地址：`0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61`（Injective 测试网，Chain ID 1439）
- 功能：createCampaign → submit → vote → settle → claimReward
- 合约逻辑完全正确，投票机制本质就是"社区评审打分"

### 需要调整的文件

#### 1. `src/app/[locale]/create/page.tsx` — Demo 活动
当前 Demo 活动内容：
```
title: "Welcome to Creator Hub"
description: "Your first campaign — submit content and earn USDC"
```

改成：
```
title: "🚀 发推赢 USDC — Injective Creator Bounty"
description: "发一条关于 Injective 的推文，提交链接，社区评审，按贡献分 USDC 奖金"
```

#### 2. `src/components/campaign/CreateCampaignForm.tsx` — 创建表单
当前表单字段是通用的 "Title" / "Description" / "Reward" / "Duration"。

需要调整：
- 字段保持通用（不同活动类型不同），但 placeholder 提示改成 Twitter 相关
- Title placeholder: `"e.g. 发推讨论 Injective 新功能"`
- Description placeholder: `"描述活动规则：发推要求、评审标准、奖励分配方式"`
- 加一个说明文字："创作者将提交 Twitter 推文链接参与活动"

#### 3. `src/app/[locale]/campaign/[id]/page.tsx` — 活动详情页
如果有这个页面：
- 把"投票"措辞改成"评审"
- 把"提交作品"改成"提交推文"
- 提交输入框 placeholder 改成 `"https://x.com/your_handle/status/..."`

#### 4. `src/app/[locale]/page.tsx` — 首页
- Hero 区的描述如果还是通用的，改成 Twitter 赏金相关
- 如果有 mock 数据里的活动描述，改成真实的 Twitter 赏金场景

#### 5. 通用措辞替换
在所有页面中：
- "投票" → "评审"（或保留"投票"但加说明"为创作者作品打分"）
- "Submit Content" → "Submit Tweet" / "提交推文"
- "contentURI" → "Tweet URL" / "推文链接"
- "creator" → 保持不变（这个是对的）

### 不需要改的文件
- `src/lib/contract-abi.ts` — 合约 ABI
- `src/hooks/useBounty.ts` — wagmi hooks
- `src/lib/wagmi.ts` — 钱包配置
- `src/middleware.ts` — i18n 路由
- `src/components/ui/ChainStatus.tsx` — 区块状态
- `contracts/` — 智能合约目录
- `src/i18n/` — 国际化配置

## 竞品参考

| 竞品 | 模式 | 我们的优势 |
|------|------|-----------|
| Zealy | 任务积分，手动审核 | 链上自动分配，无需人工 |
| EngageR | Discord Bot 发任务 | 更透明，USDC 直接到账 |
| Galxe | 凭证系统，复杂 | 更简单，一键创建 |
| The Incentive | Tweet2Earn，链下 | 链上可验证，不可篡改 |

## 验证清单
- [ ] `npm run build` 成功
- [ ] Demo 活动标题/描述改成 Twitter 赏金相关
- [ ] 创建表单 placeholder 提示 Twitter 推文
- [ ] 活动详情页"投票"改"评审"
- [ ] 提交入口提示输入推文链接
- [ ] 首页描述对齐产品定位
- [ ] 所有页面措辞一致

## 约束
- 不要改合约 ABI 或 hooks
- 不要改钱包配置
- 不要删除现有页面
- 不要改动 i18n 的 message 文件（除非你确定要加翻译 key）
- 每次修改后确保 `npm run build` 无报错
- 注意：项目根目录在 `/Users/longgg/Downloads/injective-creator-hub/`，但 bash 默认 CWD 是 `/Users/longgg`，用 `npm --prefix /Users/longgg/Downloads/injective-creator-hub run build` 构建
