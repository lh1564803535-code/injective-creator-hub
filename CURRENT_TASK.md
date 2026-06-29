# CURRENT_TASK.md — Injective Creator Hub

## 项目状态

### 已完成的工作

**UI 全面改造（PROMPT-FULL-REDESIGN）**
- 三栏布局：LeftNav + Content + RightPanel（对标币安广场）
- 暗色主题：`#0B0E11` 背景 / `#1E2329` 卡片 / `#00D4AA` Injective 绿 / `#F0B90B` 金色
- 新组件：AppLayout, LeftNav, TopNav, RightPanel, BountyCard
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
- create page step machine 修复（confirming-create 状态缺失）
- getTimeRemaining / getCampaignStatus 从 stub 改为真实实现
- formatUSDC 精度修复（改用 viem formatUnits）
- settle 按钮加确认对话框（防误触）
- settle 按钮仅对 sponsor 显示
- campaignId 参数校验
- chain ID 统一（从 wagmi.ts 导出）

**代码清理**
- 删除 100+ 未使用组件（34,598 行）
  - campaign: 57 → 7 个
  - creator: 70+ → 13 个
  - ui: 150+ → 20 个
- 统一 formatUSDC（删除重复定义）

### 当前技术栈
- Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
- wagmi + viem + RainbowKit（钱包）
- next-intl（i18n，en/zh）
- 合约：0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61（Injective Testnet 1439）

### Git 提交历史
- `feat: UI redesign to Binance Square dark theme + bug fixes`
- `chore: remove 100+ unused components`
- `refactor: unify formatUSDC to single definition`

## 下一步

### 高优先级
1. ~~**合约数据完整集成**~~ ✅ — 首页 ContractCampaign + useCampaignCount
2. ~~**SubmissionCard loading 状态**~~ ✅ — CampaignSkeleton 骨架屏
3. ~~**error handling**~~ ✅ — 合约调用失败显示错误信息

### 中优先级
4. **移动端适配** — LeftNav 变底部 Tab
5. **动效打磨** — 卡片 hover、页面切换动画

### 中优先级
4. **移动端适配** — LeftNav 变底部 Tab
5. **动效打磨** — 卡片 hover、页面切换动画

### 低优先级
6. **删除更多未使用的 lib 文件** — agent-tools.ts, crypto-utils.ts 等
7. **@types/canvas-confetti 移到 devDependencies**

## 关键决策

- **不引入新依赖** — 只用现有 tailwind + lucide-react
- **不改合约 hooks/ABI** — 只改 UI 层
- **暗色主题为主** — 对标币安广场
- **中文默认** — 但保留 en/zh 切换
- **合约数据优先** — demo 数据仅作兜底
