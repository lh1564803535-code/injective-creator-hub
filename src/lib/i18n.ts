export type Locale = "en" | "zh";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.campaigns": "Campaigns",
    "nav.leaderboard": "Leaderboard",
    "nav.create": "Create",
    "nav.dashboard": "Dashboard",

    // Hero
    "hero.title": "Injective Creator Hub",
    "hero.subtitle": "Decentralized content creation platform. Create campaigns, submit content, earn USDC rewards — all on-chain.",
    "hero.cta.leaderboard": "View Leaderboard",
    "hero.cta.create": "Create Campaign",

    // Live Earnings
    "earnings.title": "Live Earnings",
    "earnings.subtitle": "Real-time USDC streaming",
    "earnings.today": "Today",
    "earnings.month": "This Month",
    "earnings.annual": "Annual (est.)",
    "earnings.goal": "Monthly Goal",
    "earnings.streaming": "Streaming",
    "earnings.view_only": "View-only",

    // AI Assistant
    "ai.title": "AI Assistant",
    "ai.subtitle": "Always here to help",
    "ai.placeholder": "Type your question...",
    "ai.welcome": "👋 Hi! I'm your creative assistant.\n\nI can help you:\n- Create and manage wallets\n- Join creative campaigns\n- Withdraw earnings to your bank\n- Learn about real-time streaming\n- Learn about SocialFi and AI Agent\n\nFeel free to ask me anything!",

    // Dashboard
    "dashboard.title": "Creator Dashboard",
    "dashboard.connect": "Connect your wallet to view your submissions and earnings",
    "dashboard.quick_actions": "Quick Actions",
    "dashboard.create": "Create Campaign",
    "dashboard.create_desc": "Launch a new bounty",
    "dashboard.leaderboard": "View Leaderboard",
    "dashboard.leaderboard_desc": "See top creators",
    "dashboard.explore": "Browse Campaigns",
    "dashboard.explore_desc": "Find content to create",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.back": "Back",
    "common.next": "Next",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.all": "All",
    "common.active": "Active",
    "common.ended": "Ended",
  },
  zh: {
    // 导航
    "nav.home": "首页",
    "nav.campaigns": "活动",
    "nav.leaderboard": "排行榜",
    "nav.create": "创建",
    "nav.dashboard": "仪表盘",

    // 英雄区
    "hero.title": "Injective 创作者中心",
    "hero.subtitle": "去中心化内容创作平台。创建活动、提交内容、赚取 USDC 奖励 — 全部在链上。",
    "hero.cta.leaderboard": "查看排行榜",
    "hero.cta.create": "创建活动",

    // 实时收益
    "earnings.title": "实时收益",
    "earnings.subtitle": "USDC 实时流入",
    "earnings.today": "今日",
    "earnings.month": "本月",
    "earnings.annual": "预计年化",
    "earnings.goal": "月度目标",
    "earnings.streaming": "流式传输",
    "earnings.view_only": "仅查看",

    // AI 助手
    "ai.title": "AI 助手",
    "ai.subtitle": "随时帮你解答",
    "ai.placeholder": "输入你的问题...",
    "ai.welcome": "👋 你好！我是你的创作助手。\n\n我可以帮你：\n- 创建和管理钱包\n- 参加创作活动\n- 把收益提现到银行卡\n- 了解实时流支付\n- 了解 SocialFi 和 AI Agent\n\n有什么问题尽管问我！",

    // 仪表盘
    "dashboard.title": "创作者仪表盘",
    "dashboard.connect": "连接钱包以查看您的提交和收益",
    "dashboard.quick_actions": "快捷操作",
    "dashboard.create": "创建活动",
    "dashboard.create_desc": "发起新的赏金",
    "dashboard.leaderboard": "查看排行榜",
    "dashboard.leaderboard_desc": "查看顶级创作者",
    "dashboard.explore": "浏览活动",
    "dashboard.explore_desc": "寻找创作内容",

    // 通用
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.confirm": "确认",
    "common.back": "返回",
    "common.next": "下一步",
    "common.search": "搜索",
    "common.filter": "筛选",
    "common.sort": "排序",
    "common.all": "全部",
    "common.active": "进行中",
    "common.ended": "已结束",
  },
};

let currentLocale: Locale = "zh";

export function getLocale(): Locale {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && (saved === "en" || saved === "zh")) {
      currentLocale = saved;
    }
  }
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
  }
}

export function t(key: string): string {
  const locale = getLocale();
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
