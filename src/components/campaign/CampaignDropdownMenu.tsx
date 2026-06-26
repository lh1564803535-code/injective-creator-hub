"use client";

import { Pencil, Trash2, Share2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, type DropdownMenuItem } from "@/components/ui/DropdownMenu";

interface CampaignDropdownMenuProps {
  campaignId: string;
  onEdit?: (campaignId: string) => void;
  onDelete?: (campaignId: string) => void;
  onShare?: (campaignId: string) => void;
  className?: string;
}

export function CampaignDropdownMenu({
  campaignId,
  onEdit,
  onDelete,
  onShare,
  className,
}: CampaignDropdownMenuProps) {
  const items: DropdownMenuItem[] = [
    {
      key: "edit",
      label: "编辑活动",
      icon: <Pencil className="h-4 w-4" />,
      onClick: () => onEdit?.(campaignId),
    },
    {
      key: "share",
      label: "分享活动",
      icon: <Share2 className="h-4 w-4" />,
      onClick: () => onShare?.(campaignId),
    },
    {
      key: "delete",
      label: "删除活动",
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      onClick: () => onDelete?.(campaignId),
    },
  ];

  return (
    <DropdownMenu
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
