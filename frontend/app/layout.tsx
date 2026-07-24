import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GPU Cost Optimizer | Autonomous Multicloud AI Infrastructure",
  description:
    "Intelligent platform for monitoring, analyzing, and optimizing GPU costs across AWS, GCP, and Azure cloud providers.",
  keywords: "GPU, cloud, cost optimization, AWS, GCP, Azure, AI infrastructure",
};

import AIAssistant from "@/components/AIAssistant";
import CommandPalette from "@/components/CommandPalette";
import LiveStatusBar from "@/components/LiveStatusBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <LiveStatusBar />
          <div style={{ flex: 1, position: 'relative' }}>
            {children}
          </div>
        </div>
        <AIAssistant />
        <CommandPalette />
      </body>
    </html>
  );
}
