"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { GpuNode, GpuStatus } from "@/lib/data";
import { useGpus } from "@/lib/api";

const STATUS_FILTERS = ["All", "Healthy", "Idle", "Overutilized", "Misconfigured"];

const statusConfig: Record<GpuStatus, { label: string; cls: string }> = {
  healthy:       { label: "Healthy",       cls: "badge status-healthy" },
  idle:          { label: "Idle",          cls: "badge status-idle" },
  overutilized:  { label: "Overutilized",  cls: "badge status-overutilized" },
  misconfigured: { label: "Misconfigured", cls: "badge status-misconfigured" },
};

function HealthScore({ score }: { score: number }) {
  const color = score >= 80 ? "var(--green-bright)" : score >= 55 ? "var(--amber-bright)" : "var(--red-bright)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", border: `2px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color,
      }}>
        {score}
      </div>
    </div>
  );
}

function UtilCell({ value, status }: { value: number; status: GpuStatus }) {
  const color = status === "idle" || status === "misconfigured"
    ? "var(--red-bright)"
    : status === "overutilized"
    ? "var(--amber-bright)"
    : "var(--green-bright)";
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{value}%</span>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [filter, setFilter] = useState("All");
  const [sortCol, setSortCol] = useState<keyof GpuNode>("monthlyCost");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data: nodes, loading } = useGpus();

  if (loading || !nodes) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main">
          <TopBar title="GPU Inventory" subtitle="Loading..." />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: "var(--text-muted)" }}>Loading GPUs...</p>
          </div>
        </div>
      </div>
    );
  }

  const filtered = nodes
    .filter(n => filter === "All" || n.status === filter.toLowerCase().replace(" ", ""))
    .sort((a, b) => {
      const av = a[sortCol] as number | string;
      const bv = b[sortCol] as number | string;
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "desc" ? bv - av : av - bv;
      return 0;
    });

  const toggle = (col: keyof GpuNode) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: keyof GpuNode }) =>
    sortCol === col
      ? sortDir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />
      : <ChevronDown size={11} style={{ opacity: 0.3 }} />;

  const wastedCost = filtered.filter(n => n.status === "idle" || n.status === "misconfigured").reduce((s, n) => s + n.monthlyCost, 0);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="GPU Inventory" subtitle={`${nodes.length} GPUs across ${new Set(nodes.map(n => n.cluster)).size} clusters`} />
        <div className="page-content fade-up">

          {/* Summary */}
          <div className="metric-grid-4" style={{ marginBottom: 20 }}>
            {[
              { label: "Total GPU Nodes", value: nodes.length, color: "var(--text-primary)" },
              { label: "Healthy", value: nodes.filter(n => n.status === "healthy").length, color: "var(--green-bright)" },
              { label: "Idle / Wasted", value: nodes.filter(n => n.status === "idle" || n.status === "misconfigured").length, color: "var(--red-bright)" },
              { label: "Idle Cost/Month", value: `$${(wastedCost / 1000).toFixed(1)}k`, color: "var(--red-bright)" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ padding: "16px 18px" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="filter-tabs">
              {STATUS_FILTERS.map(f => (
                <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                  {f}
                  {f !== "All" && (
                    <span style={{ marginLeft: 5, opacity: 0.7 }}>
                      ({nodes.filter(n => f === "All" || n.status === f.toLowerCase()).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{filtered.length} nodes</p>
          </div>

          {/* Table */}
          <div className="card" style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {[
                    { label: "Health", col: "healthScore" as keyof GpuNode },
                    { label: "Node", col: "name" as keyof GpuNode },
                    { label: "GPU Type", col: "gpuType" as keyof GpuNode },
                    { label: "Status", col: "status" as keyof GpuNode },
                    { label: "Utilization", col: "utilizationPercent" as keyof GpuNode },
                    { label: "Memory", col: "memoryUsedGB" as keyof GpuNode },
                    { label: "Power", col: "powerWatts" as keyof GpuNode },
                    { label: "Idle hrs", col: "idleHours" as keyof GpuNode },
                    { label: "$/hr", col: "costPerHour" as keyof GpuNode },
                    { label: "$/month", col: "monthlyCost" as keyof GpuNode },
                  ].map(h => (
                    <th key={String(h.col)} onClick={() => toggle(h.col)} style={{ userSelect: "none" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        {h.label} <SortIcon col={h.col} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(node => {
                  const sc = statusConfig[node.status];
                  const powerPct = Math.round((node.powerWatts / node.maxPowerWatts) * 100);
                  return (
                    <tr key={node.id}>
                      <td><HealthScore score={node.healthScore} /></td>
                      <td>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{node.name}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{node.cluster} · {node.namespace}</p>
                      </td>
                      <td>
                        <p style={{ fontSize: 13, color: "var(--text-primary)" }}>{node.gpuType}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>×{node.gpuCount} GPUs</p>
                      </td>
                      <td><span className={sc.cls}>{sc.label}</span></td>
                      <td><UtilCell value={node.utilizationPercent} status={node.status} /></td>
                      <td>
                        <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>
                          {node.memoryUsedGB}/{node.memorySizeGB} GB
                        </p>
                        <div className="progress" style={{ marginTop: 4 }}>
                          <div className="progress-fill" style={{ width: `${(node.memoryUsedGB/node.memorySizeGB)*100}%`, background: "var(--blue-bright)" }} />
                        </div>
                      </td>
                      <td>
                        <p style={{ fontSize: 12, color: powerPct > 85 ? "var(--amber-bright)" : "var(--text-secondary)", fontWeight: 500 }}>
                          {node.powerWatts}W
                        </p>
                        <div className="progress" style={{ marginTop: 4 }}>
                          <div className="progress-fill" style={{ width: `${powerPct}%`, background: powerPct > 85 ? "var(--amber-bright)" : "var(--slate-bright)" }} />
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 13, fontWeight: 700,
                          color: node.idleHours > 48 ? "var(--red-bright)" : node.idleHours > 0 ? "var(--amber-bright)" : "var(--text-muted)",
                        }}>
                          {node.idleHours > 0 ? `${node.idleHours}h` : "—"}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                        ${node.costPerHour.toFixed(2)}
                      </td>
                      <td>
                        <span style={{
                          fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em",
                          color: (node.status === "idle" || node.status === "misconfigured") ? "var(--red-bright)" : "var(--text-primary)",
                        }}>
                          ${node.monthlyCost.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
