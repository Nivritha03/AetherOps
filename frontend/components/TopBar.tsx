"use client";

import { useState } from "react";
import { Search, Bell, Moon, ChevronDown, Sun } from "lucide-react";
import { useAlerts } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function TopBar({
  title, subtitle, action
}: {
  title?: string;
  subtitle?: string;
  action?: { label: string; href: string };
}) {
  const { data: alerts } = useAlerts();
  const { user, logout } = useAuth();
  const activeAlerts = alerts ? alerts.filter((a: any) => a.status === "active").length : 3;
  const [selectedCluster, setSelectedCluster] = useState("prod-cluster");
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 28px", borderBottom: "1px solid var(--border)",
      background: "rgba(8, 11, 20, 0.75)", backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 30
    }}>
      
      {/* Search Input (Ctrl K) */}
      <div 
        style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--border)",
          borderRadius: 10, padding: "8px 16px",
          width: 380, cursor: "pointer"
        }}
        onClick={() => {
          const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
          document.dispatchEvent(event);
        }}
      >
        <Search size={15} style={{ color: "var(--text-muted)" }} />
        <span style={{ fontSize: 13, color: "var(--text-muted)", flex: 1 }}>
          Search clusters, applications, or resources...
        </span>
        <span style={{
          fontSize: 10, padding: "2px 6px", borderRadius: 4,
          background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
          color: "var(--text-muted)"
        }}>
          ⌘ K
        </span>
      </div>

      {/* Right Controls matching screenshot */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        
        {/* Systems Health Pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: 999, padding: "6px 14px",
          fontSize: 12, fontWeight: 600, color: "#10B981"
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
          <span>All Systems Healthy</span>
          <ChevronDown size={12} />
        </div>

        {/* Cluster Selector */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--border)",
          borderRadius: 8, padding: "6px 12px",
          fontSize: 12, fontWeight: 600, color: "var(--text-primary)",
          cursor: "pointer"
        }}>
          <span style={{ color: "var(--text-muted)" }}>⚙</span>
          <span>{selectedCluster}</span>
          <ChevronDown size={12} color="var(--text-muted)" />
        </div>

        {/* Dark Mode Icon */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            background: "transparent", border: "none", color: "var(--text-secondary)",
            cursor: "pointer", display: "flex", alignItems: "center", padding: "6px"
          }}
        >
          {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notifications Icon with Badge */}
        <div style={{ position: "relative", cursor: "pointer", padding: "6px" }}>
          <Bell size={16} color="var(--text-secondary)" />
          {activeAlerts > 0 && (
            <span style={{
              position: "absolute", top: 2, right: 2,
              background: "#EF4444", color: "#fff",
              fontSize: 9, fontWeight: 800, width: 14, height: 14,
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", border: "2px solid var(--bg-primary)"
            }}>
              {activeAlerts}
            </span>
          )}
        </div>

        {/* Profile Avatar Pill */}
        <div 
          onClick={() => {
            if (user) {
              const confirmOut = window.confirm(`Signed in as ${user.email}. Do you want to sign out?`);
              if (confirmOut) logout();
            } else {
              window.location.href = "/auth/signin";
            }
          }}
          title={user ? `Signed in as ${user.email} (Click to Sign Out)` : "Sign In"}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #8B1D41 0%, #590F28 100%)",
            color: "#F5F0E6", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(139, 29, 65, 0.5)",
            border: "1px solid rgba(245, 240, 230, 0.2)"
          }}
        >
          {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : "AO"}
        </div>

      </div>

    </header>
  );
}
