# 实时收益计价器 & AI 自然语言助手 — 深度调研结果
# Generated: 2026-06-26

## 调研范围
- 实时收益显示：Superfluid, Sablier, Lido, Aave, RealT, Farcaster, Lens
- AI 自然语言助手：Coinbase Agentic Wallets, TxGPT, ChainGPT, Nansen AI, Brian AI
- AI 支付基建：x402 Protocol, Virtuals Protocol

---

## 一、Superfluid — 实时流支付仪表板

### 核心发现
| 字段 | 值 |
|------|-----|
| 刷新机制 | 链上合约级实时计算，flowRate (int96, wei/second) 每秒自动递增 |
| UI 更新频率 | 前端本地插值 ~0ms，链上确认 ~12-24s (Ethereum) |
| 数字动画 | 基于 flowRate 本地插值，每帧更新，无需等待链上确认 |
| 进度样式 | 流式卡片布局 + Super Token flows 图表（历史余额 + 预测） |
| 配色 | 深色底 + 绿色强调 (#10BB35) |
| 数据来源 | 链上智能合约 + The Graph subgraph |
| 多资产聚合 | 支持，13+ 条链跨网络聚合视图 |
| 历史趋势 | Dashboard V2 新增图表可视化 + forecasting |
| 技术栈 | Next.js + React + SDK-Redux + RainbowKit + wagmi |

### 可借鉴的 UX 创新
1. **本地插值** — 基于 flowRate 前端实时推算余额，~0ms 延迟
2. **"YOU SCROLL, WE STREAM"** — 滚动时数字实时递增的交互
3. **Distribution Pools** — 单笔交易 gas 成本向百万级接收者分配
4. **View-only 模式** — 输入任意地址查看流状态，无需连接钱包

### 来源
- https://superfluid.org
- https://app.superfluid.org/
- https://docs.superfluid.org/
- https://medium.com/superfluid-blog/superfluid-dashboard-v2-is-live

---

## 二、Coinbase Agentic Wallets + Base MCP

### 核心发现
| 字段 | 值 |
|------|-----|
| 发布时间 | Agentic Wallets: 2026/2/11, Base MCP: 2026/5/26 |
| 输入方式 | 自然语言 (ChatGPT/Claude) + CLI 命令 |
| 回复类型 | 链上执行 + 结构化确认（交易哈希、余额变动） |
| 功能范围 | 5 大技能：Authenticate/Fund/Send/Trade/Earn |
| 意图抽象 | 高层意图 → 自动链上执行 |
| 执行模型 | MPC + TEE 签名 + 策略引擎 + x402 |
| Agent 钱包 | 是，核心卖点，独立 MPC 托管钱包 |
| 跨链 | 10+ 链 (EVM + Solana)，Base Gasless |
| 权限粒度 | 4 层：按代币/会话总额/单笔限额/对手方白名单 |
| 安全特性 | MPC + AWS Nitro Enclave + 策略引擎 + KYT + 审计日志 |
| 技术栈 | cb-mpc + AgentKit + CDP Server Wallets v2 + x402 + MCP |

### 关键数据
- x402 累计交易量：1.65 亿笔
- 活跃 Agent 数：69,000
- x402 累计金额：$50M
- 签名延迟：< 200ms
- 可用性目标：99.9%

### 可借鉴的 UX 创新
1. **x402 协议** — Agent 自主付费获取服务的完整闭环
2. **Session Keys** — 短生命周期密钥，绑定特定范围
3. **4 层权限控制** — 细粒度安全护栏
4. **2 分钟启动** — CLI 或 MCP 零代码接入

### 来源
- https://www.coinbase.com/developer-platform/products/agentic-wallets
- https://docs.cdp.coinbase.com/agentic-wallet/welcome
- https://eco.com/support/en/articles/14845485-coinbase-agentic-wallets-explained

---

## 三、Farcaster / Lens Protocol — SocialFi 创作者收益

### Farcaster 核心发现
| 字段 | 值 |
|------|-----|
| 收益流 | Pro 订阅 + Creator Rewards + 存储租金 + DEGEN 打赏 |
| 结算频率 | 每周 Creator Rewards 分发 $25,000 USDC |
| 平台费 | Pro 订阅 100% 回创作者池，平台不抽成 |
| 法币出金 | 无原生，需通过第三方 |
| 技术栈 | OP Mainnet + Base + Hub P2P + Snapchain (10,000+ TPS) |
| 用户规模 | 注册 38.2 万+，DAU 4-6 万 |
| 融资 | $1.8 亿，估值 $10 亿 |
| 亮点 | Frames v2 / Mini Apps — feed 内嵌全屏交互式应用 |

### Lens Protocol 核心发现
| 字段 | 值 |
|------|-----|
| 收益流 | Collect 收藏付费 + Follow 付费关注 + Open Actions |
| 结算频率 | 链上即时到账 |
| 平台费 | 协议层零抽成 |
| 法币出金 | 无原生，Gas 以 GHO 稳定币支付 |
| 技术栈 | Lens Chain (ZK Stack + Avail DA) |
| 用户规模 | Profile 64.7 万，帖子 3100 万，MAU ~4.5 万 |
| 融资 | $4600 万 |
| 亮点 | Social Graph NFT 化 — Profile/Follow/Collect 全部是 NFT |

### 可借鉴的 UX 创新
1. **Collect 模型** — 创作者设定收藏价格，粉丝付费铸造 NFT
2. **即时到账** — 链上收入直接进入创作者钱包
3. **零平台费** — 协议层不抽成，创作者获 100%
4. **Social Graph NFT 化** — 所有社交资产可组合、可移植

### 来源
- https://farcaster.xyz
- https://lens.xyz
- https://blockeden.xyz/blog/2026/01/13/farcaster-vs-lens-socialfi-web3-social-graph/
- https://www.panewslab.com/en/articles/1jgd4p4p

---

## 四、竞品对比摘要

### 实时收益显示
| 产品 | 刷新机制 | 延迟 | 多资产 | 历史趋势 |
|------|----------|------|--------|----------|
| Superfluid | 本地插值 | ~0ms | 13+ 链 | 有 + 预测 |
| Lido stETH | Rebase 机制 | ~12s | 单资产 | 有 |
| Aave aUSDC | 余额递增 | ~12s | 多资产 | 有 |
| 我们的 LiveEarnings | requestAnimationFrame | ~0ms | 单资产 | 新增 7 天趋势 |

### AI 助手
| 产品 | 输入方式 | 执行模型 | 权限控制 | Agent 钱包 |
|------|----------|----------|----------|------------|
| Coinbase Agentic | 自然语言 + MCP | MPC + TEE | 4 层 | 是 |
| TxGPT Bot | 自然语言 | 确认执行 | 基础 | 否 |
| ChainGPT | 自然语言 | 建议型 | 基础 | 否 |
| 我们的 AIAssistant | 文本 + 快捷按钮 | Mock 建议型 | 无 | 否 |

### 创作者收益
| 平台 | 结算频率 | 平台费 | 收益流 |
|------|----------|--------|--------|
| Farcaster | 每周 | 0% | 订阅 + 打赏 + 奖励 |
| Lens | 即时 | 0% | Collect + Follow |
| Superfluid | 实时流 | 协议费 | 流支付 |
| 我们的平台 | 即时 (mock) | 0% | 活动奖励 + 投票 |

---

## 五、应用到 LiveEarnings 和 AIAssistant 的改进

### 已实施改进 (v17.1)
1. **LiveEarnings**: 添加 7 天迷你趋势图 (SVG sparkline)
2. **LiveEarnings**: 添加 30 天收益预测
3. **AIAssistant**: 扩展 Q&A（SocialFi/Agent Wallet/实时流支付/Collect/声誉）
4. **AIAssistant**: 快捷按钮从 3 个扩展到 6 个
5. **AIAssistant**: 欢迎消息更新（新增 SocialFi 和 AI Agent）

### 待实施改进
- [ ] LiveEarnings: 首页 hero 区增加"滚动时数字递增"交互（Superfluid 启发）
- [ ] LiveEarnings: 支持 View-only 模式（输入地址查看收益）
- [ ] AIAssistant: 集成真实 API（当前为 Mock 回复）
- [ ] AIAssistant: 添加交易预览功能（Coinbase 启发）
- [ ] 新组件: SocialFi 收益聚合（Farcaster + Lens 数据整合）
