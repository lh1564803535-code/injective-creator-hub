# CURRENT_TASK.md — Injective Creator Hub

## 项目状态

### 已完成的工作

**UI 全面改造（PROMPT-FULL-REDESIGN）**
- 三栏布局：LeftNav + Content + RightPanel（对标币安广场）
- 暗色主题：`#0B0E11` 背景 / `#1E2329` 卡片 / `#00D4AA` Injective 绿 / `#F0B90B` 金色
- 新组件：AppLayout, LeftNav, TopNav, RightPanel, BountyCard, MobileBottomNav
- 所有 campaign/creator/ui 组件配色统一

**PROMPT-COMPLETE 6 个任务**
1. ✅ 全站中文 — 默认语言 zh，硬编码英文全部改中文
2. ✅ X 登录按钮 — XLoginButton.tsx，TopNav 钱包按钮旁
3. ✅ Hydration 修复 — `<html suppressHydrationWarning>`
4. ✅ RightPanel 丰富 — 热门标签 + 关注我们区
5. ✅ 活动卡片改进 — BountyCard 加 sponsor 地址
6. ✅ 首页活动流 — useCampaignCount + demo 兜底

**关键 Bug 修复**
- SettleDialog/VoteDialog 的 SubmissionData 导入修复
- BOUNTY_CAMPAIGN_ADDRESS 守卫（防 undefined）
- create page step machine 修复
- getTimeRemaining / getCampaignStatus 真实实现
- formatUSDC 精度修复
- settle 按钮加确认 + sponsor-only

**代码清理**
- 删除 100+ 未使用组件（-34,598 行）
- 统一 formatUSDC

**本轮 Loop 完成**
1. ✅ 合约数据完整集成 — ContractCampaign + CampaignSkeleton
2. ✅ Loading skeleton — 骨架屏加载状态
3. ✅ 错误处理 — 合约调用失败显示错误信息
4. ✅ 移动端适配 — MobileBottomNav 底部 Tab 栏
5. ✅ 动效打磨 — page-enter + card-hover-lift + skeleton-pulse

## 下一步

### 低优先级
1. 删除未使用的 lib 文件（agent-tools.ts, crypto-utils.ts 等）
2. @types/canvas-confetti 移到 devDependencies
3. SubmissionCard 组件优化（投票/领取按钮交互）

## 关键决策
- 不引入新依赖
- 不改 hooks/useBounty.ts 和 lib/contract-abi.ts
- 暗色主题 #0B0E11
- 中文默认
- 合约数据优先，demo 兜底
