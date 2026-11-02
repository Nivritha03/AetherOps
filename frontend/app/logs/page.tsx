"use client";

import { useState } from "react";
import { Terminal, Search, Play, Pause, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useLogsStream } from "@/lib/api";

interface LogEntry {
  id?: string;
  timestamp: string;
  pod: string;
  namespace: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export default function LogsPage() {
  const { data: apiResponse, loading, error, refetch } = useLogsStream();
  const logs: LogEntry[] = (apiResponse as any)?.data || [];

  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [isLive, setIsLive] = useState(true);

  const filtered = logs.filter(l => {
    if (filterLevel !== "ALL" && l.level !== filterLevel) return false;
    if (search && !l.message?.toLowerCase().includes(search.toLowerCase()) && !l.pod?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="app-shell" style={{ background: "#080B14", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TopBar />

        <main style={{ padding: "26px 32px 40px" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Centralized Logging (Grafana Loki)
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Real-time log streaming from cluster containers, pods, and system namespaces.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => refetch()}>
                <RefreshCw size={12} /> {loading ? "Streaming..." : "Refresh"}
              </button>
              <button
                className={`btn btn-sm ${isLive ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? <Pause size={12} /> : <Play size={12} />} {isLive ? "Streaming Live" : "Paused"}
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="text"
                placeholder="Search log messages, pod IDs, or stacktraces..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3, border: "1px solid var(--border)" }}>
              {["ALL", "INFO", "WARN", "ERROR"].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  style={{
                    background: filterLevel === lvl ? "#2563EB" : "transparent",
                    color: filterLevel === lvl ? "#fff" : "var(--text-muted)",
                    border: "none", padding: "4px 12px", borderRadius: 6,
                    fontSize: 11, fontWeight: 700, cursor: "pointer"
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Connecting to Loki log stream...
            </div>
          )}

          {error && (
            <div style={{ padding: 20, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#EF4444", fontSize: 13, marginBottom: 16 }}>
              Failed to stream logs: {error}
            </div>
          )}

          {/* Log Stream Terminal */}
          <div className="card" style={{
            padding: "16px 20px", background: "rgba(8, 11, 20, 0.9)",
            border: "1px solid var(--border)", borderRadius: 10,
            fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, minHeight: 460
          }}>
            {filtered.map((l, idx) => (
              <div key={idx} style={{ display: "flex", gap: 14, padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{l.timestamp}</span>
                <span style={{
                  padding: "0 6px", borderRadius: 3, fontSize: 9, fontWeight: 800, flexShrink: 0,
                  background: l.level === "ERROR" ? "rgba(239, 68, 68, 0.15)" : l.level === "WARN" ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)",
                  color: l.level === "ERROR" ? "#EF4444" : l.level === "WARN" ? "#F59E0B" : "#38BDF8"
                }}>
                  {l.level}
                </span>
                <span style={{ color: "#A855F7", flexShrink: 0 }}>[{l.pod}]</span>
                <span style={{ color: l.level === "ERROR" ? "#FCA5A5" : "#E2E8F0" }}>{l.message}</span>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
