import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AetherOps",
  description:
    "Autonomous Multi-Cloud AI Infrastructure & Kubernetes Management Platform.",
  keywords: "AetherOps, Kubernetes, multi-cloud, AI infrastructure, FinOps, EKS, GPU cost optimization",
};

import AIAssistant from "@/components/AIAssistant";
import CommandPalette from "@/components/CommandPalette";
import LiveStatusBar from "@/components/LiveStatusBar";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <LiveStatusBar />
            <div style={{ flex: 1, position: 'relative' }}>
              {children}
            </div>
          </div>
          <AIAssistant />
          <CommandPalette />
        </AuthProvider>
      </body>
    </html>
  );
}
