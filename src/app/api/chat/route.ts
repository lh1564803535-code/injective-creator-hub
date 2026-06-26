import { NextRequest, NextResponse } from "next/server";

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant for the Injective Creator Hub, a decentralized content creation platform on Injective EVM.

Your capabilities:
1. Help users create and manage wallets
2. Explain blockchain concepts (Gas, USDC, staking, etc.)
3. Guide users through campaign participation
4. Assist with voting and submissions
5. Explain real-time streaming payments (Superfluid)
6. Help with SocialFi features (Farcaster/Lens)
7. Provide transaction previews before execution

Key facts:
- Injective Chain ID: 1439 (testnet), 2525 (mainnet)
- Gas fees on Injective are nearly zero (~0.001 INJ per transaction)
- USDC is a stablecoin pegged 1:1 to USD
- Real-time streaming means earnings flow every second
- All transactions are on-chain and verifiable

Always respond in Chinese (Simplified) unless the user writes in English.
Be helpful, concise, and focus on actionable guidance.
If asked about transactions, always preview the details before confirming.`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];

    // Try to use Ollama if available, otherwise use mock
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "qwen3:14b";

    try {
      // Attempt to call Ollama
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: false,
        }),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          message: data.message?.content || "No response",
          source: "ollama",
        });
      }
    } catch {
      // Ollama not available, fall through to mock
    }

    // Mock AI response (fallback)
    const mockResponse = getMockResponse(lastUserMessage.content);
    return NextResponse.json({
      message: mockResponse,
      source: "mock",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();

  if (/创建钱包|钱包|注册/.test(lower)) {
    return "我帮你创建钱包！只需要3步：\n1. 点击右上角的「连接钱包」\n2. 选择 MetaMask 或 WalletConnect\n3. 按照提示完成连接\n\n没有钱包？没关系，选择「创建新钱包」，我会一步步教你。";
  }

  if (/提现|转到银行卡|换钱|法币/.test(lower)) {
    return "把 USDC 变成人民币有几种方式：\n1. 通过交易所：把 USDC 转到 Binance/OKX，然后卖出\n2. 通过 P2P：在交易所找买家，直接转账给你\n3. 通过 OTC：找信任的人直接交易\n\n你想用哪种方式？我可以详细教你。";
  }

  if (/gas|手续费|费用/.test(lower)) {
    return "Gas 就是区块链上的「手续费」。好消息是 Injective 链的 Gas 非常便宜，几乎为零！\n你发送 100 USDC，实际只需要 0.001 USDC 的 Gas。\n不用担心，系统会自动帮你计算。";
  }

  if (/投票|怎么投票/.test(lower)) {
    return "投票很简单：\n1. 找到你喜欢的作品\n2. 点击「投票」按钮\n3. 选择投票权重（1-5星）\n4. 确认交易\n\n投票是免费的，不需要花任何钱。";
  }

  if (/活动|怎么参加|参与/.test(lower)) {
    return "参加活动的步骤：\n1. 浏览「活动」页面，找到感兴趣的\n2. 点击「提交作品」\n3. 上传你的作品（图片/视频/链接）\n4. 等待社区投票\n5. 活动结束后，奖金自动打到你的钱包\n\n就这么简单！";
  }

  if (/什么是usdc|稳定币|usdc/.test(lower)) {
    return "USDC 是一种数字货币，1 USDC = 1 美元。\n它的价值不会像比特币那样大幅波动。\n你可以把它理解为「区块链上的美元」。\n你赚到的 USDC 可以随时换成人民币。";
  }

  if (/安全|被骗|风险/.test(lower)) {
    return "安全提示：\n1. 永远不要分享你的私钥或助记词\n2. 只连接你信任的钱包\n3. 交易前仔细确认金额和地址\n4. 如果不确定，先问我\n\n我会帮你检查每笔交易的风险。";
  }

  if (/socialfi|社交|farcaster|lens/.test(lower)) {
    return "SocialFi 是「社交+金融」的新模式：\n- Farcaster：类似去中心化 Twitter，创作者每周可赚 $25,000 USDC\n- Lens Protocol：你的社交关系是 NFT，可以卖帖子、收粉丝费\n\n在这个平台，你可以：\n1. 通过创作活动赚取 USDC\n2. 积累链上声誉\n3. 粉丝可以直接打赏你\n\n不需要懂技术，正常创作就行！";
  }

  if (/agent|智能助手|自动/.test(lower)) {
    return "AI Agent 是你的「智能钱包助手」：\n- 可以帮你自动执行交易\n- 监控收益变化\n- 推荐最赚钱的活动\n\n安全特性：\n1. 每笔交易都需要你确认\n2. 有每日支出上限\n3. 所有操作都有审计日志\n\n你可以把它理解为一个「会用区块链的私人秘书」。";
  }

  if (/stream|流支付|实时/.test(lower)) {
    return "实时流支付是 Superfluid 协议的核心技术：\n- 你的收益每秒都在增长\n- 不是一次性到账，而是像水龙头一样持续流入\n- 你可以实时看到钱在增加\n\n这就是为什么你的 Dashboard 上数字一直在跳动——那是真金白银在流入你的钱包！";
  }

  return "我不太确定你的问题，但我可以帮你：\n- 创建钱包\n- 参加活动\n- 提现到银行卡\n- 了解 Gas 费\n- 投票\n- 了解 SocialFi\n- 了解 AI Agent\n- 了解实时流支付\n\n试试问我这些问题！";
}
