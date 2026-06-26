# Research Log

## 2026-06-26 — Injective 生态新项目调研

### 关键发现

**1. MultiVM 主网已上线**
- 2025年11月11日 Injective 原生 EVM 上线
- 第一天就有 30+ 个项目部署
- MultiVM Token Standard (MTS): 统一代币标准，跨 EVM/Cosmos/IBC 一致

**2. MCP Server（2026年2月25日）**
- AI Agent 可以通过自然语言交易永续合约
- 11 个工具，开源
- 已处理 $30M+ 交易量
- 这是我们项目可以深度集成的！

**3. 性能数据**
- 出块时间：0.64 秒
- 交易费：$0.00008
- 比 Binance 手续费低 50%

**4. 监管进展**
- 美国 CFTC 监管的 INJ 期货（Bitnomial 交易所，2026年4月）
- 泰国 M-INJ 受监管投资产品
- Injective 政策研究所（华盛顿特区）
- Microsoft 合作

**5. 生态基金**
- $150M 生态系统基金
- Outlier Ventures Builder Catalyst 计划

**6. 关键 dApp**
- Helix: DEX，$10B+ 交易量
- Neptune Finance: 借贷
- Hydro: 最受欢迎的 dApp
- Mito: 团队自建
- Borderless: 跨链交易

### 对项目的启示

1. MCP Server 集成 — AI Assistant 可以直接调用 MCP Server 执行链上操作
2. MTS 优势 — USDC 在所有 VM 中一致
3. 极低 Gas — $0.00008，应该在 UI 中突出
4. 监管合规 — 可以在项目描述中提到
5. 出块速度 — 0.64 秒，实时性极强

### 待实施改进

- [ ] GasEstimator 更新为真实 Injective Gas 数据
- [ ] 首页添加 "0.64s block time" 展示
- [ ] MCPIntegration 添加真实 MCP Server 链接
- [ ] AIAssistant Gas 相关回答更新为真实数据

## 2026-06-26 — Web3 创作者变现工具调研

### 关键发现

**1. 4 种 Web3 变现模型**
- 交易手续费（DEX/NFT 市场）
- NFT/Token-gated 订阅
- 直接打赏/P2P 支付
- 内容代币化（每篇文章可铸造为 NFT）

**2. Token Gating 工具（27+）**
- GateRepo: GitHub 仓库 token-gating
- Novel: 无代码 token-gated 电商
- Lens Protocol: 社交图谱集成
- Mirror.xyz: 去中心化发布 + NFT

**3. 关键教训**
- NFT-first 策略失败率极高（2021-2022 的艺术家 0% 持续盈利）
- 成功的模型：Spotify + Bandcamp + email + 付费推广
- Token-gated 粉丝俱乐部是可行的 Patreon 替代品
- AI 权利许可是 2026 年的新前沿

**4. 关键指标**
- ARPU (Average Revenue Per User)
- CLV (Customer Lifetime Value)
- 钱包激活率
- 链上活动量

### 对项目的启示
- [ ] 添加 token-gated 活动功能
- [ ] 实现内容 NFT 铸造
- [ ] 添加创作者打赏功能
- [ ] 追踪链上指标（ARPU/CLV）
