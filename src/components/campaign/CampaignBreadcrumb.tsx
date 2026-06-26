"use client";

import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface CampaignBreadcrumbProps {
  campaignTitle?: string;
}

export function CampaignBreadcrumb({ campaignTitle }: CampaignBreadcrumbProps) {
  const items = [
    { label: "Home", href: "/" },
    { label: "Campaigns", href: "/campaigns" },
    ...(campaignTitle ? [{ label: campaignTitle }] : [{ label: "Campaign Details" }]),
  ];

  return (
    <div className="rounded-lg bg-gray-900/50 px-4 py-3">
      <Breadcrumb items={items} />
    </div>
  );
}
