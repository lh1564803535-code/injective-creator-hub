"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div>
      <div className="flex gap-1 border-b border-white/[0.06]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-cyan-500 text-white"
                : "text-gray-500 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{activeContent}</div>
    </div>
  );
}
