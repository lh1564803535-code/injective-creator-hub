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
