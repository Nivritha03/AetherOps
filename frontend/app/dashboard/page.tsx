"use client";

import Link from "next/link";
import {
  DollarSign, TrendingDown, AlertTriangle, Zap,
  Server, Cpu, ArrowRight, Activity, ShieldAlert,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useDashboard, useRecommendations, useGpus, useCostHistory } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: "10px 14px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)"
    }}>
      <p style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
          {p.name}: ${(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { data: dash, loading: dashLoading, error: dashError } = useDashboard();
  const { data: opts, loading: optsLoading } = useRecommendations();
  const { data: nodes, loading: nodesLoading } = useGpus();
  const { data: costHistory } = useCostHistory();

  const loading = dashLoading || optsLoading || nodesLoading;

  if (dashError) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <TopBar title="Executive Dashboard" subtitle="Error" />
          <div className="page-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: 16 }}>
            <AlertTriangle size={48} color="var(--red-bright)" />
            <h3 style={{ color: "var(--text-primary)", fontSize: 20, fontWeight: 600 }}>Error loading cluster metrics</h3>
            <p style={{ color: "var(--text-muted)" }}>Verify your backend service connection.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !dash || !opts || !nodes) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <TopBar title="Executive Dashboard" subtitle="Connecting to AI Cost Engine..." />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div className="dot dot-pulse" style={{ width: 12, height: 12, background: "var(--blue-primary)" }} />
              <p style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 500 }}>Connecting to AI Cost Engine...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalGpus = nodes?.length || 0;
  const idleGpus = nodes?.filter((n: any) => n.status === "idle").length || 0;
  const misconfiguredGpus = nodes?.filter((n: any) => n.status === "misconfigured").length || 0;
  
  let topOpt = null;
  if (opts && opts.length > 0) {
    topOpt = opts.reduce((prev: any, current: any) => (prev.monthlySavings > current.monthlySavings) ? prev : current);
  }

  // Cost drivers calculations
  const costDrivers = [
    { name: "AWS cluster-us-east-1", cost: 42100, pct: 45, color: "#F59E0B" },
    { name: "GCP model-serving-prod", cost: 32800, pct: 35, color: "#3B82F6" },
    { name: "Azure training-fleet", cost: 18700, pct: 20, color: "#10B981" }
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Executive Dashboard" subtitle="High-level overview of multi-cloud AI infrastructure" />
        
        <div className="page-content fade-up" style={{ padding: "32px 40px" }}>
          
          {/* Key Metrics Row */}
          <div className="metric-grid-4" style={{ marginBottom: 32 }}>
            
            <div className="premium-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
                <span>Monthly Run Rate</span>
                <DollarSign size={16} color="var(--text-muted)" />
              </div>
              <div className="stat-value">${dash.monthlyCost?.toLocaleString()}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 12, color: "var(--red-bright)" }}>
                <TrendingDown size={14} style={{ transform: "rotate(180deg)" }} />
                <span style={{ fontWeight: 600 }}>+4.2% versus baseline</span>
              </div>
            </div>

            <div className="premium-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
                <span>Optimization Savings</span>
                <TrendingDown size={16} color="var(--green-bright)" />
              </div>
              <div className="stat-value text-green">${dash.potentialSavings?.toLocaleString()}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
                <span>From {opts?.length || 0} optimization vectors</span>
              </div>
            </div>

            <div className="premium-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
                <span>Efficiency Rating</span>
                <Zap size={16} color="var(--blue-primary)" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div className="stat-value" style={{ color: dash.optimizationScore < 50 ? "var(--red-bright)" : dash.optimizationScore < 75 ? "var(--amber-bright)" : "var(--green-bright)" }}>
                  {dash.optimizationScore}%
                </div>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${dash.optimizationScore}%`, background: dash.optimizationScore < 50 ? "var(--red-bright)" : dash.optimizationScore < 75 ? "var(--amber-bright)" : "var(--green-bright)", borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>
                Target efficiency score is {'>'}85%
              </div>
            </div>

            <div className="premium-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
                <span>Fleet Utilization</span>
                <Server size={16} color="var(--text-muted)" />
              </div>
              <div className="stat-value">{totalGpus} GPUs</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 12 }}>
                {idleGpus > 0 ? (
                  <><span className="badge badge-amber">{idleGpus} Idle</span> <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>Action Required</span></>
                ) : (
                  <><span className="badge badge-green">Healthy</span> <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>100% Configured</span></>
                )}
              </div>
            </div>

          </div>

          {/* Main Graphs section */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 32 }}>
            
            {/* Trend Area Chart */}
            <div className="premium-card" style={{ padding: 24 }}>
              <div className="section-header" style={{ marginBottom: 24 }}>
                <div>
                  <h3 className="section-title">Billing Timeline & Optimized Runway</h3>
                  <p className="section-subtitle">Visualizing actual multicloud spend compared to fully optimized state.</p>
                </div>
              </div>
              <div style={{ height: 280, width: "100%" }}>
                {costHistory ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={costHistory}>
                      <defs>
                        <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gOptimized" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="actual" name="Actual Spend" stroke="#3B82F6" strokeWidth={2} fill="url(#gActual)" connectNulls />
                      <Area type="monotone" dataKey="optimized" name="Optimized Spend" stroke="#10B981" strokeWidth={2} strokeDasharray="5 3" fill="url(#gOptimized)" connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <p style={{ color: "var(--text-muted)" }}>Aggregating time-series cost history...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cluster Status Map */}
            <div className="premium-card" style={{ padding: 24 }}>
              <div className="section-header" style={{ marginBottom: 16 }}>
                <h3 className="section-title">Kubernetes Cluster Map</h3>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Visual node map showing GPU configurations and status.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 20 }}>
                {nodes?.map((n: any, idx: number) => {
                  const bg = n.status === "healthy" ? "var(--green-bright)" : n.status === "idle" ? "var(--amber-bright)" : "var(--red-bright)";
                  return (
                    <div key={idx} style={{
                      height: 36,
                      borderRadius: 6,
                      background: "var(--bg-secondary)",
                      border: `1px solid var(--border)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative"
                    }} title={`${n.name} (${n.status})`}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: bg }} />
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                  <span>Total Nodes Monitored</span>
                  <span style={{ fontWeight: 600 }}>{totalGpus}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--green-bright)" }}>
                  <span>Healthy / Active</span>
                  <span style={{ fontWeight: 600 }}>{totalGpus - idleGpus - misconfiguredGpus}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--amber-bright)" }}>
                  <span>Idle / Unscheduled</span>
                  <span style={{ fontWeight: 600 }}>{idleGpus}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom rows: Recommendations & Cost Drivers */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
            
            {/* Priority Recommendations */}
            <div className="premium-card" style={{ padding: 24 }}>
              <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                  <h3 className="section-title">Active Savings Vectors</h3>
                  <p className="section-subtitle">High impact optimizations detected by AI logic.</p>
                </div>
                <Link href="/optimize">
                  <button className="btn btn-secondary btn-sm">Explore All</button>
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {opts?.slice(0, 3).map((o: any) => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{o.title}</h4>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{o.cluster} • {o.namespace}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span className={`badge badge-${o.type === 'rightsizing' ? 'amber' : 'blue'}`}>{o.type.toUpperCase()}</span>
                      <span style={{ fontWeight: 700, color: "var(--green-bright)" }}>+${o.monthlySavings}/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Drivers */}
            <div className="premium-card" style={{ padding: 24 }}>
              <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                  <h3 className="section-title">Top Infrastructure Cost Drivers</h3>
                  <p className="section-subtitle">Workloads driving the highest multicloud run-rate.</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {costDrivers.map((driver, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                      <span style={{ color: "var(--text-primary)" }}>{driver.name}</span>
                      <span style={{ color: "var(--text-secondary)" }}>${driver.cost.toLocaleString()}/mo ({driver.pct}%)</span>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className="progress-fill" style={{ width: `${driver.pct}%`, background: driver.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
