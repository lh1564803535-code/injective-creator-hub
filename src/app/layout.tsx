import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="zh" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#0B0E11] text-[#EAECEF]">
        {children}
      </body>
    </html>
  );
}
