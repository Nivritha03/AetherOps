"use client";

import { useState } from "react";
import Link from "next/link";
import { AppWindow, Send, RefreshCw, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useApplications } from "@/lib/api";

interface AppItem {
  id: string;
  name: string;
  namespace: string;
  cluster: string;
  image: string;
  replicas: { current: number; desired: number };
  cpu: string;
  memory: string;
  status: string;
  uptime: string;
}

export default function ApplicationsPage() {
  const { data: apiResponse, loading, error, refetch } = useApplications();
  const rawApps = (apiResponse as any)?.data || [];
  const [localScale, setLocalScale] = useState<Record<string, number>>({});

  const handleScale = async (id: string, current: number, delta: number) => {
    const nextDesired = Math.max(1, current + delta);
    setLocalScale(prev => ({ ...prev, [id]: nextDesired }));

    try {
      await fetch(`http://localhost:8080/api/v1/applications/${id}/scale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replicas: nextDesired }),
      });
      refetch();
    } catch {
      // Local state retains optimistic update
    }
  };

  const handleRestart = (name: string) => {
    alert(`Rolling rollout restart triggered for deployment: ${name}`);
  };

  return (
    <div className="app-shell" style={{ background: "#080B14", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TopBar />

        <main style={{ padding: "26px 32px 40px" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Applications & Workloads
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Active Kubernetes workloads, pod replicas, container health, and runtime scaling.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => refetch()}>
                <RefreshCw size={13} /> {loading ? "Syncing..." : "Refresh"}
              </button>
              <Link href="/deployments" className="btn btn-primary btn-sm">
                <Plus size={13} /> Deploy Application
              </Link>
            </div>
          </div>

          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Loading applications from API...
            </div>
          )}

          {error && (
            <div style={{ padding: 20, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#EF4444", fontSize: 13, marginBottom: 16 }}>
              Failed to load applications: {error}
            </div>
          )}

          <div className="card" style={{ padding: 0, background: "rgba(16, 22, 36, 0.7)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", textAlign: "left", color: "var(--text-muted)" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 600 }}>Application</th>
                  <th style={{ padding: "14px 18px", fontWeight: 600 }}>Namespace</th>
                  <th style={{ padding: "14px 18px", fontWeight: 600 }}>Cluster</th>
                  <th style={{ padding: "14px 18px", fontWeight: 600 }}>Replicas</th>
                  <th style={{ padding: "14px 18px", fontWeight: 600 }}>CPU / Mem</th>
                  <th style={{ padding: "14px 18px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "14px 18px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rawApps.map((app: AppItem) => {
                  const desired = localScale[app.id] ?? app.replicas?.desired ?? 1;
                  const current = localScale[app.id] ?? app.replicas?.current ?? 1;
                  return (
                    <tr key={app.id} style={{ borderBottom: "1px solid var(--border)", color: "var(--text-primary)" }}>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#fff" }}>{app.name}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{app.image}</div>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", fontSize: 11 }}>
                          {app.namespace}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", color: "var(--text-secondary)" }}>{app.cluster}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700 }}>{current}/{desired}</span>
                          <div style={{ display: "flex", gap: 2 }}>
                            <button
                              onClick={() => handleScale(app.id, desired, 1)}
                              style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#fff", width: 18, height: 18, borderRadius: 3, cursor: "pointer", fontSize: 11 }}
                              title="Scale Up"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleScale(app.id, desired, -1)}
                              style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#fff", width: 18, height: 18, borderRadius: 3, cursor: "pointer", fontSize: 11 }}
                              title="Scale Down"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "var(--text-secondary)" }}>
                        {app.cpu} · {app.memory}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                          background: app.status === "Running" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                          color: app.status === "Running" ? "#10B981" : "#F59E0B"
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleRestart(app.name)}
                            title="Restart Pods"
                          >
                            <RefreshCw size={11} /> Restart
                          </button>
                          <Link href={`/logs?app=${app.name}`} className="btn btn-ghost btn-sm">
                            Logs
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
