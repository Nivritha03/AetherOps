"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Activity, Clock, Database, Cloud } from "lucide-react";

export default function LiveStatusBar() {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    if (pathname === "/") return;
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(t);
  }, [pathname]);

  if (pathname === "/") return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "28px",
      background: "var(--surface-0)",
      borderBottom: "1px solid var(--border)",
      padding: "0 28px",
      fontSize: "11px",
      color: "var(--text-muted)",
      fontWeight: 500,
      letterSpacing: "0.02em"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--green-bright)" }}>
          <div className="dot dot-pulse" style={{ background: "var(--green-bright)" }} />
          Cluster Healthy
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Database size={12} />
          Provider: Prometheus
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Cloud size={12} />
          Environment: Production
        </div>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Activity size={12} />
          <span>Live Metrics Active</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={12} />
          <span>Last Updated: {time}</span>
        </div>
      </div>
    </div>
  );
}
