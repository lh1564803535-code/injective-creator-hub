"use client";

import { User, Gift, Share2, MoreHorizontal } from "lucide-react";
import { ActionDropdown, type ActionDropdownItem } from "@/components/ui/ActionDropdown";

interface CreatorDropdownProps {
  creatorId: string;
  onViewProfile?: (creatorId: string) => void;
  onTip?: (creatorId: string) => void;
  onShare?: (creatorId: string) => void;
  className?: string;
}

export function CreatorDropdown({
  creatorId,
  onViewProfile,
  onTip,
  onShare,
  className,
}: CreatorDropdownProps) {
  const items: ActionDropdownItem[] = [
    {
      key: "profile",
      label: "查看资料",
      icon: <User className="h-4 w-4" />,
      onClick: () => onViewProfile?.(creatorId),
    },
    {
      key: "tip",
      label: "打赏",
      icon: <Gift className="h-4 w-4" />,
      onClick: () => onTip?.(creatorId),
    },
    {
      key: "share",
      label: "分享",
      icon: <Share2 className="h-4 w-4" />,
      onClick: () => onShare?.(creatorId),
    },
  ];

  return (
    <ActionDropdown
      trigger={
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-gray-400 transition hover:bg-white/[0.06] hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      }
      items={items}
      align="right"
      className={className}
    />
  );
}
