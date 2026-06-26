"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Zap, Server, Cpu, BarChart2,
  Lightbulb, Activity, FileText, Bell, Sparkles,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { useDashboard, useRecommendations, useAlerts, useGpus } from "@/lib/api";

const nav = [
  { href: "/",               icon: LayoutDashboard, label: "Executive Dashboard" },
  { href: "/optimize",       icon: Zap,             label: "Optimization Center", badge: "pending" },
  { href: "/inventory",      icon: Server,           label: "GPU Inventory" },
  { href: "/workloads",      icon: Cpu,              label: "AI Workloads" },
  { href: "/cost-explorer",  icon: BarChart2,        label: "Cost Explorer" },
  { href: "/insights",       icon: Lightbulb,        label: "AI Insights" },
  { href: "/cluster-health", icon: Activity,         label: "Cluster Health" },
  { href: "/reports",        icon: FileText,          label: "Reports" },
  { href: "/alerts",         icon: Bell,             label: "Alerts", badge: "alerts" },
  { href: "/ai-features",    icon: Sparkles,         label: "Future AI", badge: "soon" },
];

export default function Sidebar() {
  const pathname = usePathname();
  
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
    if (key === "pending") return pendingCount;
    if (key === "alerts")  return alertCount;
    if (key === "soon")    return "soon";
    return null;
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(29,78,216,0.4)",
            flexShrink: 0,
          }}>
            <Zap size={15} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              Infra Optimizer
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
              AI Cost Platform
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Score */}
      <div style={{ padding: "14px 14px 12px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Optimization Score
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="progress progress-lg" style={{ marginBottom: 5 }}>
              <div className="progress-fill" style={{
                width: `${optScore}%`,
                background: optScore < 50
                  ? "linear-gradient(90deg, #dc2626, #f87171)"
                  : optScore < 75
                  ? "linear-gradient(90deg, #d97706, #fbbf24)"
                  : "linear-gradient(90deg, #16a34a, #22c55e)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--red-bright)", fontWeight: 600 }}>
                {optScore < 75 ? "Needs attention" : "Healthy"}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{optScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
        {nav.map(({ href, icon: Icon, label, badge }) => {
          const badgeVal = getBadge(badge);
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className={clsx("nav-item", isActive && "active")}
              style={{ marginBottom: 2, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Icon size={14} style={{ flexShrink: 0 }} />
                <span>{label}</span>
              </div>
              {badgeVal !== null && (
                badgeVal === "soon"
                  ? <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-muted)", background: "var(--surface-hover)", padding: "1px 5px", borderRadius: 3 }}>SOON</span>
                  : <span style={{
                      minWidth: 18, height: 18, borderRadius: 99, fontSize: 10, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px",
                      background: isActive ? "rgba(37,99,235,0.3)" : "var(--red-dim)",
                      color: isActive ? "var(--blue-bright)" : "var(--red-bright)",
                      border: `1px solid ${isActive ? "var(--blue-border)" : "var(--red-border)"}`,
                    }}>{badgeVal}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: waste summary */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
        <Link href="/optimize" style={{ textDecoration: "none" }}>
          <div style={{
            background: "var(--red-dim)", border: "1px solid var(--red-border)",
            borderRadius: 8, padding: "10px 12px", cursor: "pointer",
            transition: "background 0.15s",
          }}>
            <div style={{ fontSize: 11, color: "var(--red-bright)", fontWeight: 600, marginBottom: 2 }}>
              ⚠ Wasted this month
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--red-bright)", letterSpacing: "-0.03em" }}>
              ${wastedCost.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
              Fix it <ChevronRight size={10} />
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
