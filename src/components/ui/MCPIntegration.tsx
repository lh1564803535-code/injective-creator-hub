"use client";

import { useState } from "react";
import { Bot, Terminal, Zap, Shield, ChevronRight, Code2, ArrowRight, Activity, TrendingUp } from "lucide-react";

const MCP_TOOLS = [
  {
    name: "perp_trade",
    description: "Execute perpetual futures trades via natural language",
    example: '"Long ETH with 5x leverage using 100 USDC"',
    category: "Trading",
  },
  {
    name: "spot_swap",
    description: "Swap tokens on Injective DEX",
    example: '"Swap 50 USDC for INJ"',
    category: "Trading",
  },
  {
    name: "bridge_assets",
    description: "Bridge assets across chains via IBC",
    example: '"Bridge 100 USDC from Ethereum to Injective"',
    category: "Cross-chain",
  },
  {
    name: "check_portfolio",
    description: "View wallet balances and positions",
    example: '"Show my portfolio and PnL"',
    category: "Portfolio",
  },
  {
    name: "query_docs",
    description: "Semantic search across Injective documentation",
    example: '"How do I deploy a smart contract on Injective?"',
    category: "Docs",
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Trading: { bg: "bg-amber-500/15", text: "text-amber-400" },
  "Cross-chain": { bg: "bg-cyan-500/15", text: "text-cyan-400" },
  Portfolio: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  Docs: { bg: "bg-purple-500/15", text: "text-purple-400" },
};

export function MCPIntegration() {
  const [activeTool, setActiveTool] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "> Connecting to Injective MCP Server...",
    "> Connected. 11 tools available.",
    "> Ready for natural language commands.",
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const runDemo = () => {
    setIsRunning(true);
    const tool = MCP_TOOLS[activeTool];
    setConsoleOutput((prev) => [
      ...prev,
      `\n> User: ${tool.example}`,
      `> Processing via MCP...`,
      `> Tool: ${tool.name}`,
      `> Building transaction...`,
      `> Simulating... ✓ Safe`,
      `> Ready to sign. Awaiting wallet confirmation.`,
    ]);

    setTimeout(() => {
      setConsoleOutput((prev) => [
        ...prev,
        `> Transaction confirmed! Hash: 0x${Math.random().toString(16).slice(2, 10)}...`,
        `> Gas used: 0.000003 INJ ($0.00008)`,
      ]);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-[#1a1a1a] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
            <Bot className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">MCP Server Integration</h3>
            <p className="text-xs text-gray-500">Injective Model Context Protocol</p>
          </div>
        </div>
        <a
          href="https://docs.injective.network/developers-ai/index"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs text-purple-400 transition hover:bg-purple-500/20"
        >
          Docs <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-white/[0.02] p-2 text-center">
          <p className="text-[10px] text-gray-500">Volume</p>
          <p className="text-sm font-bold text-emerald-400">$30M+</p>
        </div>
        <div className="rounded-lg bg-white/[0.02] p-2 text-center">
          <p className="text-[10px] text-gray-500">Active Agents</p>
          <p className="text-sm font-bold text-cyan-400">69K</p>
        </div>
        <div className="rounded-lg bg-white/[0.02] p-2 text-center">
          <p className="text-[10px] text-gray-500">Tools</p>
          <p className="text-sm font-bold text-purple-400">11</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Tool List */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Available Tools
          </p>
          {MCP_TOOLS.map((tool, i) => {
            const colors = categoryColors[tool.category];
            return (
              <button
                key={tool.name}
                onClick={() => setActiveTool(i)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                  i === activeTool
                    ? "border-purple-500/30 bg-purple-500/10"
                    : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs text-cyan-400">{tool.name}</code>
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${colors.bg} ${colors.text}`}>
                      {tool.category}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{tool.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            );
          })}
        </div>

        {/* Console */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Agent Console
          </p>
          <div className="mt-2 rounded-lg bg-black/50 p-4 font-mono text-xs">
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {consoleOutput.map((line, i) => (
                <p
                  key={i}
                  className={`${
                    line.startsWith("> User:")
                      ? "text-cyan-400"
                      : line.includes("Confirmed")
                      ? "text-emerald-400"
                      : line.includes("Safe")
                      ? "text-emerald-400"
                      : "text-gray-400"
                  }`}
                >
                  {line}
                </p>
              ))}
              {isRunning && (
                <p className="text-amber-400 animate-pulse">Processing...</p>
              )}
            </div>
          </div>

          <button
            onClick={runDemo}
            disabled={isRunning}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
          >
            <Terminal className="h-4 w-4" />
            Run Demo: {MCP_TOOLS[activeTool].name}
          </button>

          <div className="mt-3 flex items-center gap-2 rounded-lg bg-purple-500/5 p-3">
            <Shield className="h-4 w-4 shrink-0 text-purple-400" />
            <p className="text-[10px] text-gray-500">
              All transactions require wallet signature. MCP Server never holds your keys.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
        <Code2 className="h-3 w-3" />
        <span>User</span>
        <ArrowRight className="h-3 w-3" />
        <Bot className="h-3 w-3" />
        <span>AI Agent</span>
        <ArrowRight className="h-3 w-3" />
        <Terminal className="h-3 w-3" />
        <span>MCP Server</span>
        <ArrowRight className="h-3 w-3" />
        <Zap className="h-3 w-3" />
        <span>Injective Chain</span>
      </div>
    </div>
  );
}
