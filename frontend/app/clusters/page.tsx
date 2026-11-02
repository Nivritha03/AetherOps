"use client";

import { useState } from "react";
import Link from "next/link";
import { Server, Activity, Plus, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { usePlatformClusters } from "@/lib/api";

interface Cluster {
  id: string;
  name: string;
  provider: string;
  region: string;
  version: string;
  status: string;
  nodes: number;
  cpuUsage: number;
  memoryUsage: number;
  pods: { running: number; total: number };
}

export default function ClustersPage() {
  const { data: apiResponse, loading, error, refetch } = usePlatformClusters();
  const clusters: Cluster[] = (apiResponse as any)?.data || [];

  return (
    <div className="app-shell" style={{ background: "#080B14", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TopBar />

        <main style={{ padding: "26px 32px 40px" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Kubernetes Clusters
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Manage, monitor, and provision Kubernetes clusters across AWS EKS and local Kind instances.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => refetch()} disabled={loading}>
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> {loading ? "Syncing..." : "Refresh"}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => alert("Connect Cluster wizard: Specify kubeconfig or AWS IAM role.")}>
                <Plus size={13} /> Connect Cluster
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Loading connected clusters from API...
            </div>
          )}

          {error && (
            <div style={{ padding: 20, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#EF4444", fontSize: 13, marginBottom: 16 }}>
              Failed to load clusters: {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {clusters.map((cluster: Cluster) => (
              <div key={cluster.id} className="card" style={{ padding: "22px", background: "rgba(16, 22, 36, 0.7)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(59, 130, 246, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Server size={18} color="#3B82F6" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{cluster.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{cluster.provider} · {cluster.region}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                    background: cluster.status === "Healthy" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                    color: cluster.status === "Healthy" ? "#10B981" : "#F59E0B"
                  }}>
                    {cluster.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, marginBottom: 16, border: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Version</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{cluster.version}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Worker Nodes</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{cluster.nodes} Active</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Pods</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{cluster.pods?.running || 0} / {cluster.pods?.total || 0}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Health Score</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>{cluster.status === "Healthy" ? "100%" : "78%"}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>
                    <span>CPU Allocation</span>
                    <span style={{ fontWeight: 700, color: "#fff" }}>{cluster.cpuUsage}%</span>
                  </div>
                  <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                    <div style={{ width: `${cluster.cpuUsage}%`, height: "100%", background: cluster.cpuUsage > 80 ? "#EF4444" : "#3B82F6", borderRadius: 3 }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => alert(`Active cluster switched to ${cluster.name}`)}>
                    Select Cluster
                  </button>
                  <Link href="/monitoring" className="btn btn-ghost btn-sm">
                    <Activity size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
