"use client";

import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface CreatorBreadcrumbProps {
  creatorName?: string;
}

export function CreatorBreadcrumb({ creatorName }: CreatorBreadcrumbProps) {
  const items = [
    { label: "Home", href: "/" },
    { label: "Leaderboard", href: "/leaderboard" },
    ...(creatorName ? [{ label: creatorName }] : [{ label: "Creator Details" }]),
  ];

  return (
    <div className="rounded-lg bg-gray-900/50 px-4 py-3">
      <Breadcrumb items={items} />
    </div>
  );
}
