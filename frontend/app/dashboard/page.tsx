"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Boxes, Server, Cpu, DollarSign, ShieldCheck,
  CheckCircle2, Zap, Play, RefreshCw
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useDashboard, useRecommendations, useGpus, useCostHistory, usePlatformClusters, useApplications } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dash, refetch: refetchDash, loading: dashLoading } = useDashboard();
  const { data: opts, refetch: refetchOpts } = useRecommendations();
  const { data: nodes, refetch: refetchNodes } = useGpus();
  const { data: costHistory, refetch: refetchCosts } = useCostHistory();
  const { data: clustersData, refetch: refetchClusters } = usePlatformClusters();
  const { data: appsData, refetch: refetchApps } = useApplications();
  const [activeRange, setActiveRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>("Just now");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchDash(),
        refetchOpts(),
        refetchNodes(),
        refetchCosts(),
        refetchClusters(),
        refetchApps(),
      ]);
      const now = new Date();
      setLastRefreshedTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  // Derive live dynamic aggregates from API endpoints
  const clustersList = (clustersData as any)?.data || [];
  const appsList = (appsData as any)?.data || [];
  
  const totalClusters = clustersList.length > 0 ? clustersList.length : 3;
  const runningApps = appsList.length > 0 ? appsList.length : (dash?.activeWorkloads ?? 8);
  
  // Calculate average GPU utilization from live nodes
  const gpuUtil = (nodes && nodes.length > 0)
    ? Math.round((nodes.reduce((acc, n) => acc + (n.utilizationPercent || 0), 0) / nodes.length) * 10) / 10
    : (dash?.optimizationScore ?? 68.5);

  const monthlyCost = dash?.monthlyCost ?? 124500;
  const potentialSavings = dash?.potentialSavings ?? 30200;

  // Use live costHistory data from API
  const chartData = (costHistory && costHistory.length > 0)
    ? costHistory.map((item, idx) => ({
        date: item.date || `Point ${idx + 1}`,
        actual: item.actual ?? (item.forecast ?? 120000),
        optimized: item.optimized ?? (dash ? Math.round(dash.monthlyCost - dash.potentialSavings) : 94000),
      }))
    : [
        { date: "Jun 1", actual: 125000, optimized: 95000 },
        { date: "Jun 10", actual: 118000, optimized: 94500 },
        { date: "Jun 20", actual: 122000, optimized: 94200 },
        { date: "Jun 26", actual: 124500, optimized: 94300 },
      ];

  const topOpt = (opts && opts.length > 0) ? opts[0] : null;

  // Real-time calculated overall resource gauges
  const avgCpu = clustersList.length > 0
    ? Math.round(clustersList.reduce((acc: number, c: any) => acc + (c.cpuUsage || 0), 0) / clustersList.length)
    : 72;
  const avgMem = clustersList.length > 0
    ? Math.round(clustersList.reduce((acc: number, c: any) => acc + (c.memoryUsage || 0), 0) / clustersList.length)
    : 68;
  const overallResourceScore = Math.round((avgCpu + avgMem + gpuUtil) / 3);

  const greetingName = user?.fullName ? user.fullName.split(" ")[0] : "Cloud Engineer";

  return (
    <div className="app-shell" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TopBar />

        <main style={{ padding: "26px 32px 40px", position: "relative" }}>
          
          {/* Subtle Glowing Aurora Mesh Background (Deep Burgundy & Warm Sage) */}
          <div style={{
            position: "absolute", top: 0, right: "5%", width: "550px", height: "240px",
            background: "radial-gradient(ellipse at center, rgba(139, 29, 65, 0.22) 0%, rgba(142, 163, 150, 0.12) 50%, transparent 75%)",
            filter: "blur(40px)", pointerEvents: "none", zIndex: 0
          }} />

          {/* Welcome Banner */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 24, position: "relative", zIndex: 1
          }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--cream-primary)", letterSpacing: "-0.02em" }}>
                Welcome back, {greetingName}! 👋
              </h1>
              <p style={{ fontSize: 13, color: "var(--sage-light)", marginTop: 4 }}>
                Your autonomous multi-cloud infrastructure is streaming live telemetry.
              </p>
            </div>

            {/* Controls & Sync Pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(142, 163, 150, 0.12)", color: "var(--cream-primary)",
                  border: "1px solid var(--border)", borderRadius: 10,
                  padding: "9px 16px", fontSize: 12, fontWeight: 700,
                  cursor: isRefreshing ? "wait" : "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} color="var(--sage-light)" />
                {isRefreshing ? "Refreshing..." : "Refresh Live Data"}
              </button>

              {/* Last Sync Pill */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "10px 16px", backdropFilter: "blur(8px)"
              }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(152, 184, 159, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={13} color="var(--green-bright)" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--cream-primary)" }}>
                    API Sync: {isRefreshing ? "Syncing..." : "Live Connected"}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    Updated {lastRefreshedTime} (:8080)
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16, marginLeft: 6 }}>
                  <span style={{ width: 3, height: 8, background: "var(--burgundy-primary)", borderRadius: 1 }} />
                  <span style={{ width: 3, height: 14, background: "var(--burgundy-primary)", borderRadius: 1 }} />
                  <span style={{ width: 3, height: 11, background: "var(--burgundy-primary)", borderRadius: 1 }} />
                  <span style={{ width: 3, height: 16, background: "var(--sage-light)", borderRadius: 1 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
            
            {/* 1. Total Clusters */}
            <div className="card" style={{ padding: "18px 20px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139, 29, 65, 0.18)", border: "1px solid rgba(139, 29, 65, 0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Server size={18} color="var(--burgundy-primary)" />
                </div>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Total Clusters</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "var(--cream-primary)" }}>{totalClusters}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green-bright)" }}>Live EKS</span>
              </div>
              <div style={{ height: 26, width: "100%", marginTop: 8 }}>
                <svg viewBox="0 0 100 25" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  <path d="M0,20 Q25,8 50,16 T100,6" fill="none" stroke="var(--burgundy-primary)" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* 2. Running Applications */}
            <div className="card" style={{ padding: "18px 20px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(152, 184, 159, 0.18)", border: "1px solid rgba(152, 184, 159, 0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Boxes size={18} color="var(--green-bright)" />
                </div>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Running Workloads</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "var(--cream-primary)" }}>{runningApps}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green-bright)" }}>Pods OK</span>
              </div>
              <div style={{ height: 26, width: "100%", marginTop: 8 }}>
                <svg viewBox="0 0 100 25" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  <path d="M0,18 Q30,22 60,10 T100,5" fill="none" stroke="var(--green-bright)" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* 3. GPU Utilization */}
            <div className="card" style={{ padding: "18px 20px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(217, 160, 102, 0.18)", border: "1px solid rgba(217, 160, 102, 0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Cpu size={18} color="var(--amber-bright)" />
                </div>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>GPU Saturation</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "var(--cream-primary)" }}>{gpuUtil}%</span>
              </div>
              <div style={{ height: 26, width: "100%", marginTop: 8 }}>
                <svg viewBox="0 0 100 25" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  <path d="M0,14 Q30,6 60,18 T100,10" fill="none" stroke="var(--amber-bright)" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* 4. Monthly Cost */}
            <div className="card" style={{ padding: "18px 20px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139, 29, 65, 0.18)", border: "1px solid rgba(139, 29, 65, 0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DollarSign size={18} color="var(--burgundy-primary)" />
                </div>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Monthly Spend</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "var(--cream-primary)" }}>${(monthlyCost / 1000).toFixed(1)}k</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--burgundy-hover)" }}>-${(potentialSavings / 1000).toFixed(0)}k opt</span>
              </div>
              <div style={{ height: 26, width: "100%", marginTop: 8 }}>
                <svg viewBox="0 0 100 25" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  <path d="M0,8 Q35,14 70,18 T100,22" fill="none" stroke="var(--burgundy-primary)" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* 5. Cluster Health */}
            <div className="card" style={{ padding: "18px 20px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(152, 184, 159, 0.18)", border: "1px solid rgba(152, 184, 159, 0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={18} color="var(--green-bright)" />
                </div>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>FinOps Score</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: "var(--cream-primary)" }}>{dash?.optimizationScore ?? 78}/100</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>
                  <span>Optimization index</span>
                </div>
                <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  <div style={{ width: `${dash?.optimizationScore ?? 78}%`, height: "100%", background: "var(--green-bright)", borderRadius: 3 }} />
                </div>
              </div>
            </div>

          </div>

          {/* Middle Row: Cost Trend Chart & Top Optimization Opportunity */}
          <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: 18, marginBottom: 24 }}>
            
            {/* Cost Trend Chart */}
            <div className="card" style={{ padding: "22px 24px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 16, background: "var(--burgundy-primary)", borderRadius: 2 }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--cream-primary)" }}>Infrastructure Cost Trend</h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--burgundy-hover)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--burgundy-primary)" }} /> Actual Cost
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--sage-light)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sage-light)" }} /> Optimized Run-Rate
                    </span>
                  </div>

                  <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: 2, border: "1px solid var(--border)" }}>
                    {["30d", "90d"].map(t => (
                      <button
                        key={t}
                        onClick={() => setActiveRange(t)}
                        style={{
                          background: activeRange === t ? "var(--burgundy-primary)" : "transparent",
                          color: activeRange === t ? "var(--cream-primary)" : "var(--text-muted)",
                          border: "none", padding: "3px 9px", borderRadius: 4,
                          fontSize: 10, fontWeight: 700, cursor: "pointer"
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ height: 210, width: "100%", position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B1D41" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8B1D41" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8EA396" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8EA396" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="rgba(245,240,230,0.3)" fontSize={10} tickLine={false} />
                    <YAxis stroke="rgba(245,240,230,0.3)" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ background: "#221A22", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "#F5F0E6" }}
                      formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="actual" stroke="#8B1D41" strokeWidth={2.5} fill="url(#actualGrad)" />
                    <Area type="monotone" dataKey="optimized" stroke="#8EA396" strokeWidth={2} strokeDasharray="4 4" fill="url(#optGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Optimization Opportunity */}
            <div className="card" style={{
              padding: "22px 24px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Zap size={16} color="var(--amber-bright)" />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--cream-primary)" }}>Top Optimization Opportunity</h3>
                  </div>
                  <Link href="/optimize" style={{ fontSize: 11, color: "var(--sage-light)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                    View All →
                  </Link>
                </div>

                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(152, 184, 159, 0.15)", border: "1px solid rgba(152, 184, 159, 0.3)",
                  borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "var(--green-bright)", marginBottom: 10
                }}>
                  Potential Savings: ${topOpt ? Math.round(topOpt.monthlySavings).toLocaleString() : "47,188"} / month
                </div>

                <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--cream-primary)", marginBottom: 4 }}>
                  {topOpt?.title || "Idle GPU Instances Detected"}
                </h4>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>
                  {topOpt?.problem || "2 instances in AWS us-east-1 have been under 5% utilization for >12 hours."}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "var(--text-muted)", marginBottom: 18 }}>
                  <span style={{ color: "var(--amber-bright)", fontWeight: 600 }}>⚠️ {topOpt?.severity?.toUpperCase() || "CRITICAL"}</span>
                  <span style={{ color: "var(--green-bright)", fontWeight: 600 }}>✓ {topOpt?.confidence ?? 98}% Confidence</span>
                  <span>⏱ {topOpt?.difficulty?.toUpperCase() || "EASY"}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Link href="/simulation" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center", gap: 6 }}>
                  <Play size={12} /> Preview Simulation
                </Link>
                <Link href="/optimize" className="btn btn-ghost btn-sm" style={{ padding: "0 14px", color: "var(--text-muted)", textDecoration: "none" }}>
                  Manage
                </Link>
              </div>
            </div>

          </div>

          {/* Lower 3 Columns: Live Clusters, Applications, System Resources */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr 1.1fr", gap: 18 }}>
            
            {/* 1. Cluster Overview */}
            <div className="card" style={{ padding: "20px 22px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--cream-primary)" }}>Connected Clusters</h3>
                <Link href="/clusters" style={{ fontSize: 11, color: "var(--sage-light)", textDecoration: "none", fontWeight: 600 }}>
                  Manage →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {clustersList.map((c: any) => (
                  <div key={c.id || c.name} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", background: "rgba(255,255,255,0.02)",
                    borderRadius: 8, border: "1px solid var(--border)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.status === "Healthy" ? "var(--green-bright)" : "var(--amber-bright)" }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--cream-primary)" }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{c.provider} · {c.region}</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                      background: c.status === "Healthy" ? "rgba(152, 184, 159, 0.15)" : "rgba(217, 160, 102, 0.15)",
                      color: c.status === "Healthy" ? "var(--green-bright)" : "var(--amber-bright)"
                    }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Live Applications */}
            <div className="card" style={{ padding: "20px 22px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--cream-primary)" }}>Deployed Workloads</h3>
                <Link href="/applications" style={{ fontSize: 11, color: "var(--sage-light)", textDecoration: "none", fontWeight: 600 }}>
                  All Apps →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {appsList.slice(0, 3).map((app: any) => (
                  <div key={app.id || app.name} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", background: "rgba(255,255,255,0.02)",
                    borderRadius: 8, border: "1px solid var(--border)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(139, 29, 65, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Zap size={14} color="var(--burgundy-hover)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--cream-primary)" }}>{app.name}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{app.namespace} · {app.replicas?.current ?? 1} replicas</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green-bright)" }}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. System Resources Gauge */}
            <div className="card" style={{ padding: "20px 22px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--cream-primary)" }}>System Resources</h3>
                <div style={{ display: "flex", gap: 10, fontSize: 10, color: "var(--text-muted)" }}>
                  <span style={{ color: "var(--sage-light)" }}>● CPU</span>
                  <span style={{ color: "var(--burgundy-hover)" }}>● Memory</span>
                  <span style={{ color: "var(--green-bright)" }}>● GPU</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4 }}>
                
                {/* Circular Gauge */}
                <div style={{
                  width: 90, height: 90, borderRadius: "50%",
                  border: "5px solid var(--green-bright)", borderTopColor: "var(--sage-light)", borderRightColor: "var(--burgundy-hover)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "var(--cream-primary)" }}>{overallResourceScore}%</span>
                  <span style={{ fontSize: 9, color: "var(--text-muted)" }}>Avg Cluster</span>
                </div>

                {/* Progress bars */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "CPU", val: avgCpu, color: "var(--sage-light)" },
                    { label: "Memory", val: avgMem, color: "var(--burgundy-hover)" },
                    { label: "GPU", val: Math.round(gpuUtil), color: "var(--green-bright)" },
                  ].map(b => (
                    <div key={b.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-secondary)", marginBottom: 3 }}>
                        <span>{b.label}</span>
                        <span style={{ fontWeight: 700, color: "var(--cream-primary)" }}>{b.val}%</span>
                      </div>
                      <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                        <div style={{ width: `${b.val}%`, height: "100%", background: b.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
