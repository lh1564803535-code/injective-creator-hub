# UI 修复：中文 + X 登录 + 币安广场风格

## 问题 1：全站改中文

当前所有 UI 文案都是英文，需要全部改成中文。

### 需要改的文件和文案

#### 导航栏 `src/components/layout/LeftNav.tsx`
- "Home" → "首页"
- "Leaderboard" → "排行榜"
- "Create" → "创建活动"
- "Dashboard" → "我的活动"
- "Discord" → 保持不变（外链）

#### 顶部导航 `src/components/layout/TopNav.tsx`
- "Search campaigns..." → "搜索活动..."
- "English" → "中文"（默认语言）

#### 创建页面 `src/app/[locale]/create/page.tsx`
- "Create Campaign" → "创建赏金活动"
- "Launch a bounty for content creators on Injective" → "在 Injective 上发起创作者赏金活动"
- "Quick Demo" → "快速体验"
- "One click to create a demo campaign on Injective Testnet. Requires 10 testnet USDC." → "一键创建测试网赏金活动，需要 10 USDC 测试币"
- "🎯 Create Demo Campaign" → "🎯 一键创建 Demo 活动"
- "or create custom" → "或自定义创建"
- "Title *" → "活动标题 *"
- "e.g. Create a meme about Injective" → "e.g. 发推讨论 Injective 新功能"
- "Description" → "活动描述"
- "Describe what kind of content you're looking for..." → "描述活动规则：发推要求、评审标准、奖励分配方式"
- "Reward (USDC) *" → "奖金 (USDC) *"
- "Duration (days)" → "持续时间 (天)"
- "Create Campaign" → "创建活动"

#### 右侧面板 `src/components/layout/RightPanel.tsx`
- "Search..." → "搜索..."
- "Hot Campaigns" → "热门活动"
- "Platform Stats" → "平台统计"
- "Total Campaigns" → "活动总数"
- "Total Rewards" → "总奖金"
- "Content Submissions" → "提交总数"
- "Trending" → "热门话题"

#### 活动卡片 `src/components/bounty/BountyCard.tsx`
- "submissions" → "个提交"
- "USDC" → 保持不变

#### 首页 `src/app/[locale]/page.tsx`
- 如果有英文文案，全部改中文

#### 排行榜 `src/app/[locale]/leaderboard/page.tsx`
- 英文改中文

#### 活动详情 `src/app/[locale]/campaign/[id]/page.tsx`
- 英文改中文

### 搜索所有英文文案
用 grep 搜索所有 `.tsx` 文件中的英文硬编码文案，逐一替换为中文。

---

## 问题 2：添加 X (Twitter) 登录入口

### 需求
在导航栏和 Create 页面添加 "用 X 登录" 按钮。

### 实现方式
不需要真正实现 OAuth（时间不够），只需要：
1. 在 TopNav 钱包连接按钮旁边加一个 "🔗 用 X 登录" 按钮
2. 点击后弹出一个提示框："请在 Twitter 上关注 @Injective 并发推参与活动"
3. 按钮样式：白色边框 + X logo（用 lucide-react 的 ExternalLink 图标代替）

### 文件修改
- `src/components/layout/TopNav.tsx` — 加 X 登录按钮
- 创建一个 `src/components/ui/XLoginButton.tsx` 组件

---

## 问题 3：更像币安广场

### 当前问题
- 左侧导航太简单，没有币安广场那种丰富的导航
- 右侧面板信息不够丰富
- 整体布局虽然已经是三栏，但缺少社交感

### 需要改进的地方

#### LeftNav 增加内容
```
 Creator Hub
 ────────
 🏠 首页（活动流）
 📋 排行榜
 ➕ 创建活动
 📊 我的活动
 ────────
 🔗 Discord 社区
 🔗 Injective 官网
 ────────
 🟢 区块高度 #xxx
```

#### RightPanel 增加内容
```
 🔍 搜索...
 ────────
 🔥 热门活动
   活动1 · 100 USDC
   活动2 · 250 USDC
   活动3 · 50 USDC
 ────────
 📊 平台统计
   活动总数: 5
   总奖金: 975 USDC
   提交总数: 61
 ────────
 #️⃣ 热门标签
   #Injective #DeFi #Tweet-to-Earn
 ────────
 🔗 关注我们
   Twitter · Discord · Telegram
```

#### 活动卡片增加社交元素
每个活动卡片加：
- 发起人头像（用钱包地址前6位做 avatar）
- 发起人名字（用 shortened address）
- 活动状态标签（进行中/评审中/已结算）
- 剩余时间
- 参与人数

---

## 构建验证
每次修改后跑：
```bash
cd /Users/longgg/Downloads/injective-creator-hub && rm -rf .next && npm run build
```

## 约束
- 不要改合约 hooks 和 ABI
- 不要改钱包配置
- 不要引入新的 npm 依赖
- 暗色主题保持不变
- 中文是默认语言
