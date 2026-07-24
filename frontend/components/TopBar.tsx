"use client";

import { Bell, Search, Settings, HelpCircle, User, RefreshCw } from "lucide-react";
import { useAlerts } from "@/lib/api";

export default function TopBar({
  title, subtitle, action
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}) {
  const { data: alerts } = useAlerts();
  const activeAlerts = alerts ? alerts.filter((a: any) => a.status === "active").length : 0;

  return (
    <header className="topbar-wrapper">
      
      {/* Title block */}
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</p>}
      </div>

      {/* Metadata Indicators & Search Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        
        {/* Cluster / Env metadata triggers */}
        <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 8px", fontSize: 11, color: "var(--text-secondary)" }}>
          <span style={{ fontWeight: 600 }}>aws-us-east-1</span>
          <span style={{ color: "var(--text-muted)" }}>|</span>
          <span style={{ color: "var(--green-bright)", fontWeight: 600 }}>Prometheus</span>
        </div>

        {/* Global Command palette Search Box */}
        <div 
          style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", padding: "6px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
          onClick={() => {
            // Trigger command palette K shortcut programmatically if possible
            const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
            document.dispatchEvent(event);
          }}
        >
          <Search size={13} />
          <span style={{ color: "var(--text-muted)" }}>Search metrics...</span>
          <span style={{ border: "1px solid var(--border-strong)", borderRadius: 4, padding: "0 4px", fontSize: 10, background: "var(--bg-secondary)" }}>Ctrl K</span>
        </div>

        {/* Notifications & Settings buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn btn-ghost" style={{ position: "relative", padding: 8, borderRadius: 6 }}>
            <Bell size={15} />
            {activeAlerts > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4, width: 6, height: 6,
                background: "var(--red-bright)", borderRadius: 3, border: "1px solid var(--bg-secondary)"
              }} />
            )}
          </button>
          
          <button className="btn btn-ghost" style={{ padding: 8, borderRadius: 6 }}>
            <Settings size={15} />
          </button>
        </div>

        {action && (
          <a href={action.href} className="btn btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>
            {action.label}
          </a>
        )}

      </div>

    </header>
  );
}
