import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WalletProvider } from "@/components/wallet-provider";
import { AppNavigation } from "@/components/app-navigation";
import { Footer } from "@/components/Footer";
import { QuickActionsToolbar } from "@/components/ui/QuickActionsToolbar";
import { NotificationProvider } from "@/components/ui/NotificationCenter";
import { CommandPaletteProvider } from "@/components/ui/CommandPalette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Injective Creator Hub",
  description: "Decentralized content creation platform on Injective EVM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed]">
        <WalletProvider>
          <NotificationProvider>
            <CommandPaletteProvider>
              <AppNavigation />
              <main className="flex-1">{children}</main>
              <Footer />
              <QuickActionsToolbar />
            </CommandPaletteProvider>
          </NotificationProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
