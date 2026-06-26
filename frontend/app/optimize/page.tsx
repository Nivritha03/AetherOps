"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp,
  Zap, TrendingDown, Calendar, AlertTriangle, ArrowRight,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Optimization, OptStatus } from "@/lib/data";
import { useRecommendations } from "@/lib/api";

const FILTERS = ["All", "Critical", "High", "Medium", "Easy Wins", "Applied", "Scheduled"];

const difficultyConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  easy:   { label: "Easy",   color: "var(--green-bright)",  bg: "var(--green-dim)",  border: "var(--green-border)" },
  medium: { label: "Medium", color: "var(--amber-bright)",  bg: "var(--amber-dim)",  border: "var(--amber-border)" },
  hard:   { label: "Hard",   color: "var(--red-bright)",    bg: "var(--red-dim)",    border: "var(--red-border)" },
};

const typeLabels: Record<string, string> = {
  rightsizing: "Rightsizing", scheduling: "Scheduling",
  reserved: "Reserved Instances", spot: "Spot Instances",
  preemptible: "Preemptible VMs", cleanup: "Cleanup",
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? "var(--green-bright)" : value >= 75 ? "var(--blue-bright)" : "var(--amber-bright)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div className="progress" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{value}%</span>
    </div>
  );
}

function OptCard({ opt, onAction }: { opt: Optimization; onAction: (id: string, action: OptStatus) => void }) {

  const [expanded, setExpanded] = useState(false);
  const d = difficultyConfig[opt.difficulty];
  const isNegSavings = opt.monthlySavings < 0;

  const severityBadge = {
    critical: "badge-critical", high: "badge-high",
    medium: "badge-medium", low: "badge-low",
  }[opt.severity];

  return (
    <div className="card card-hover" style={{
      padding: "20px 22px",
      borderLeft: `3px solid ${opt.severity === "critical" ? "var(--red-mid)" : opt.severity === "high" ? "var(--amber-mid)" : "var(--blue-mid)"}`,
      opacity: opt.status === "ignored" ? 0.45 : 1,
      transition: "opacity 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, justifyContent: "space-between" }}>

        {/* Left content */}
        <div style={{ flex: 1 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span className={`badge ${severityBadge}`}>{opt.severity.toUpperCase()}</span>
            <span className="badge badge-muted">{typeLabels[opt.type]}</span>
            <span className="badge badge-muted">{opt.cluster}</span>
            {opt.status === "applied"   && <span className="badge badge-green">✓ Applied</span>}
            {opt.status === "scheduled" && <span className="badge badge-blue">⏰ Scheduled</span>}
            {opt.status === "ignored"   && <span className="badge badge-muted">Ignored</span>}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.01em" }}>
            {opt.title}
          </h3>

          {/* Problem */}
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 10 }}>
            {opt.problem}
          </p>

          {/* Metadata row */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Confidence</p>
              <div style={{ width: 140 }}><ConfidenceBar value={opt.confidence} /></div>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Effort</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: d.color, background: d.bg, border: `1px solid ${d.border}`, padding: "2px 8px", borderRadius: 4 }}>
                {d.label} · {opt.estimatedTime}
              </span>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Affected Nodes</p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {opt.affectedNodes.map(n => (
                  <span key={n} style={{ fontSize: 11, background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 7px", color: "var(--text-secondary)" }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Expandable: AI reasoning + action */}
          {expanded && (
            <div style={{ marginTop: 12, padding: "14px 16px", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 8 }}>
              <p style={{ fontSize: 11, color: "var(--blue-bright)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                AI Analysis
              </p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 10 }}>
                {opt.aiReasoning}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Recommended Action
              </p>
              <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>
                {opt.action}
              </p>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
          >
            {expanded ? <><ChevronUp size={13} />Hide analysis</> : <><ChevronDown size={13} />View AI analysis</>}
          </button>
        </div>

        {/* Right: Savings + Actions */}
        <div style={{ flexShrink: 0, textAlign: "right", minWidth: 160 }}>
          <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            {isNegSavings ? "Monthly Cost" : "Monthly Savings"}
          </p>
          <p style={{
            fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1,
            color: isNegSavings ? "var(--red-bright)" : "var(--green-bright)",
          }}>
            {isNegSavings ? "-" : "+"}${Math.abs(opt.monthlySavings).toLocaleString()}
          </p>
          {!isNegSavings && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
              ${opt.annualSavings.toLocaleString()}/year
            </p>
          )}

          {opt.status === "pending" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
              <button className="btn btn-green btn-sm" style={{ justifyContent: "center" }} onClick={() => onAction(opt.id, "applied")}>
                <CheckCircle2 size={13} /> Apply Now
              </button>
              <button className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }} onClick={() => onAction(opt.id, "scheduled")}>
                <Calendar size={13} /> Schedule
              </button>
              <button className="btn btn-danger btn-sm" style={{ justifyContent: "center", fontSize: 11 }} onClick={() => onAction(opt.id, "ignored")}>
                <XCircle size={12} /> Ignore
              </button>
            </div>
          )}
          {opt.status === "applied" && (
            <div style={{ marginTop: 16, padding: "8px 12px", background: "var(--green-dim)", border: "1px solid var(--green-border)", borderRadius: 6 }}>
              <p style={{ fontSize: 12, color: "var(--green-bright)", fontWeight: 600 }}>✓ Applied</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Saving in effect</p>
            </div>
          )}
          {opt.status === "scheduled" && (
            <div style={{ marginTop: 16, padding: "8px 12px", background: "var(--blue-dim)", border: "1px solid var(--blue-border)", borderRadius: 6 }}>
              <p style={{ fontSize: 12, color: "var(--blue-bright)", fontWeight: 600 }}>⏰ Scheduled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OptimizationCenter() {

  const { data: recommendations, loading } = useRecommendations();
  const [items, setItems] = useState<Optimization[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (recommendations) {
      setItems(recommendations);
    }
  }, [recommendations]);

  if (loading || !recommendations) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main">
          <TopBar title="Optimization Center" subtitle="Loading..." />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: "var(--text-muted)" }}>Loading recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  function handleAction(id: string, action: OptStatus) {
    setItems(prev => prev.map(o => o.id === id ? { ...o, status: action } : o));
  }

  const filtered = items.filter(o => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Critical") return o.severity === "critical";
    if (activeFilter === "High") return o.severity === "high";
    if (activeFilter === "Medium") return o.severity === "medium";
    if (activeFilter === "Easy Wins") return o.difficulty === "easy" && o.status === "pending";
    if (activeFilter === "Applied") return o.status === "applied";
    if (activeFilter === "Scheduled") return o.status === "scheduled";
    return true;
  });

  const pendingSavings = items.filter(o => o.status === "pending" && o.monthlySavings > 0).reduce((s, o) => s + o.monthlySavings, 0);
  const appliedSavings = items.filter(o => o.status === "applied" && o.monthlySavings > 0).reduce((s, o) => s + o.monthlySavings, 0);
  const pendingCount = items.filter(o => o.status === "pending").length;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="Optimization Center" subtitle="AI-powered cost reduction recommendations" />
        <div className="page-content fade-up">

          {/* Summary bar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Open Recommendations", value: pendingCount, color: "var(--text-primary)" },
              { label: "Available Savings", value: `$${(pendingSavings / 1000).toFixed(1)}k/mo`, color: "var(--green-bright)" },
              { label: "Applied Savings", value: `$${(appliedSavings / 1000).toFixed(1)}k/mo`, color: "var(--blue-bright)" },
              { label: "Annual Opportunity", value: `$${(pendingSavings * 12 / 1000).toFixed(0)}k/yr`, color: "var(--green-bright)" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ padding: "16px 18px" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="filter-tabs">
              {FILTERS.map(f => (
                <button key={f} className={`filter-tab ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {filtered.length} recommendation{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Recommendation cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.length === 0 ? (
              <div className="card empty-state">
                <CheckCircle2 size={32} style={{ color: "var(--green-bright)", opacity: 0.5 }} />
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No recommendations in this category.</p>
              </div>
            ) : (
              filtered.map(opt => (
                <OptCard key={opt.id} opt={opt} onAction={handleAction} />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
