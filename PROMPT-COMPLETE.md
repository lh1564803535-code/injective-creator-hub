# Injective Creator Hub — 综合修复清单

## 项目信息
- 项目路径：`/Users/longgg/Downloads/injective-creator-hub/`
- 构建命令：`cd /Users/longgg/Downloads/injective-creator-hub && rm -rf .next && npm run build`
- 黑客松截止：2026年6月30日
- 产品定位：Injective 社区的链上赏金工具 — 发推、评审、自动分 USDC

---

## 任务 1：全站改中文

所有 UI 文案从英文改成中文。需要改的文件和文案：

### 左侧导航 `src/components/layout/LeftNav.tsx`
- "Home" → "首页"
- "Leaderboard" → "排行榜"
- "Create" → "创建活动"
- "Dashboard" → "我的活动"
- "Discord" → 保持不变

### 顶部导航 `src/components/layout/TopNav.tsx`
- "Search campaigns..." → "搜索活动..."
- "English" → "中文"（默认显示中文）

### 创建页面 `src/app/[locale]/create/page.tsx`
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

### 右侧面板 `src/components/layout/RightPanel.tsx`
- "Search..." → "搜索..."
- "Hot Campaigns" → "热门活动"
- "Platform Stats" → "平台统计"
- "Total Campaigns" → "活动总数"
- "Total Rewards" → "总奖金"
- "Content Submissions" → "提交总数"
- "Trending" → "热门话题"

### 其他页面
- 首页 `src/app/[locale]/page.tsx` — 所有英文改中文
- 排行榜 `src/app/[locale]/leaderboard/page.tsx` — 英文改中文
- 活动详情 `src/app/[locale]/campaign/[id]/page.tsx` — 英文改中文
- Dashboard `src/app/[locale]/dashboard/page.tsx` — 英文改中文

### 搜索方法
用 grep 搜索所有 `.tsx` 文件中的英文硬编码文案（引号内的英文字符串），逐一替换为中文。注意不要改变量名、CSS 类名、合约 ABI 等技术文本。

---

## 任务 2：添加 X (Twitter) 登录按钮

### 需求
在顶部导航栏的钱包连接按钮旁边，加一个 "🔗 用 X 登录" 按钮。

### 实现方式
不需要真正实现 OAuth（时间不够），只需要：
1. 创建 `src/components/ui/XLoginButton.tsx` 组件
2. 按钮样式：白色边框 + 暗色背景 + "🔗 用 X 登录" 文字
3. 点击后弹出一个简单的提示（用已有的 Toast 组件）："请在 Twitter 上关注 @Injective 并发推参与活动"
4. 在 `src/components/layout/TopNav.tsx` 中，钱包连接按钮旁边引入这个组件

### 样式参考
```tsx
<button className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm text-gray-300 hover:bg-white/[0.06] transition">
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
  用 X 登录
</button>
```

---

## 任务 3：修复 Hydration 错误

### 问题
首页有 React Hydration 错误，因为浏览器扩展在 `<html>` 标签上加了 `data-tz-s` 和 `data-tz-update` 属性，导致服务端/客户端不匹配。

### 修复
在 `src/app/layout.tsx`（根 layout，不是 `[locale]/layout.tsx`）的 `<html>` 标签上加 `suppressHydrationWarning`：

```tsx
<html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
```

如果根 layout 不存在，检查 `src/app/[locale]/layout.tsx`，在那里加。

---

## 任务 4：RightPanel 增加内容

当前右侧面板信息不够丰富，需要增加：

### 热门标签区
在 Trending 下面加标签按钮（纯展示，不需要真正搜索）：
```
#Injective  #DeFi  #Tweet-to-Earn  #USDC  #Web3
```

### 关注我们区
在面板底部加：
```
🔗 关注我们
  Twitter · Discord · Telegram
```
（纯文字链接，指向外部 URL）

### 统计数据
确保 Platform Stats 显示：
- 活动总数：5（demo 数据）
- 总奖金：975 USDC（demo 数据）
- 提交总数：61（demo 数据）

---

## 任务 5：活动卡片改进

每个 BountyCard 需要显示：
- 发起人 shortened address（0x1234...5678）
- 活动状态标签（进行中=绿色 / 评审中=黄色 / 已结算=灰色）
- 剩余时间（X天X小时）
- 提交数量

---

## 任务 6：首页活动流

首页需要展示活动卡片列表：
- 从合约读取 campaignCount
- 如果 campaignCount > 0，循环读取每个活动
- 如果 campaignCount = 0，显示 demo 数据（5 条假数据）
- 每条活动用 BountyCard 组件渲染

---

## 构建验证

每次修改后跑：
```bash
cd /Users/longgg/Downloads/injective-creator-hub && rm -rf .next && npm run build
```

确保 build 通过再继续下一个任务。

---

## 约束
- 不要改合约 hooks（`src/hooks/useBounty.ts`）和 ABI（`src/lib/contract-abi.ts`）
- 不要改钱包配置（`src/lib/wagmi.ts`）
- 不要引入新的 npm 依赖
- 暗色主题保持不变（背景 #0B0E11）
- 中文是默认语言
- 不要删除现有页面文件
