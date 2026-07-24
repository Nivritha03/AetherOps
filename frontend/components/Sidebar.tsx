"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Zap, Server, Cpu, BarChart2,
  Lightbulb, Activity, FileText, Bell, Sparkles,
  ChevronRight, ChevronLeft, Building2, LayoutGrid, Settings, HelpCircle, User, Play
} from "lucide-react";
import { clsx } from "clsx";
import { useDashboard, useRecommendations, useAlerts, useGpus } from "@/lib/api";

const nav = [
  { href: "/dashboard",       icon: LayoutDashboard, label: "Executive Dashboard" },
  { href: "/optimize",        icon: Zap,             label: "Optimization Center", badge: "pending" },
  { href: "/inventory",       icon: Server,           label: "GPU Inventory" },
  { href: "/workloads",       icon: Cpu,              label: "AI Workloads" },
  { href: "/cost-explorer",   icon: BarChart2,        label: "Cost Explorer" },
  { href: "/simulation",      icon: Play,             label: "Simulation Center" },
  { href: "/insights",        icon: Lightbulb,        label: "AI Insights" },
  { href: "/cluster-health",  icon: Activity,         label: "Cluster Health" },
  { href: "/reports",         icon: FileText,          label: "Reports" },
  { href: "/alerts",          icon: Bell,             label: "Alerts", badge: "alerts" },
  { href: "/settings",        icon: Settings,         label: "Settings" }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  const { data: dash } = useDashboard();
  const { data: opts } = useRecommendations();
  const { data: alerts } = useAlerts();
  const { data: nodes } = useGpus();

  const pendingCount = opts ? opts.filter((o: any) => o.status === "pending").length : 0;
  const alertCount = alerts ? alerts.filter((a: any) => a.status === "active").length : 0;
  const optScore = dash ? dash.optimizationScore : 0;

  const topNodes = nodes ? nodes.filter((n: any) => n.status === "idle" || n.status === "misconfigured") : [];
  const wastedCost = topNodes.reduce((sum, n) => sum + n.monthlyCost, 0);

  function getBadge(key?: string) {
    if (key === "pending" && pendingCount > 0) return pendingCount;
    if (key === "alerts" && alertCount > 0)  return alertCount;
    return null;
  }

  return (
    <aside className={clsx("sidebar-panel", collapsed ? "collapsed" : "expanded")}>
      
      {/* Workspace / Org Switcher */}
      <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
        <div 
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "rgba(255,255,255,0.02)", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)" }}
          onClick={() => setShowOrgDropdown(!showOrgDropdown)}
        >
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--blue-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Building2 size={14} color="var(--blue-primary)" />
          </div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                AetherOps Org
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                <span>Prod Cluster</span>
                <ChevronRight size={8} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, padding: "20px 0", overflowY: "auto" }}>
        {nav.map(({ href, icon: Icon, label, badge }) => {
          const badgeVal = getBadge(badge);
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className={clsx("sidebar-nav-item", isActive && "active")} title={label}>
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ flex: 1, fontSize: 13, whiteSpace: "nowrap" }}>{label}</span>}
              {!collapsed && badgeVal !== null && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 6, fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px",
                  background: isActive ? "var(--bg-primary)" : "var(--red-dim)",
                  color: isActive ? "var(--text-primary)" : "var(--red-bright)",
                  border: `1px solid ${isActive ? "var(--border)" : "var(--red-border)"}`,
                }}>{badgeVal}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Waste Summary Card */}
      {!collapsed && wastedCost > 0 && (
        <div style={{ padding: "16px" }}>
          <Link href="/optimize" style={{ textDecoration: "none" }}>
            <div className="premium-card premium-card-hover" style={{ padding: "12px 14px", background: "var(--bg-primary)" }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Wasted Spend</span>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--red-bright)", marginTop: 2, fontFamily: "Outfit, sans-serif" }}>
                ${wastedCost.toLocaleString()}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, color: "var(--blue-primary)", fontWeight: 600 }}>
                <span>Resolve Waste</span>
                <ChevronRight size={10} />
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* User Context Card at Bottom */}
      <div style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)", flexShrink: 0 }}>
          <User size={16} color="var(--text-secondary)" />
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Cloud Architect
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              admin@aetherops.io
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button 
        className="sidebar-collapse-btn" 
        onClick={() => setCollapsed(!collapsed)}
        style={{ transform: collapsed ? "rotate(180deg)" : "none" }}
      >
        <ChevronLeft size={12} />
      </button>

    </aside>
  );
}
