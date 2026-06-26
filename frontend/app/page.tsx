"use client";

import Link from "next/link";
import {
  DollarSign, TrendingDown, AlertTriangle, Zap,
  Server, Cpu, ArrowRight, Clock, ChevronRight,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useDashboard, useRecommendations, useGpus } from "@/lib/api";

// Circular gauge for optimization score
function OptimizationGauge({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ * 0.75; // 270° arc
  const color = score < 50 ? "#f87171" : score < 75 ? "#fbbf24" : "#22c55e";

  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
      <svg width={130} height={130} viewBox="0 0 130 130" style={{ transform: "rotate(-225deg)" }}>
        {/* Track */}
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10}
          strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
        {/* Fill */}
        <circle cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease, stroke 0.5s ease" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 8,
      }}>
        <span style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{score}</span>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>/ 100</span>
      </div>
    </div>
  );
}

export default function ExecutiveDashboard() {
  const { data: dash, loading: dashLoading } = useDashboard();
  const { data: opts, loading: optsLoading } = useRecommendations();
  const { data: nodes, loading: nodesLoading } = useGpus();

  const loading = dashLoading || optsLoading || nodesLoading;

  if (loading || !dash || !opts || !nodes) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main">
          <TopBar title="Executive Summary" subtitle="Loading..." />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: "var(--text-muted)" }}>Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = opts.filter((o: any) => o.status === "pending").length;
  
  const topIssues = [...opts]
    .filter((o: any) => o.status === "pending" && o.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings).slice(0, 5);

  const topNodes = [...nodes]
    .filter((n: any) => n.status === "idle" || n.status === "misconfigured")
    .sort((a, b) => b.monthlyCost - a.monthlyCost);

  const wastedCost = topNodes.reduce((sum, n) => sum + n.monthlyCost, 0);

  const stats = [
    {
      label: "Monthly GPU Spend",
      value: `$${(dash.monthlyCost / 1000).toFixed(1)}k`,
      icon: DollarSign,
      sub: "Current billing period",
      color: "var(--text-secondary)",
      iconBg: "var(--slate-dim)", iconColor: "var(--text-secondary)",
    },
    {
      label: "Wasted GPU Cost",
      value: `$${(wastedCost / 1000).toFixed(1)}k`,
      icon: AlertTriangle,
      sub: "Idle + underutilized GPUs",
      color: "var(--red-bright)",
      iconBg: "var(--red-dim)", iconColor: "var(--red-bright)",
    },
    {
      label: "Potential Savings",
      value: `$${(dash.potentialSavings / 1000).toFixed(1)}k`,
      icon: TrendingDown,
      sub: `${pendingCount} open recommendations`,
      color: "var(--green-bright)",
      iconBg: "var(--green-dim)", iconColor: "var(--green-bright)",
    },
    {
      label: "Idle GPUs",
      value: `${dash.idleGPUs}`,
      icon: Server,
      sub: "Across all clusters",
      color: "var(--amber-bright)",
      iconBg: "var(--amber-dim)", iconColor: "var(--amber-bright)",
    },
    {
      label: "Active Workloads",
      value: `${dash.activeWorkloads}`,
      icon: Cpu,
      sub: "Models serving traffic",
      color: "var(--blue-bright)",
      iconBg: "var(--blue-dim)", iconColor: "var(--blue-bright)",
    },
    {
      label: "AI Optimization Score",
      value: `${dash.optimizationScore}`,
      icon: Zap,
      sub: "Needs attention",
      color: "var(--red-bright)",
      iconBg: "var(--red-dim)", iconColor: "var(--red-bright)",
    },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar
          title="Executive Dashboard"
          subtitle="AI Infrastructure Cost Intelligence"
          action={{ label: "Review Recommendations", href: "/optimize" }}
        />
        <div className="page-content fade-up">

          {/* ── Hero Card ─────────────────────────────────────────────── */}
          <div className="hero-card" style={{ padding: "32px 36px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div className="dot dot-pulse" style={{ background: "var(--red-bright)" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--red-bright)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Cost Alert
                  </span>
                </div>
                <h2 style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
                  You're wasting{" "}
                  <span style={{ color: "var(--red-bright)" }}>
                    ${wastedCost.toLocaleString()}
                  </span>
                  /month
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 520, lineHeight: 1.6, marginBottom: 20 }}>
                  {topNodes.length} GPU clusters have been idle and are still incurring full on-demand charges.
                  Applying {pendingCount} AI recommendations would reduce your bill to{" "}
                  <span style={{ color: "var(--green-bright)", fontWeight: 600 }}>
                    ${((dash.monthlyCost - dash.potentialSavings) / 1000).toFixed(0)}k/month
                  </span>.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <Link href="/optimize" className="btn btn-green btn-lg">
                    Review {pendingCount} Recommendations <ArrowRight size={16} />
                  </Link>
                  <Link href="/insights" className="btn btn-ghost btn-lg">
                    View AI Analysis
                  </Link>
                </div>
              </div>

              {/* Right: Gauge */}
              <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <OptimizationGauge score={dash.optimizationScore} />
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Optimization Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 6 Stat Cards ──────────────────────────────────────────── */}
          <div className="metric-grid-6" style={{ marginBottom: 20 }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 40}ms` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {s.label}
                  </p>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={13} style={{ color: s.iconColor }} />
                  </div>
                </div>
                <p className="stat-value" style={{ color: s.color, marginBottom: 4 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Top Cost Issues ─────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card" style={{ padding: "22px" }}>
              <div className="section-header">
                <div>
                  <h2 className="section-title">Top Cost Issues</h2>
                  <p className="section-subtitle">Ranked by monthly savings potential</p>
                </div>
                <Link href="/optimize" style={{ fontSize: 12, color: "var(--blue-bright)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                  All <ChevronRight size={12} />
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {topIssues.map((opt: any, i) => (
                  <div key={opt.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 0", borderBottom: i < topIssues.length - 1 ? "1px solid var(--border)" : "none",
                    gap: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 4, background: i === 0 ? "var(--red-dim)" : "var(--slate-dim)",
                        color: i === 0 ? "var(--red-bright)" : "var(--text-muted)",
                        fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, border: `1px solid ${i === 0 ? "var(--red-border)" : "var(--border)"}`,
                      }}>
                        {i + 1}
                      </span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                          {opt.title}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span className={`badge badge-${opt.severity === "critical" ? "critical" : opt.severity === "high" ? "high" : "medium"}`}>
                            {opt.severity.toUpperCase()}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {opt.affectedNodes[0]}
                          </span>
                          {opt.affectedNodes[0] && nodes.find((n: any) => n.name === opt.affectedNodes[0])?.idleHours ? (
                            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
                              <Clock size={10} />
                              {nodes.find((n: any) => n.name === opt.affectedNodes[0])?.idleHours}h idle
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p className="savings-num" style={{ fontSize: 15 }}>${opt.monthlySavings.toLocaleString()}</p>
                      <p style={{ fontSize: 10, color: "var(--text-muted)" }}>/month</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings opportunity card */}
            <div className="card" style={{ padding: "22px" }}>
              <div className="section-header">
                <div>
                  <h2 className="section-title">Savings Opportunity</h2>
                  <p className="section-subtitle">Monthly cost reduction potential</p>
                </div>
                <span className="badge badge-green">
                  ${(dash.potentialSavings / 1000).toFixed(1)}k available
                </span>
              </div>

              {/* Big savings number */}
              <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  If all recommendations applied
                </p>
                <p style={{ fontSize: 48, fontWeight: 800, color: "var(--green-bright)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  ${(dash.potentialSavings / 1000).toFixed(1)}k
                </p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>saved per month</p>
                <p style={{ fontSize: 13, color: "var(--green-bright)", fontWeight: 600, marginTop: 2 }}>
                  ${(dash.potentialSavings * 12 / 1000).toFixed(0)}k/year
                </p>
              </div>

              {/* Progress toward goal */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Current: ${(dash.monthlyCost / 1000).toFixed(1)}k</span>
                  <span style={{ fontSize: 12, color: "var(--green-bright)", fontWeight: 600 }}>
                    Target: ${((dash.monthlyCost - dash.potentialSavings) / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="progress progress-lg">
                  <div className="progress-fill" style={{
                    width: `${((dash.monthlyCost - dash.potentialSavings) / dash.monthlyCost) * 100}%`,
                    background: "linear-gradient(90deg, #16a34a, #22c55e)",
                  }} />
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                  {Math.round((dash.potentialSavings / dash.monthlyCost) * 100)}% cost reduction possible
                </p>
              </div>

              {/* Breakdown by difficulty */}
              {[
                { label: "Easy wins (< 30 min)", savings: opts.filter((o: any) => o.status === "pending" && o.difficulty === "easy" && o.monthlySavings > 0).reduce((s: any, o: any) => s + o.monthlySavings, 0), color: "var(--green-bright)" },
                { label: "Medium effort (1–2 hrs)", savings: opts.filter((o: any) => o.status === "pending" && o.difficulty === "medium" && o.monthlySavings > 0).reduce((s: any, o: any) => s + o.monthlySavings, 0), color: "var(--blue-bright)" },
              ].map(b => (
                <div key={b.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, background: b.color }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{b.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: b.color }}>${b.savings.toLocaleString()}/mo</span>
                </div>
              ))}

              <Link href="/optimize" className="btn btn-green" style={{ width: "100%", marginTop: 12, justifyContent: "center" }}>
                Start Saving Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
