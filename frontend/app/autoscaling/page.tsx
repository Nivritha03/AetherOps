"use client";

import { useState } from "react";
import { Scale, Sliders, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAutoscalingPolicies } from "@/lib/api";

interface HpaPolicy {
  id: string;
  deployment: string;
  namespace: string;
  minReplicas: number;
  maxReplicas: number;
  currentReplicas: number;
  targetCpu: number;
  currentCpu: number;
  status: "Stabilized" | "Scaling Up" | "Scaling Down";
}

export default function AutoscalingPage() {
  const { data: apiResponse, loading, error, refetch } = useAutoscalingPolicies();
  const hpas: HpaPolicy[] = (apiResponse as any)?.data || [];

  return (
    <div className="app-shell" style={{ background: "#080B14", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TopBar />

        <main style={{ padding: "26px 32px 40px" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Autoscaling & Self-Healing (Kubernetes HPA)
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Horizontal Pod Autoscaling targets, dynamic replica expansion, and automatic workload crash recovery.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => refetch()} disabled={loading}>
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> {loading ? "Syncing..." : "Refresh"}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => alert("HPA Rule Creator: Configure threshold & deployment selector.")}>
                <Scale size={13} /> Add Scaling Rule
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Loading HPA policies from API...
            </div>
          )}

          {error && (
            <div style={{ padding: 20, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#EF4444", fontSize: 13, marginBottom: 16 }}>
              Failed to load autoscaling policies: {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {hpas.map(h => (
              <div key={h.id} className="card" style={{ padding: "22px", background: "rgba(16, 22, 36, 0.7)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{h.deployment}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>namespace: {h.namespace}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                    background: h.status === "Scaling Up" ? "rgba(59, 130, 246, 0.15)" : "rgba(16, 185, 129, 0.1)",
                    color: h.status === "Scaling Up" ? "#38BDF8" : "#10B981"
                  }}>
                    {h.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, marginBottom: 16, border: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Current Pods</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{h.currentReplicas}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Allowed Bounds</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>{h.minReplicas} min - {h.maxReplicas} max</div>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>
                    <span>Target CPU: {h.targetCpu}%</span>
                    <span style={{ fontWeight: 700, color: h.currentCpu > h.targetCpu ? "#38BDF8" : "#fff" }}>
                      Current: {h.currentCpu}%
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                    <div style={{
                      width: `${h.currentCpu}%`, height: "100%",
                      background: h.currentCpu > h.targetCpu ? "#38BDF8" : "#10B981", borderRadius: 3
                    }} />
                  </div>
                </div>

                <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => alert(`Configuring HPA parameters for ${h.deployment}`)}>
                  <Sliders size={12} /> Configure HPA Bounds
                </button>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
