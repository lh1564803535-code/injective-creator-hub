# CURRENT_TASK.md — Injective Creator Hub

## 项目状态

### 已完成的工作

**UI 全面改造（PROMPT-FULL-REDESIGN）**
- 三栏布局：LeftNav + Content + RightPanel（对标币安广场）
- 暗色主题：`#0B0E11` 背景 / `#1E2329` 卡片 / `#00D4AA` Injective 绿 / `#F0B90B` 金色
- 新组件：AppLayout, LeftNav, TopNav, RightPanel, BountyCard
- 所有 campaign/creator/ui 组件配色统一
- 56 个 campaign 组件中仅 5 个实际被使用

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

### 当前技术栈
- Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
- wagmi + viem + RainbowKit（钱包）
- next-intl（i18n，en/zh）
- 合约：0xAc84d5A83DAfaC2eBfcEfE26773Da16229066f61（Injective Testnet 1439）

### 已知技术债
- 56 个 campaign 组件中大量 scaffold 死代码
- formatUSDC 在 5 个文件中重复定义
- useEffect dependency array 不完整
- 无 USDC 余额检查
- @types/canvas-confetti 在 dependencies 而非 devDependencies
- 未提交 git（所有改动在 working tree）

## 下一步

### 高优先级
1. **git commit** — 当前所有改动未提交
2. **删除死代码** — 56 个 campaign 组件中未使用的约 50 个
3. **统一 formatUSDC** — 只保留 useBounty.ts 的版本

### 中优先级
4. **合约数据优先** — 首页/RightPanel 应优先用合约数据，demo 仅兜底
5. **SubmissionCard loading 状态** — 加 skeleton
6. **error handling** — 合约调用失败时显示错误信息

### 低优先级
7. **移动端适配** — LeftNav 变底部 Tab
8. **动效打磨** — 卡片 hover、页面切换动画

## 关键决策

- **不引入新依赖** — 只用现有 tailwind + lucide-react
- **不改合约 hooks/ABI** — 只改 UI 层
- **暗色主题为主** — 对标币安广场
- **中文默认** — 但保留 en/zh 切换
