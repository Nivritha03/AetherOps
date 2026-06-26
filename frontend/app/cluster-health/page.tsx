"use client";

import { AlertTriangle, XCircle, CheckCircle2, Server, HardDrive, Wifi } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { ClusterSummary } from "@/lib/data";
import { useClusters } from "@/lib/api";

function HealthRing({ score }: { score: number }) {
  const color = score >= 80 ? "var(--green-bright)" : score >= 55 ? "var(--amber-bright)" : "var(--red-bright)";
  const r = 22;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
      <svg width={56} height={56} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{score}</span>
      </div>
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: ClusterSummary }) {
  const storePct = Math.round((cluster.storageUsedGB / cluster.storageTotalGB) * 100);
  const hasIssues = cluster.errors > 0 || cluster.warnings > 2;
  return (
    <div className="card" style={{
      padding: "20px",
      borderColor: hasIssues ? (cluster.errors > 0 ? "var(--red-border)" : "var(--amber-border)") : "var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
        <HealthRing score={cluster.healthScore} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{cluster.name}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{cluster.cloud} · {cluster.region}</p>
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            {cluster.errors > 0 && (
              <span className="badge badge-critical">
                <XCircle size={10} /> {cluster.errors} error{cluster.errors > 1 ? "s" : ""}
              </span>
            )}
            {cluster.warnings > 0 && (
              <span className="badge badge-high">
                <AlertTriangle size={10} /> {cluster.warnings} warning{cluster.warnings > 1 ? "s" : ""}
              </span>
            )}
            {cluster.errors === 0 && cluster.warnings === 0 && (
              <span className="badge badge-green"><CheckCircle2 size={10} /> Healthy</span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Total Nodes", value: cluster.totalNodes, icon: Server },
          { label: "GPU Nodes", value: cluster.gpuNodes, icon: Server },
          { label: "Running Pods", value: cluster.runningPods, icon: CheckCircle2 },
          { label: "Pending Pods", value: cluster.pendingPods, icon: AlertTriangle },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 5, background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <m.icon size={12} style={{ color: "var(--text-muted)" }} />
            </div>
            <div>
              <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{m.label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: m.label === "Pending Pods" && m.value > 0 ? "var(--amber-bright)" : "var(--text-primary)" }}>
                {m.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Storage */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            <HardDrive size={10} /> Storage
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: storePct > 85 ? "var(--amber-bright)" : "var(--text-secondary)" }}>
            {cluster.storageUsedGB.toLocaleString()} / {cluster.storageTotalGB.toLocaleString()} GB
          </span>
        </div>
        <div className="progress">
          <div className="progress-fill" style={{
            width: `${storePct}%`,
            background: storePct > 85 ? "var(--amber-bright)" : storePct > 95 ? "var(--red-bright)" : "var(--blue-bright)",
          }} />
        </div>
      </div>

      {/* Network */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Wifi size={11} style={{ color: "var(--text-muted)" }} />
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
          ↓ {cluster.networkInGbps} Gbps · ↑ {cluster.networkOutGbps} Gbps
        </span>
      </div>
    </div>
  );
}

export default function ClusterHealthPage() {
  const { data: clusters, loading } = useClusters();

  if (loading || !clusters) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main">
          <TopBar title="Cluster Health" subtitle="Loading..." />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: "var(--text-muted)" }}>Loading clusters...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalNodes = clusters.reduce((s: number, c: any) => s + c.totalNodes, 0);
  const totalGpuNodes = clusters.reduce((s: number, c: any) => s + c.gpuNodes, 0);
  const totalPods = clusters.reduce((s: number, c: any) => s + c.runningPods, 0);
  const totalWarnings = clusters.reduce((s: number, c: any) => s + c.warnings, 0);
  const totalErrors = clusters.reduce((s: number, c: any) => s + c.errors, 0);
  const avgHealth = Math.round(clusters.reduce((s: number, c: any) => s + c.healthScore, 0) / clusters.length);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="Cluster Health" subtitle="Infrastructure status across all clusters" />
        <div className="page-content fade-up">

          {/* Summary */}
          <div className="metric-grid-6" style={{ marginBottom: 20 }}>
            {[
              { label: "Clusters", value: clusters.length, color: "var(--text-primary)" },
              { label: "Total Nodes", value: totalNodes, color: "var(--text-primary)" },
              { label: "GPU Nodes", value: totalGpuNodes, color: "var(--blue-bright)" },
              { label: "Running Pods", value: totalPods, color: "var(--green-bright)" },
              { label: "Warnings", value: totalWarnings, color: "var(--amber-bright)" },
              { label: "Errors", value: totalErrors, color: "var(--red-bright)" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ padding: "14px 16px" }}>
                <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Avg health bar */}
          {totalErrors > 0 && (
            <div style={{ padding: "12px 16px", background: "var(--red-dim)", border: "1px solid var(--red-border)", borderRadius: 8, marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
              <XCircle size={14} style={{ color: "var(--red-bright)", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "var(--text-primary)" }}>
                <strong style={{ color: "var(--red-bright)" }}>{totalErrors} cluster error{totalErrors > 1 ? "s" : ""}</strong> detected.
                {" "}<strong>legacy-cluster</strong> and <strong>staging-cluster</strong> require immediate attention.
              </p>
            </div>
          )}

          {/* Cluster cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[...clusters].sort((a: any, b: any) => a.healthScore - b.healthScore).map((cluster: any) => (
              <ClusterCard key={cluster.name} cluster={cluster} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
