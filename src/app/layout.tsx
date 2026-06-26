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
  return children;
}
