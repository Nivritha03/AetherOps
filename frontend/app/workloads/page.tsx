"use client";

import { AlertTriangle, TrendingUp } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useWorkloads } from "@/lib/api";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  running: { label: "Running", color: "var(--green-bright)", bg: "var(--green-dim)", border: "var(--green-border)" },
  scaling: { label: "Scaling", color: "var(--blue-bright)",  bg: "var(--blue-dim)",  border: "var(--blue-border)" },
  idle:    { label: "Idle",    color: "var(--amber-bright)", bg: "var(--amber-dim)", border: "var(--amber-border)" },
  error:   { label: "Error",   color: "var(--red-bright)",   bg: "var(--red-dim)",   border: "var(--red-border)" },
};

function CostPerRequestCell({ value, model }: { value: number; model: string }) {
  const isExpensive = value > 1.0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: isExpensive ? "var(--red-bright)" : "var(--text-primary)" }}>
        ${value.toFixed(3)}
      </span>
      {isExpensive && <AlertTriangle size={12} style={{ color: "var(--red-bright)" }} />}
    </div>
  );
}

export default function WorkloadsPage() {
  const { data: workloads, loading } = useWorkloads();

  if (loading || !workloads) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main">
          <TopBar title="AI Workloads" subtitle="Loading..." />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: "var(--text-muted)" }}>Loading Workloads...</p>
          </div>
        </div>
      </div>
    );
  }

  const sorted = [...workloads].sort((a, b) => b.monthlyCost - a.monthlyCost);
  const totalCost = workloads.reduce((s: any, w: any) => s + w.monthlyCost, 0);
  const idleModels = workloads.filter((w: any) => w.status === "idle").length;
  const expensivePerReq = workloads.filter((w: any) => w.costPerRequest > 1.0).length;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="AI Workloads" subtitle="Model-level cost and performance tracking" />
        <div className="page-content fade-up">

          {/* Summary */}
          <div className="metric-grid-4" style={{ marginBottom: 20 }}>
            {[
              { label: "Active Models", value: workloads.length, color: "var(--text-primary)" },
              { label: "Total Model Cost", value: `$${(totalCost/1000).toFixed(1)}k/mo`, color: "var(--text-primary)" },
              { label: "Idle Models", value: idleModels, color: "var(--amber-bright)" },
              { label: "Expensive Models (>$1/req)", value: expensivePerReq, color: "var(--red-bright)" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ padding: "16px 18px" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Cost share bars */}
          <div className="card" style={{ padding: "20px 22px", marginBottom: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>Cost Distribution by Model</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sorted.map((w: any) => {
                const pct = Math.round((w.monthlyCost / totalCost) * 100);
                const isIdle = w.status === "idle";
                return (
                  <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", minWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {w.model}
                    </p>
                    <div className="progress" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{
                        width: `${pct}%`,
                        background: isIdle ? "var(--red-mid)" : "var(--blue-mid)",
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isIdle ? "var(--red-bright)" : "var(--text-primary)", minWidth: 60, textAlign: "right" }}>
                      ${(w.monthlyCost/1000).toFixed(1)}k
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 30, textAlign: "right" }}>{pct}%</span>
                    {isIdle && <span className="badge badge-amber" style={{ flexShrink: 0 }}>Idle</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="card" style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {["Model", "Namespace", "GPUs", "Framework", "Status", "Req/sec", "P50 Latency", "P99 Latency", "GPU Util", "$/hour", "$/request", "Monthly Cost"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((w: any) => {
                  const sc = statusConfig[w.status];
                  return (
                    <tr key={w.id}>
                      <td>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>{w.model}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{w.cluster}</p>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 7px", color: "var(--text-secondary)" }}>
                          {w.namespace}
                        </span>
                      </td>
                      <td>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{w.gpuCount}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{w.gpuType.replace("NVIDIA ", "")}</p>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>{w.framework}</td>
                      <td>
                        <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>
                          {sc.label}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, fontWeight: 600, color: w.requestsPerSec === 0 ? "var(--red-bright)" : "var(--text-primary)" }}>
                          {w.requestsPerSec === 0 ? "—" : w.requestsPerSec}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: w.latencyP50Ms > 1000 ? "var(--amber-bright)" : "var(--text-secondary)" }}>
                        {w.latencyP50Ms === 0 ? "—" : `${w.latencyP50Ms}ms`}
                      </td>
                      <td style={{ fontSize: 13, color: w.latencyP99Ms > 3000 ? "var(--red-bright)" : "var(--text-secondary)" }}>
                        {w.latencyP99Ms === 0 ? "—" : `${w.latencyP99Ms}ms`}
                      </td>
                      <td>
                        <div style={{ minWidth: 100 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: w.utilizationPercent < 20 ? "var(--red-bright)" : "var(--text-primary)" }}>
                            {w.utilizationPercent}%
                          </span>
                          <div className="progress" style={{ marginTop: 3 }}>
                            <div className="progress-fill" style={{ width: `${w.utilizationPercent}%`, background: w.utilizationPercent < 20 ? "var(--red-mid)" : "var(--green-mid)" }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        ${w.costPerHour.toFixed(2)}
                      </td>
                      <td><CostPerRequestCell value={w.costPerRequest} model={w.model} /></td>
                      <td>
                        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em", color: w.status === "idle" ? "var(--red-bright)" : "var(--text-primary)" }}>
                          ${w.monthlyCost.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Expensive model callout */}
          {workloads.filter((w: any) => w.costPerRequest > 1).length > 0 && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: "var(--red-dim)", border: "1px solid var(--red-border)", borderRadius: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <AlertTriangle size={16} style={{ color: "var(--red-bright)", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--red-bright)", marginBottom: 2 }}>High cost-per-request detected</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  <strong>gpt2-legacy-api</strong> costs $8.24 per request — 145× more expensive than your best-performing model.
                  Consider decommissioning or migrating to a more efficient serving stack.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
