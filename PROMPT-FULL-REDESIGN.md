# Injective Creator Hub — 全面 UI 改造计划

## 项目信息

### 基本信息
- 项目路径：`/Users/longgg/Downloads/injective-creator-hub/`
- 黑客松：Injective Nova Program（新星计划），截止 2026年6月30日
- 定位：链上赏金工具 — 给 Injective 社区用的 Tweet-to-Earn 平台
- **竞品对标**：币安广场（社交布局）+ Zealy/Galxe（任务赏金机制）+ The Incentive（Tweet-to-Earn）

### 参考开源项目（可以抄 UI 组件）

#### 1. BountyBoard（最相关，904 stars）
- GitHub：https://github.com/veithly/BountyBoard
- 线上：https://bountyboard-web3.vercel.app/
- 技术栈：Next.js + TypeScript + Tailwind CSS + shadcn/ui
- **可以抄的部分**：
  - `components/BoardCard.tsx` — 任务卡片组件
  - `components/TaskList.tsx` — 任务列表
  - `app/page.tsx` — 首页布局
  - `hooks/useContract.ts` — wagmi hooks 封装模式
  - `providers/config.ts` — 多链配置模式
  - `constants/contract-address.ts` — 合约地址管理
  - `store/` — 状态管理
- **不要抄的部分**：合约逻辑（我们有自己的 BountyCampaign.sol）

#### 2. Tesior（Solana 赏金平台）
- GitHub：https://github.com/jogeshwar01/tesior-web
- 可参考：排行榜组件、GitHub 集成模式

#### 3. 币安广场 UI（视觉参考）
- 布局：三栏（左侧导航 + 中间内容流 + 右侧信息面板）
- 暗色主题：背景 #0B0E11，卡片 #1E2329
- 帖子卡片：头像 + 用户名 + 内容 + 互动数据
- 参考截图已保存在 PROMPT.md 中

### 技术栈
- **前端**：Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
- **区块链**：wagmi + viem + RainbowKit（钱包连接）
- **合约**：Solidity 0.8.20，部署在 Injective 测试网
- **国际化**：next-intl（支持 en/zh）
- **构建命令**：`npm --prefix /Users/longgg/Downloads/injective-creator-hub run build`
- **开发命令**：`npm --prefix /Users/longgg/Downloads/injective-creator-hub run dev`
- **端口**：3000

### 合约信息（不要改）
- 地址：`0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61`
- 链：Injective Testnet, Chain ID 1439
- USDC：`0xF22bede237A07E121B56d91A491EB7bCDfD1F590`
- 功能：createCampaign → submit → vote(1-5) → settle → claimReward
- 状态：已部署，campaignCount = 0（还没有数据）

### 已有 hooks（不要改）
```typescript
// src/hooks/useBounty.ts
useCampaignCount()          // 读取活动总数
useCampaign(id)             // 读取单个活动
useSubmissionCount()        // 读取提交总数
useCreateCampaign()         // 创建活动
useSubmitContent()          // 提交内容
useVote()                   // 投票/评审
useSettle()                 // 结算
useClaimReward()            // 领取奖励
```

---

## 产品定位

### 一句话
> Injective 社区的链上赏金工具 — 发推、评审、自动分 USDC。

### 使用场景
Injective 官方社区（Discord/Ninja Masters 大使计划）经常发活动奖励创作者：
- "发推讨论 Injective，奖励 INJ"
- "做视频/文章，社区投票选最佳"
- 目前全靠人工管理：Zealy 任务 + Discord Bot + 手动转账

**我们做的事：** 把这个流程自动化 — 链上创建赏金 → 创作者提交推文链接 → 社区评审 → USDC 自动分配。

### 为什么不用 Discord？
Discord 能做：聊天、发帖、投票、管理角色
Discord **做不了**：链上 USDC 自动分配、不可篡改的评审记录、透明的奖金池

**分工：** Discord 负责讨论，Creator Hub 负责分配奖励。

---

## UI 改造方案：币安广场风格

### 布局参考（币安广场）

币安广场的三栏布局：

```
┌──────────┬──────────────────────────────┬──────────┐
│ 左侧导航  │        中间内容流              │  右侧信息  │
│          │                              │          │
│ 发现     │  ┌─ 用户头像 用户名 · 时间 ─┐  │  🔍 搜索  │
│ 新闻     │  │                          │  │          │
│ 通知     │  │   帖子内容（文字/图片）     │  │ 🏆 热门  │
│ 个人主页  │  │                          │  │  话题1   │
│ 书签     │  │   💬16  ❤️1  🔁2  👁19.2k │  │  话题2   │
│ 聊天     │  └──────────────────────────┘  │  话题3   │
│ 历史记录  │                              │          │
│ 创作者中心│  ┌─ 另一条帖子 ─────────────┐  │ 📊 统计  │
│ 设置     │  │                          │  │  活动数  │
│          │  │   ...                     │  │  总奖励  │
│          │  └──────────────────────────┘  │  创作者数 │
└──────────┴──────────────────────────────┴──────────┘
```

### 我们的改造映射

| 币安广场 | Creator Hub | 说明 |
|---------|-------------|------|
| 发现（Feed） | **活动流（Bounty Feed）** | 展示所有赏金活动，按时间倒序 |
| 新闻 | **排行榜（Leaderboard）** | 按 earnings 排序的创作者列表 |
| 通知 | **我的活动（My Bounties）** | 我创建/参与的活动 |
| 个人主页 | **Profile** | 钱包地址 + 参与统计（MVP 简化） |
| 创作者中心 | **创建活动** | 简单表单 + Demo 一键创建 |
| 帖子 | **活动卡片** | 标题 + 奖金 + 截止时间 + 提交数 |
| 点赞/评论 | **评审打分** | 1-5 分权重投票 |
| 热门话题 | **热门活动** | 按奖金大小排序 |

### 配色方案（暗色主题，对标币安广场）

```css
/* 基础色 */
--bg-primary: #0B0E11;      /* 最深背景（币安黑） */
--bg-secondary: #1E2329;     /* 卡片背景 */
--bg-tertiary: #2B3139;      /* 悬浮/选中态 */
--text-primary: #EAECEF;     /* 主文字 */
--text-secondary: #848E9C;   /* 次要文字 */
--border: #2B3139;           /* 边框 */

/* 强调色（Injective 品牌） */
--accent-primary: #00D4AA;   /* Injective 绿（按钮/高亮） */
--accent-secondary: #F0B90B; /* 币安黄（奖金/USDC） */
--accent-danger: #F6465D;    /* 红色（亏损/警告） */
```

---

## 分阶段实施计划（50 轮迭代）

### Phase 1：全局布局重构（第 1-8 轮）

**目标：** 把三栏布局搭起来，暗色主题统一。
**参考：** 先 clone BountyBoard 看它的 `app/page.tsx` 和 `components/` 结构，然后改造为我们的三栏布局。

#### 第 1-2 轮：全局样式重置
- 创建 `src/app/globals.css` 统一暗色主题变量
- 背景色 `#0B0E11`，文字色 `#EAECEF`
- 所有页面统一暗色风格

#### 第 3-5 轮：三栏布局组件
创建 `src/components/layout/AppLayout.tsx`：
```
┌──────────────────────────────────────────────┐
│ TopNav（固定）                                │
├────────┬─────────────────────┬───────────────┤
│ LeftNav │ ContentArea         │ RightPanel    │
│ (固定)  │ (可滚动)            │ (固定)        │
└────────┴─────────────────────┴──────────────┘
```

LeftNav 组件（`src/components/layout/LeftNav.tsx`）：
- Logo + "Creator Hub" 标题
- 发现（首页/活动流）
- 排行榜
- 创建活动
- 我的活动
- Discord 入口链接（外链到 Injective Discord）
- 底部：ChainStatus 区块状态

TopNav 组件（`src/components/layout/TopNav.tsx`）：
- 搜索框（纯 UI，不需要真正搜索）
- RainbowKit 钱包连接按钮
- 语言切换（en/zh）

RightPanel 组件（`src/components/layout/RightPanel.tsx`）：
- 搜索输入框
- 热门活动（按奖金排序）
- 平台统计（活动数/总奖金/创作者数）
- 热门话题标签

#### 第 6-8 轮：导航路由
- `/en` 或 `/zh` → 活动流（Feed）
- `/en/leaderboard` → 排行榜
- `/en/create` → 创建活动
- `/en/campaign/[id]` → 活动详情
- `/en/my` → 我的活动（MVP 可简化）

### Phase 2：活动流 Feed（第 9-18 轮）

**目标：** 首页展示赏金活动列表，卡片式布局。

#### 第 9-12 轮：活动卡片组件
创建 `src/components/bounty/BountyCard.tsx`：

```
┌──────────────────────────────────────────┐
│  🟢 Injective Community     活动进行中    │
│                                          │
│  🚀 发推赢 USDC — Injective Creator     │
│     Bounty                               │
│                                          │
│  发一条关于 Injective 的推文，提交链接，  │
│  社区评审，按贡献分 USDC 奖金             │
│                                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │💰 奖金│ │⏰ 截止│ │📝 提交│ │👥 参与│       │
│  │ 100  │ │ 7天  │ │ 12  │ │ 45  │       │
│  │ USDC │ │      │ │     │ │     │       │
│  └─────┘ └─────┘ └─────┘ └─────┘       │
│                                          │
│  发起人: 0x1234...5678    [查看详情 →]    │
└──────────────────────────────────────────┘
```

#### 第 13-15 轮：Feed 页面
`src/app/[locale]/page.tsx` 改造：
- 左侧：LeftNav
- 中间：活动卡片列表（从合约读取 campaignCount + 循环 getCampaign）
- 右侧：RightPanel
- 如果 campaignCount = 0，显示空状态引导

#### 第 16-18 轮：活动状态标签
- 进行中（绿色）
- 评审中（黄色）
- 已结算（灰色）
- 空状态：引导去 Discord 或创建活动

### Phase 3：创建活动页（第 19-26 轮）

**目标：** 简洁的创建表单 + Demo 一键创建。

#### 第 19-22 轮：创建表单重设计
`src/app/[locale]/create/page.tsx`：

```
┌──────────────────────────────────────────┐
│  创建赏金活动                             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  🎯 一键创建 Demo 活动              │  │
│  │                                    │  │
│  │  预设：发推赢 USDC — 10 USDC 奖金   │  │
│  │  一键创建，体验完整流程              │  │
│  │                                    │  │
│  │  [🎯 Create Demo Campaign]          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ───────── 或自定义创建 ─────────        │
│                                          │
│  活动标题 *                               │
│  ┌────────────────────────────────────┐  │
│  │ e.g. 发推讨论 Injective 新功能      │  │
│  └────────────────────────────────────┘  │
│                                          │
│  活动描述                                 │
│  ┌────────────────────────────────────┐  │
│  │ 描述活动规则：发推要求、评审标准...  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  奖金 (USDC) *        持续时间 (天)       │
│  ┌──────────────┐   ┌──────────────┐    │
│  │ 10           │   │ 7            │    │
│  └──────────────┘   └──────────────┘    │
│                                          │
│  ℹ️ 创作者将提交 Twitter 推文链接参与     │
│                                          │
│  [创建活动]                               │
└──────────────────────────────────────────┘
```

#### 第 23-26 轮：Demo 按钮流程
- 钱包未连接 → 显示 ConnectButton
- 连接后 → 绿色大按钮
- 点击 → 检查网络 → Approve USDC → createCampaign → 跳转
- Loading 状态：Approving... → Confirming... → Creating... → Done!

### Phase 4：活动详情页（第 27-36 轮）

**目标：** 展示活动详情 + 提交推文 + 评审打分。

#### 第 27-30 轮：活动详情布局
`src/app/[locale]/campaign/[id]/page.tsx`：

```
┌──────────────────────────────────────────┐
│  ← 返回活动列表                           │
│                                          │
│  🟢 发推赢 USDC — Injective Creator     │
│     Bounty                               │
│                                          │
│  发一条关于 Injective 的推文，提交链接，  │
│  社区评审，按贡献分 USDC 奖金             │
│                                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │💰 100│ │⏰ 7天│ │📝 12│ │👥 45│       │
│  │ USDC │ │      │ │     │ │     │       │
│  └─────┘ └─────┘ └─────┘ └─────┘       │
│                                          │
│  发起人: 0x1234...5678                    │
│  合约: 0xAc84...66f61                    │
│                                          │
├──────────────────────────────────────────┤
│  提交你的推文                             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ https://x.com/your/status/...      │  │
│  └────────────────────────────────────┘  │
│  [提交推文]                               │
│                                          │
├──────────────────────────────────────────┤
│  提交列表（评审区）                        │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ @creator1 · 2小时前                 │  │
│  │ https://x.com/creator1/status/123  │  │
│  │ ⭐⭐⭐⭐☆ 4.2分 · 15票              │  │
│  │ [评审打分 1-5]                      │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ @creator2 · 5小时前                 │  │
│  │ https://x.com/creator2/status/456  │  │
│  │ ⭐⭐⭐☆☆ 3.1分 · 8票               │  │
│  │ [评审打分 1-5]                      │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

#### 第 31-34 轮：提交推文功能
- 输入框校验 Twitter/X 链接格式
- 调用 useSubmitContent() 提交
- 提交后显示在列表中

#### 第 35-36 轮：评审打分
- 每个提交下方显示 1-5 星评分
- 调用 useVote() 提交评审
- 显示平均分和投票数

### Phase 5：排行榜 + 其他页面（第 37-44 轮）

#### 第 37-40 轮：排行榜
`src/app/[locale]/leaderboard/page.tsx`：

```
┌──────────────────────────────────────────┐
│  创作者排行榜                             │
│                                          │
│  🥇 0xAbC1...234   45 次提交  $12,500    │
│  🥈 0xDeF4...567   38 次提交  $8,700     │
│  🥉 0x789a...cDe   29 次提交  $5,400     │
│     0x012a...CdE   21 次提交  $3,200     │
│     0xFfFf...fFf   15 次提交  $1,800     │
│     ...                                  │
└──────────────────────────────────────────┘
```

#### 第 41-44 轮：我的活动 + 空状态
- 我的活动：筛选当前用户地址参与的活动
- 空状态：引导到 Discord 或创建活动
- 统一所有空状态的设计语言

### Phase 6：打磨 + 修复（第 45-50 轮）

#### 第 45-46 轮：响应式适配
- 移动端：隐藏 RightPanel，LeftNav 变底部 Tab
- 平板：LeftNav 折叠成图标

#### 第 47-48 轮：动效 + 微交互
- 卡片 hover 效果
- 页面切换动画
- Loading skeleton

#### 第 49-50 轮：最终验证
- `npm run build` 无报错
- 所有页面可访问
- 钱包连接正常
- Demo 按钮流程正常
- 中英文切换正常

---

## 文件清单（需要创建/修改）

### 新建文件
```
src/components/layout/AppLayout.tsx      # 三栏布局
src/components/layout/LeftNav.tsx        # 左侧导航
src/components/layout/TopNav.tsx         # 顶部导航
src/components/layout/RightPanel.tsx     # 右侧信息面板
src/components/bounty/BountyCard.tsx     # 活动卡片
src/components/bounty/BountyFeed.tsx     # 活动流列表
src/components/bounty/SubmitForm.tsx     # 提交推文表单
src/components/bounty/VotePanel.tsx      # 评审打分面板
src/components/bounty/EmptyState.tsx     # 空状态组件
src/components/ui/StatusBadge.tsx        # 状态标签
src/components/ui/StatsCard.tsx          # 统计卡片
```

### 修改文件
```
src/app/globals.css                      # 全局暗色主题
src/app/[locale]/layout.tsx              # 布局包裹
src/app/[locale]/page.tsx                # 首页 → 活动流
src/app/[locale]/create/page.tsx         # 创建页重设计
src/app/[locale]/campaign/[id]/page.tsx  # 活动详情
src/app/[locale]/leaderboard/page.tsx    # 排行榜
src/components/app-navigation.tsx        # 可能被 LeftNav 替代
```

### 不要动的文件
```
src/lib/contract-abi.ts                  # 合约 ABI
src/hooks/useBounty.ts                   # wagmi hooks
src/lib/wagmi.ts                         # 钱包配置
src/lib/injective.ts                     # 链配置
src/middleware.ts                         # i18n 路由
src/i18n/                                # 国际化
contracts/                               # 智能合约
src/components/ui/ChainStatus.tsx        # 区块状态
```

---

## 设计规范

### 字体
- 正文：`Inter` 或系统字体
- 数据/数字：`JetBrains Mono` 或等宽字体

### 间距系统
- 基础单位：4px
- 组件间距：16px / 24px / 32px
- 卡片内边距：16px / 20px

### 圆角
- 卡片：12px
- 按钮：8px
- 头像：50%
- 标签：6px

### 阴影
- 卡片：`0 2px 8px rgba(0,0,0,0.3)`
- 弹窗：`0 8px 32px rgba(0,0,0,0.5)`

### 动效
- 页面切换：fade 200ms
- 卡片 hover：translateY(-2px) + shadow 增强
- Loading：skeleton pulse 动画

---

## 关键约束

1. **不要改合约 hooks 和 ABI** — 只改 UI 层
2. **不要删现有页面** — 重写内容，保留路由
3. **不要引入新依赖** — 用现有 tailwind + lucide-react
4. **每次修改后跑 build** — `npm --prefix /Users/longgg/Downloads/injective-creator-hub run build`
5. **中文默认** — 但支持 en/zh 切换
6. **暗色主题为主** — 可选亮色但默认暗色
7. **移动端适配** — 响应式设计

## 口播参考（录视频用）

> Injective 社区经常发活动奖励创作者，但全靠人工统计发推、手动转账，效率低还容易漏发。
>
> Creator Hub 把这个流程搬到了链上。
>
> 连接钱包，创建赏金活动，存入 USDC。创作者发推后提交链接。到期后社区评审打分，USDC 按贡献自动到账，链上可验证。
>
> 不需要人工审核，不需要手动转账，全程透明。
>
> Discord 社区负责讨论，这里负责分配奖励。一个入口，解决一件事。
>
> Injective Nova 黑客松项目，合约已部署在测试网。
