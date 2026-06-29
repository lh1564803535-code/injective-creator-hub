"use client";

import { useToast } from "@/components/ui/Toast";

export function XLoginButton() {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      variant: "info",
      title: "关注 Injective",
      description: "请在 Twitter 上关注 @Injective 并发推参与活动",
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 rounded-lg border border-[#2B3139] bg-[#1E2329] px-4 py-2 text-sm text-[#EAECEF] transition hover:bg-[#2B3139]"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      用 X 登录
    </button>
  );
}
