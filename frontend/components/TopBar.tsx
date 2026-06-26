"use client";

import { Bell, Search, Settings, ChevronRight } from "lucide-react";
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
    <header className="topbar">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input type="text" placeholder="Search resources..." className="search-input" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="icon-btn" style={{ position: "relative" }}>
            <Bell size={18} />
            {activeAlerts > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4, width: 8, height: 8,
                background: "var(--red-bright)", borderRadius: 4, border: "2px solid var(--surface)"
              }} />
            )}
          </button>
          <button className="icon-btn"><Settings size={18} /></button>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: "var(--slate-dim)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginLeft: 8 }}>
            CT
          </div>
        </div>
        {action && (
          <a href={action.href} className="btn btn-primary" style={{ height: 36 }}>
            {action.label}
          </a>
        )}
      </div>
    </header>
  );
}
