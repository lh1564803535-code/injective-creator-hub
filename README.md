# 🥷 Injective Creator Hub

> **Injective 社区的链上赏金工具 — 发推、评审、自动分 USDC**

🌐 **在线演示**: [localhost:3000](http://localhost:3000)（测试网）

---

## 💡 这是什么？

Injective Creator Hub 是一个去中心化内容创作平台。品牌/社区发布赏金活动，创作者发推/做内容提交链接，社区评审打分，USDC 按贡献自动分配到钱包。

**解决的问题**：社区奖励创作者全靠人工统计 + 手动转账，效率低、容易漏发。

**我们的方案**：链上创建赏金 → 创作者提交内容 → 社区投票 → 智能合约自动分 USDC。全程透明，不可篡改。

---

## 🔄 使用流程

```
赞助商 → 创建活动，存入 USDC 奖金池
    ↓
创作者 → 发推后提交链接
    ↓
社区 → 投票评审（1-5 分）
    ↓
结算 → USDC 按贡献自动到账
```

---

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装

```bash
git clone https://github.com/lh1564803535-code/injective-creator-hub.git
cd injective-creator-hub
npm install
```

### 配置

创建 `.env.local` 文件：

```env
# 合约地址（Injective 测试网）
NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS=0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61

# RPC 节点
NEXT_PUBLIC_INJECTIVE_RPC=https://k8s.testnet.lcd.injective.network

# 链 ID（测试网 1439）
NEXT_PUBLIC_INJECTIVE_CHAIN_ID=1439

# WalletConnect Project ID（可选）
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=你的ID
```

### 运行

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

访问 http://localhost:3000

---

## 📁 项目结构

```
src/
├── app/[locale]/          # 页面（支持 en/zh）
│   ├── page.tsx           # 首页 — 活动流
│   ├── create/            # 创建活动
│   ├── campaign/[id]/     # 活动详情
│   ├── leaderboard/       # 排行榜
│   └── dashboard/         # 我的仪表盘
├── components/
│   ├── layout/            # 布局组件（三栏）
│   │   ├── AppLayout.tsx  # 主布局
│   │   ├── LeftNav.tsx    # 左侧导航
│   │   ├── TopNav.tsx     # 顶部导航
│   │   ├── RightPanel.tsx # 右侧信息面板
│   │   └── MobileBottomNav.tsx  # 移动端底部导航
│   ├── bounty/
│   │   └── BountyCard.tsx # 活动卡片
│   ├── campaign/          # 活动相关组件
│   └── creator/           # 创作者相关组件
├── hooks/
│   └── useBounty.ts       # 合约交互 hooks
├── lib/
│   ├── contract-abi.ts    # 合约 ABI
│   ├── injective.ts       # 工具函数
│   └── wagmi.ts           # 钱包配置
└── i18n/
    ├── en.json            # 英文翻译
    └── zh.json            # 中文翻译
```

---

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | Next.js 16 + React 19 + TypeScript |
| 样式 | Tailwind CSS 4（暗色主题） |
| 区块链 | wagmi + viem + RainbowKit |
| 国际化 | next-intl（中文/英文） |
| 合约 | Solidity 0.8.20（Injective EVM 测试网） |

---

## 📋 合约信息

| 项目 | 值 |
|------|-----|
| 合约地址 | `0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61` |
| 链 | Injective EVM Testnet |
| Chain ID | 1439 |
| USDC | `0xF22bede237A07E121B56d91A491EB7bCDfD1F590` |

### 合约功能

```
createCampaign(title, desc, reward, duration)  → 创建活动
submit(campaignId, contentURI)                  → 提交内容
vote(submissionId, weight)                      → 投票（1-5 分）
settle(campaignId)                              → 结算分配
claimReward(submissionId)                       → 领取奖励
```

---

## 🎨 设计规范

- **主题**：暗色（对标币安广场）
- **背景**：`#0B0E11`
- **卡片**：`#1E2329`
- **主色**：`#00D4AA`（Injective 绿）
- **奖金**：`#F0B90B`（金色）
- **布局**：三栏（左侧导航 + 中间内容 + 右侧信息面板）

---

## 📱 响应式

- **桌面**：完整三栏布局
- **平板**：隐藏右侧面板
- **手机**：底部 Tab 导航栏

---

## 🔗 相关链接

- [Injective 官网](https://injective.com)
- [Injective Discord](https://discord.gg/injective)
- [Injective 测试网水龙头](https://testnet.faucet.injective.network)

---

## 📄 License

MIT
