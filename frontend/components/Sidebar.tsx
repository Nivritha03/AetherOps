"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Server, AppWindow, Send, GitBranch,
  Boxes, Activity, Terminal, Scale, Bell, Lightbulb,
  FileText, Settings, HelpCircle, ChevronRight, ChevronLeft,
  ArrowUpRight, ShieldCheck, CheckCircle2, TrendingUp, LogOut
} from "lucide-react";
import { clsx } from "clsx";
import { useAlerts } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/dashboard",       icon: LayoutDashboard, label: "Overview" },
  { href: "/clusters",        icon: Server,          label: "Clusters" },
  { href: "/applications",    icon: AppWindow,       label: "Applications" },
  { href: "/deployments",     icon: Send,            label: "Deployments" },
  { href: "/pipelines",       icon: GitBranch,       label: "CI/CD Pipelines" },
  { href: "/infrastructure",  icon: Boxes,           label: "Infrastructure" },
  { href: "/monitoring",      icon: Activity,        label: "Monitoring" },
  { href: "/logs",            icon: Terminal,        label: "Logs" },
  { href: "/autoscaling",     icon: Scale,           label: "Autoscaling" },
  { href: "/alerts",          icon: Bell,            label: "Alerts", badge: 3 },
  { href: "/insights",        icon: Lightbulb,       label: "Insights" },
  { href: "/reports",         icon: FileText,        label: "Reports" },
];

const bottomNav = [
  { href: "/settings",        icon: Settings,        label: "Settings" },
  { href: "/settings",        icon: HelpCircle,      label: "Help" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: alerts } = useAlerts();
  const { user, logout } = useAuth();
  const activeAlerts = alerts ? alerts.filter((a: any) => a.status === "active").length : 3;

  return (
    <aside className={clsx("sidebar-panel", collapsed ? "collapsed" : "expanded")} style={{ display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, zIndex: 40 }}>
      
      {/* Brand Header */}
      <div style={{ padding: "20px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: "linear-gradient(135deg, #8B1D41 0%, #D9A066 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(139, 29, 65, 0.4)", flexShrink: 0
        }}>
          <span style={{ fontWeight: 900, color: "#F5F0E6", fontSize: 18, fontFamily: "Outfit, sans-serif" }}>A</span>
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#F5F0E6", letterSpacing: "-0.02em", fontFamily: "Outfit, sans-serif" }}>
              AetherOps
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.02em" }}>
              Cloud Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href || (href === "/dashboard" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx("sidebar-nav-item", isActive && "active")}
              title={label}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "9px 12px",
                borderRadius: 8, margin: "2px 0", textDecoration: "none",
                color: isActive ? "#F5F0E6" : "var(--text-secondary)",
                background: isActive ? "rgba(139, 29, 65, 0.35)" : "transparent",
                border: isActive ? "1px solid rgba(163, 38, 80, 0.45)" : "1px solid transparent",
                transition: "all 0.15s ease"
              }}
            >
              <Icon size={17} style={{ color: isActive ? "#F5F0E6" : "var(--sage-light)", flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}>
                  {label}
                </span>
              )}
              {!collapsed && badge && (
                <span style={{
                  padding: "1px 7px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                  background: "#8B1D41", color: "#F5F0E6", border: "1px solid rgba(245,240,230,0.2)"
                }}>
                  {badge === 3 ? activeAlerts : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Optimization Score Widget (from screenshot) */}
      {!collapsed && (
        <div style={{ padding: "0 12px 14px" }}>
          <div style={{
            background: "rgba(16, 22, 36, 0.6)",
            border: "1px solid var(--border)",
            borderRadius: 12, padding: "14px",
            display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              border: "3px solid #10B981", display: "flex",
              alignItems: "center", justifyContent: "center",
              flexDirection: "column", flexShrink: 0,
              background: "rgba(16, 185, 129, 0.08)"
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#10B981", lineHeight: 1 }}>94</span>
              <span style={{ fontSize: 8, color: "var(--text-muted)" }}>/100</span>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Optimization Score
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>Excellent</span>
                <TrendingUp size={12} color="#10B981" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Nav & Profile (from screenshot) */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "12px 10px" }}>
        {bottomNav.map(({ href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "7px 12px",
              borderRadius: 6, color: "var(--text-muted)", textDecoration: "none", fontSize: 12
            }}
          >
            <Icon size={14} />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 10px 4px", marginTop: 4
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #8B1D41 0%, #590F28 100%)",
              color: "var(--cream-primary)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, flexShrink: 0,
              border: "1px solid rgba(245,240,230,0.2)"
            }}>
              {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : "AO"}
            </div>
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                {user ? (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--cream-primary)", whiteSpace: "nowrap" }}>
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--sage-light)", whiteSpace: "nowrap" }}>
                      {user.email}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" style={{ fontSize: 12, fontWeight: 700, color: "var(--cream-primary)", textDecoration: "none", display: "block" }}>
                      Sign In
                    </Link>
                    <div style={{ fontSize: 10, color: "var(--sage-light)", whiteSpace: "nowrap" }}>
                      Guest Operator
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--sage-light)", padding: "4px"
              }}
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
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
