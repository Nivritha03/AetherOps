"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle, CheckCircle2, XCircle, Clock, Zap, Server,
  TrendingUp, AlertOctagon, ChevronRight,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Alert, AlertStatus } from "@/lib/data";
import { useAlerts } from "@/lib/api";

const CATEGORY_ICONS: Record<string, any> = {
  idle: Clock,
  utilization: Zap,
  cost_spike: TrendingUp,
  spot_interruption: AlertOctagon,
  scaling: Server,
};

const CATEGORY_LABELS: Record<string, string> = {
  idle: "GPU Idle",
  utilization: "Utilization",
  cost_spike: "Cost Spike",
  spot_interruption: "Spot Interruption",
  scaling: "Unexpected Scaling",
};

const STATUS_FILTERS = ["All", "Active", "Acknowledged", "Resolved"];

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function AlertRow({ alert, onAcknowledge, onResolve }: {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const Icon = CATEGORY_ICONS[alert.category] || AlertTriangle;
  const severityBadge = {
    critical: "badge-critical", high: "badge-high", medium: "badge-medium", low: "badge-low",
  }[alert.severity] || "badge-low";

  const statusColor = alert.status === "active"
    ? "var(--red-bright)"
    : alert.status === "acknowledged"
    ? "var(--amber-bright)"
    : "var(--green-bright)";

  return (
    <tr style={{ opacity: alert.status === "resolved" ? 0.5 : 1 }}>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            background: alert.severity === "critical" ? "var(--red-dim)" : alert.severity === "high" ? "var(--amber-dim)" : "var(--blue-dim)",
            border: `1px solid ${alert.severity === "critical" ? "var(--red-border)" : alert.severity === "high" ? "var(--amber-border)" : "var(--blue-border)"}`,
          }}>
            <Icon size={14} style={{ color: alert.severity === "critical" ? "var(--red-bright)" : alert.severity === "high" ? "var(--amber-bright)" : "var(--blue-bright)" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{alert.title}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{CATEGORY_LABELS[alert.category] || alert.category}</p>
          </div>
        </div>
      </td>
      <td>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", maxWidth: 320, lineHeight: 1.5 }}>
          {alert.description}
        </p>
      </td>
      <td><span className={`badge ${severityBadge}`}>{alert.severity.toUpperCase()}</span></td>
      <td>
        <span style={{ fontSize: 11, background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 7px", color: "var(--text-secondary)" }}>
          {alert.affectedNode}
        </span>
      </td>
      <td>
        {alert.value && (
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red-bright)" }}>{alert.value}</span>
            {alert.threshold && (
              <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>threshold: {alert.threshold}</p>
            )}
          </div>
        )}
      </td>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div className="dot" style={{ background: statusColor }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: statusColor, textTransform: "capitalize" }}>
            {alert.status}
          </span>
        </div>
        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{formatTime(alert.detectedAt)}</p>
      </td>
      <td>
        <div style={{ display: "flex", gap: 5 }}>
          {alert.status === "active" && (
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => onAcknowledge(alert.id)}>
              Acknowledge
            </button>
          )}
          {alert.status !== "resolved" && (
            <button className="btn btn-green btn-sm" style={{ fontSize: 11 }} onClick={() => onResolve(alert.id)}>
              <CheckCircle2 size={11} /> Resolve
            </button>
          )}
          <a href="/optimize" className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
            Fix <ChevronRight size={10} />
          </a>
        </div>
      </td>
    </tr>
  );
}

export default function AlertsPage() {
  const { data: initialAlerts, loading } = useAlerts();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (initialAlerts) {
      setAlerts(initialAlerts);
    }
  }, [initialAlerts]);

  if (loading || !initialAlerts) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main">
          <TopBar title="Alerts" subtitle="Loading..." />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: "var(--text-muted)" }}>Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  const acknowledge = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "acknowledged" as AlertStatus } : a));
  const resolve     = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved"     as AlertStatus } : a));

  const filtered = alerts.filter(a =>
    filter === "All" || a.status === filter.toLowerCase()
  );

  const activeCount = alerts.filter(a => a.status === "active").length;
  const criticalCount = alerts.filter(a => a.severity === "critical" && a.status === "active").length;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="Alerts" subtitle="Business-focused infrastructure alerts" />
        <div className="page-content fade-up">

          {/* Summary */}
          <div className="metric-grid-4" style={{ marginBottom: 20 }}>
            {[
              { label: "Active Alerts", value: activeCount, color: "var(--red-bright)" },
              { label: "Critical", value: criticalCount, color: "var(--red-bright)" },
              { label: "Acknowledged", value: alerts.filter(a => a.status === "acknowledged").length, color: "var(--amber-bright)" },
              { label: "Resolved", value: alerts.filter(a => a.status === "resolved").length, color: "var(--green-bright)" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ padding: "16px 18px" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Critical banner */}
          {criticalCount > 0 && (
            <div style={{ padding: "12px 16px", background: "var(--red-dim)", border: "1px solid var(--red-border)", borderRadius: 8, marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
              <AlertOctagon size={15} style={{ color: "var(--red-bright)", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "var(--text-primary)" }}>
                <strong style={{ color: "var(--red-bright)" }}>{criticalCount} critical alert{criticalCount > 1 ? "s" : ""}</strong> require immediate attention.
                GPUs have been idle for 72–96 hours and are accruing on-demand charges.
              </p>
              <a href="/optimize" className="btn btn-danger btn-sm" style={{ marginLeft: "auto", flexShrink: 0 }}>
                Fix Now <ChevronRight size={11} />
              </a>
            </div>
          )}

          {/* Filter + table */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="filter-tabs">
              {STATUS_FILTERS.map(f => (
                <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                  {f}
                  {f === "Active" && activeCount > 0 && (
                    <span style={{ marginLeft: 5, background: "var(--red-dim)", color: "var(--red-bright)", border: "1px solid var(--red-border)", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 5px" }}>
                      {activeCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{filtered.length} alerts</p>
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {["Alert", "Description", "Severity", "Affected Node", "Value", "Status", "Actions"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(alert => (
                  <AlertRow key={alert.id} alert={alert} onAcknowledge={acknowledge} onResolve={resolve} />
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
