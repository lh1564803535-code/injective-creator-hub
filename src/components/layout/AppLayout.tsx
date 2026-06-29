"use client";

import { TopNav } from "./TopNav";
import { LeftNav } from "./LeftNav";
import { RightPanel } from "./RightPanel";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <TopNav />
      <LeftNav />
      <RightPanel />
      <main className="pt-16 pb-20 lg:pb-0 lg:pl-60 xl:pr-72">
        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
