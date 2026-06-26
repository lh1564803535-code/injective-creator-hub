"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAccount, useBalance } from "wagmi";
import { MessageCircle, X, Send, Sparkles, AlertTriangle, CheckCircle, ArrowRight, Shield, Wallet } from "lucide-react";

interface TxPreview {
  type: "vote" | "submit" | "claim" | "transfer";
  action: string;
  amount?: string;
  from?: string;
  to?: string;
  gas: string;
  risk: "safe" | "warning" | "danger";
  riskReason?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  preview?: TxPreview;
}

function getWelcomeMsg(walletAddr?: string, balance?: string): Message {
  const walletInfo = walletAddr
    ? `\n\n🔗 钱包已连接：${shortenAddr(walletAddr)}\n💰 余额：${balance || "查询中..."}`
    : "\n\n💡 提示：连接钱包后我可以提供更个性化的帮助";

  return {
    id: "welcome",
    role: "assistant",
    text: `👋 你好！我是你的创作助手。

我可以帮你：
- 创建和管理钱包
- 参加创作活动
- 把收益提现到银行卡
- 了解实时流支付
- 了解 SocialFi 和 AI Agent${walletInfo}

有什么问题尽管问我！`,
    timestamp: Date.now(),
  };
}

const QUICK_BUTTONS = [
  { label: "创建钱包", query: "创建钱包" },
  { label: "怎么提现", query: "提现" },
  { label: "什么是Gas", query: "Gas" },
  { label: "实时流支付", query: "stream" },
  { label: "SocialFi", query: "socialfi" },
  { label: "AI Agent", query: "agent" },
];

function shortenAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

async function fetchAIResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.message;
    }
  } catch {
    // Fall through to local response
  }
  return "";
}

function getLocalAIResponse(
  input: string,
  walletAddr?: string,
  balance?: string
): { text: string; preview?: TxPreview } {
  const lower = input.toLowerCase();

  if (/创建钱包|钱包|注册/.test(lower)) {
    if (walletAddr) {
      return { text: `你的钱包已连接！\n\n地址：${shortenAddr(walletAddr)}\n余额：${balance || "查询中..."}\n\n你可以在 Dashboard 查看详细收益和活动参与情况。` };
    }
    return { text: "我帮你创建钱包！只需要3步：\n1. 点击右上角的「连接钱包」\n2. 选择 MetaMask 或 WalletConnect\n3. 按照提示完成连接\n\n没有钱包？没关系，选择「创建新钱包」，我会一步步教你。" };
  }
  if (/提现|转到银行卡|换钱|法币/.test(lower)) {
    return { text: "把 USDC 变成人民币有几种方式：\n1. 通过交易所：把 USDC 转到 Binance/OKX，然后卖出\n2. 通过 P2P：在交易所找买家，直接转账给你\n3. 通过 OTC：找信任的人直接交易\n\n你想用哪种方式？我可以详细教你。" };
  }
  if (/gas|手续费|费用/.test(lower)) {
    return { text: "Gas 就是区块链上的「手续费」。好消息是 Injective 链的 Gas 非常便宜，几乎为零！\n你发送 100 USDC，实际只需要 0.001 USDC 的 Gas。\n不用担心，系统会自动帮你计算。" };
  }
  if (/投票|怎么投票/.test(lower)) {
    return {
      text: "投票很简单，我来帮你预览交易：",
      preview: {
        type: "vote",
        action: "Vote on Campaign Submission",
        gas: "~0.001 INJ ($0.02)",
        risk: "safe",
        riskReason: "投票是免费的，不消耗 USDC",
      },
    };
  }
  if (/活动|怎么参加|参与/.test(lower)) {
    return { text: "参加活动的步骤：\n1. 浏览「活动」页面，找到感兴趣的\n2. 点击「提交作品」\n3. 上传你的作品（图片/视频/链接）\n4. 等待社区投票\n5. 活动结束后，奖金自动打到你的钱包\n\n就这么简单！" };
  }
  if (/什么是usdc|稳定币|usdc/.test(lower)) {
    return { text: "USDC 是一种数字货币，1 USDC = 1 美元。\n它的价值不会像比特币那样大幅波动。\n你可以把它理解为「区块链上的美元」。\n你赚到的 USDC 可以随时换成人民币。" };
  }
  if (/安全|被骗|风险/.test(lower)) {
    return { text: "安全提示：\n1. 永远不要分享你的私钥或助记词\n2. 只连接你信任的钱包\n3. 交易前仔细确认金额和地址\n4. 如果不确定，先问我\n\n我会帮你检查每笔交易的风险。" };
  }
  if (/socialfi|社交|farcaster|lens|粉丝/.test(lower)) {
    return { text: "SocialFi 是「社交+金融」的新模式：\n- Farcaster：类似去中心化 Twitter，创作者每周可赚 $25,000 USDC\n- Lens Protocol：你的社交关系是 NFT，可以卖帖子、收粉丝费\n\n在这个平台，你可以：\n1. 通过创作活动赚取 USDC\n2. 积累链上声誉\n3. 粉丝可以直接打赏你\n\n不需要懂技术，正常创作就行！" };
  }
  if (/agent|智能助手|自动|机器人/.test(lower)) {
    return { text: "AI Agent 是你的「智能钱包助手」：\n- 可以帮你自动执行交易\n- 监控收益变化\n- 推荐最赚钱的活动\n\n安全特性：\n1. 每笔交易都需要你确认\n2. 有每日支出上限\n3. 所有操作都有审计日志\n\n你可以把它理解为一个「会用区块链的私人秘书」。" };
  }
  if (/stream|流支付|实时|每秒/.test(lower)) {
    return { text: "实时流支付是 Superfluid 协议的核心技术：\n- 你的收益每秒都在增长\n- 不是一次性到账，而是像水龙头一样持续流入\n- 你可以实时看到钱在增加\n\n这就是为什么你的 Dashboard 上数字一直在跳动——那是真金白银在流入你的钱包！" };
  }
  if (/collect|收藏|nft|铸造/.test(lower)) {
    return { text: "在 Web3 社交平台，你的作品可以变成 NFT：\n1. 发布作品时设置「收藏价格」\n2. 粉丝付费收藏，作品自动铸造为 NFT\n3. 收入直接进入你的钱包\n\n你还可以：\n- 设置限量版（比如只有 100 份）\n- 给早期收藏者打折\n- 二次销售时获得版税\n\n这是创作者新的收入来源！" };
  }
  if (/声誉|reputation|评分|等级/.test(lower)) {
    return { text: "你的链上声誉由以下因素决定：\n1. 活动参与度（提交作品数量）\n2. 获得的投票数\n3. 赚取的 USDC 总额\n4. 连续签到天数\n\n声誉越高：\n- 能参加更高级的活动\n- 获得更高的投票权重\n- 解锁专属成就徽章\n\n所有数据都在链上，真实可信！" };
  }
  if (/交易|转账|发送|send|transfer/.test(lower)) {
    return {
      text: "我来帮你预览这笔交易：",
      preview: {
        type: "transfer",
        action: "Send USDC",
        amount: "100 USDC",
        from: "Your Wallet",
        to: "Recipient (0x...abcd)",
        gas: "~0.001 INJ ($0.02)",
        risk: "safe",
      },
    };
  }
  if (/claim|领取|奖励/.test(lower)) {
    return {
      text: "领取奖励的交易预览：",
      preview: {
        type: "claim",
        action: "Claim Campaign Reward",
        amount: "50 USDC",
        gas: "~0.001 INJ ($0.02)",
        risk: "safe",
        riskReason: "领取奖励不消耗 USDC",
      },
    };
  }

  return { text: "我不太确定你的问题，但我可以帮你：\n- 创建钱包\n- 参加活动\n- 提现到银行卡\n- 了解 Gas 费\n- 投票\n- 了解 SocialFi\n- 了解 AI Agent\n- 了解实时流支付\n\n试试问我这些问题！" };
}

const riskColors = {
  safe: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: CheckCircle },
  warning: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: AlertTriangle },
  danger: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", icon: AlertTriangle },
};

function TransactionPreviewCard({ preview }: { preview: TxPreview }) {
  const risk = riskColors[preview.risk];
  const RiskIcon = risk.icon;

  return (
    <div className={`ai-chat-bubble mt-2 max-w-[85%] rounded-xl border ${risk.border} bg-[#1a1a1a] p-3`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Transaction Preview</span>
        <div className={`flex items-center gap-1 rounded-full ${risk.bg} px-2 py-0.5`}>
          <RiskIcon className={`h-3 w-3 ${risk.text}`} />
          <span className={`text-[10px] font-medium ${risk.text}`}>
            {preview.risk === "safe" ? "Safe" : preview.risk === "warning" ? "Warning" : "Danger"}
          </span>
        </div>
      </div>

      <p className="mb-2 text-sm font-medium text-white">{preview.action}</p>

      <div className="space-y-1.5 text-xs">
        {preview.amount && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium text-amber-400">{preview.amount}</span>
          </div>
        )}
        {preview.from && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">From</span>
            <span className="text-gray-300">{preview.from}</span>
          </div>
        )}
        {preview.to && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">To</span>
            <span className="text-gray-300">{preview.to}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Gas Fee</span>
          <span className="text-gray-300">{preview.gas}</span>
        </div>
      </div>

      {preview.riskReason && (
        <div className={`mt-2 flex items-start gap-1.5 rounded-lg ${risk.bg} p-2`}>
          <Shield className={`mt-0.5 h-3 w-3 shrink-0 ${risk.text}`} />
          <span className="text-[10px] text-gray-400">{preview.riskReason}</span>
        </div>
      )}

      <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-cyan-600 py-2 text-xs font-medium text-white transition hover:bg-cyan-500">
        Confirm & Sign
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

export function AIAssistant() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const balanceStr = balanceData
    ? `${(Number(balanceData.value) / 10 ** balanceData.decimals).toFixed(4)} ${balanceData.symbol}`
    : undefined;

  const [messages, setMessages] = useState<Message[]>([getWelcomeMsg(address, balanceStr)]);

  // Update welcome message when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      setMessages((prev) => {
        if (prev[0]?.id === "welcome") {
          return [getWelcomeMsg(address, balanceStr), ...prev.slice(1)];
        }
        return prev;
      });
    }
  }, [isConnected, address, balanceStr]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate AI thinking delay (500-1200ms)
      // Try API first, fall back to local
      const apiMessages = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.text }));

      apiMessages.push({ role: "user", content: trimmed });

      // Use setTimeout for non-blocking UX
      setTimeout(async () => {
        let responseText = await fetchAIResponse(apiMessages);
        let preview: TxPreview | undefined;

        if (!responseText) {
          // Fall back to local response
          const localResponse = getLocalAIResponse(trimmed, address, balanceStr);
          responseText = localResponse.text;
          preview = localResponse.preview;
        }

        const aiMsg: Message = {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: responseText,
          timestamp: Date.now(),
          preview,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 300 + Math.random() * 500);
    },
    [address, balanceStr, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-assistant-btn fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-110"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* Chat Panel */}
      <div
        className={`ai-assistant-panel fixed bottom-0 right-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden border-t border-white/[0.08] bg-[#1a1a1a] shadow-2xl shadow-black/50 sm:bottom-6 sm:right-6 sm:h-[500px] sm:w-[360px] sm:rounded-2xl sm:border ${
          isOpen ? "open" : "closed"
        }`}
        style={{ maxHeight: isOpen ? "100dvh" : 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#1a1a1a] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI 助手</p>
              <p className="text-[10px] text-gray-500">
                {isConnected ? `Connected: ${shortenAddr(address!)}` : "随时帮你解答"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              )}
              <div>
                <div
                  className={`ai-chat-bubble max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md bg-white/[0.06] text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.preview && msg.role === "assistant" && (
                  <TransactionPreviewCard preview={msg.preview} />
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3">
                <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" />
                <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" style={{ animationDelay: "0.15s" }} />
                <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Buttons */}
        <div className="grid grid-cols-3 gap-1.5 border-t border-white/[0.04] px-4 py-2">
          {QUICK_BUTTONS.map((btn) => (
            <button
              key={btn.query}
              onClick={() => sendMessage(btn.query)}
              className="rounded-lg bg-white/[0.04] px-2 py-1.5 text-[10px] text-gray-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 focus-within:ring-1 focus-within:ring-cyan-500/30">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
