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
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed]">
        {children}
      </body>
    </html>
  );
}
