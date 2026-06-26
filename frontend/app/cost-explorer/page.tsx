"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import { TrendingDown, ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useCostHistory, useCostBreakdown } from "@/lib/api";

const BREAKDOWN_TABS = ["Cloud", "GPU Type", "Namespace", "Model"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-strong)", borderRadius: 8, padding: "12px 16px", minWidth: 180 }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, fontSize: 13, fontWeight: 600, marginBottom: 3 }}>
          {p.name}: ${(p.value / 1000).toFixed(1)}k
        </p>
      ))}
    </div>
  );
};

export default function CostExplorerPage() {
  const [breakdownTab, setBreakdownTab] = useState("Cloud");

  const { data: historyData, loading: historyLoading } = useCostHistory();
  const { data: breakdownRawData, loading: breakdownLoading } = useCostBreakdown();

  if (historyLoading || breakdownLoading || !historyData || !breakdownRawData) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main">
          <TopBar title="Cost Explorer" subtitle="Loading..." />
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p style={{ color: "var(--text-muted)" }}>Loading cost data...</p>
          </div>
        </div>
      </div>
    );
  }

  const breakdownData = {
    Cloud:     breakdownRawData.cloud,
    "GPU Type": breakdownRawData.gpu,
    Namespace: breakdownRawData.namespace,
    Model:     breakdownRawData.namespace, // reuse for demo
  }[breakdownTab] ?? breakdownRawData.cloud;

  const currentToOptimized = breakdownRawData.totals.savings;
  const savingsPct = breakdownRawData.totals.savingsPercent;
  const TOTAL_MONTHLY_COST = breakdownRawData.totals.current;
  const PROJECTED_WITH_OPTS = breakdownRawData.totals.projected;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="Cost Explorer" subtitle="Spend analysis with AI-powered forecasting" />
        <div className="page-content fade-up">

          {/* Forecast banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(5,150,105,0.04))",
            border: "1px solid var(--green-border)", borderRadius: 10,
            padding: "18px 24px", marginBottom: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
          }}>
            <div>
              <p style={{ fontSize: 11, color: "var(--green-bright)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                AI Cost Forecast
              </p>
              <p style={{ fontSize: 14, color: "var(--text-primary)" }}>
                At current trajectory, your July bill will reach{" "}
                <strong style={{ color: "var(--red-bright)" }}>${(88000/1000).toFixed(0)}k</strong>.
                Apply all recommendations to land at{" "}
                <strong style={{ color: "var(--green-bright)" }}>${(PROJECTED_WITH_OPTS/1000).toFixed(0)}k</strong> — saving{" "}
                <strong style={{ color: "var(--green-bright)" }}>${(currentToOptimized/1000).toFixed(0)}k ({savingsPct}%)</strong>.
              </p>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Monthly savings potential</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: "var(--green-bright)", letterSpacing: "-0.03em" }}>
                ${(currentToOptimized / 1000).toFixed(0)}k
              </p>
            </div>
          </div>

          {/* Main chart */}
          <div className="card" style={{ padding: "22px", marginBottom: 16 }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Cost Over Time — Actual vs Forecast</h2>
                <p className="section-subtitle">Solid = actual spend · Dashed = current trajectory · Green = optimized projection</p>
              </div>
              <select style={{ fontSize: 12 }}>
                <option>Last 30 days + 30 day forecast</option>
                <option>Last 60 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOptimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x="Jun 30" stroke="var(--border-strong)" strokeDasharray="4 4" label={{ value: "Today", fill: "var(--text-muted)", fontSize: 11 }} />
                <Area type="monotone" dataKey="actual" name="Actual" stroke="#60a5fa" strokeWidth={2} fill="url(#gActual)" connectNulls />
                <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#f87171" strokeWidth={2} strokeDasharray="6 3" fill="url(#gForecast)" connectNulls />
                <Area type="monotone" dataKey="optimized" name="Optimized" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 3" fill="url(#gOptimized)" connectNulls />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown + Bar chart */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>

            {/* Breakdown list */}
            <div className="card" style={{ padding: "20px 22px" }}>
              <div className="section-header">
                <h2 className="section-title">Cost Breakdown</h2>
                <div className="filter-tabs">
                  {BREAKDOWN_TABS.map(t => (
                    <button key={t} className={`filter-tab ${breakdownTab === t ? "active" : ""}`} onClick={() => setBreakdownTab(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                {breakdownData.sort((a: any, b: any) => b.cost - a.cost).map((item: any) => (
                  <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>${(item.cost/1000).toFixed(1)}k</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 30, textAlign: "right" }}>{item.percent}%</span>
                      </div>
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{ width: `${item.percent}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider" style={{ margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Total this month</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>${(TOTAL_MONTHLY_COST/1000).toFixed(1)}k</span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="card" style={{ padding: "20px 22px" }}>
              <div className="section-header">
                <h2 className="section-title">Spend by {breakdownTab}</h2>
                <p className="section-subtitle">Current month</p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[...breakdownData].sort((a: any,b: any) => b.cost - a.cost)} layout="vertical" barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                  <YAxis type="category" dataKey="label" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    formatter={(v: any) => [`$${(Number(v)/1000).toFixed(1)}k`, "Cost"]}
                    contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border-strong)", borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="cost" radius={[0, 5, 5, 0]}>
                    {breakdownData.map((item: any, i: number) => (
                      <rect key={i} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
