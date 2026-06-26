"use client";

import { Sparkles, MessageSquare, Search, Bot, Zap, Brain, ArrowRight, Lock } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

const EXAMPLE_QUERIES = [
  { q: "Why is AWS expensive today?", category: "Cost Analysis" },
  { q: "Find all idle GPUs right now", category: "Inventory" },
  { q: "Show the most expensive model per request", category: "Workloads" },
  { q: "What is my projected bill for next month?", category: "Forecasting" },
  { q: "Which cluster has the worst efficiency score?", category: "Health" },
  { q: "Summarize this week's cost changes", category: "Reporting" },
  { q: "Apply all low-effort optimizations automatically", category: "Automation" },
  { q: "Compare GCP vs AWS costs over the last 30 days", category: "Cost Analysis" },
];

const UPCOMING_FEATURES = [
  {
    title: "AI Agent",
    description: "An autonomous agent that continuously monitors your infrastructure, identifies waste, and applies low-risk optimizations without human intervention.",
    icon: Bot,
    timeline: "Q3 2026",
    status: "In Development",
    color: "var(--blue-bright)",
    colorBg: "var(--blue-dim)",
    colorBorder: "var(--blue-border)",
  },
  {
    title: "Natural Language Search",
    description: "Ask any question about your GPU infrastructure in plain English. The AI will query your telemetry and return precise, context-aware answers.",
    icon: MessageSquare,
    timeline: "Q3 2026",
    status: "In Development",
    color: "var(--blue-bright)",
    colorBg: "var(--blue-dim)",
    colorBorder: "var(--blue-border)",
  },
  {
    title: "Predictive Scaling",
    description: "ML model trained on your workload patterns that predicts demand spikes and scales GPU resources proactively — before latency degrades.",
    icon: Brain,
    timeline: "Q4 2026",
    status: "Planned",
    color: "#c084fc",
    colorBg: "rgba(192,132,252,0.1)",
    colorBorder: "rgba(192,132,252,0.2)",
  },
  {
    title: "One-Click Optimization",
    description: "Apply bundles of AI recommendations with a single click. The agent handles Terraform, Helm, and cloud API calls. You review, it executes.",
    icon: Zap,
    timeline: "Q4 2026",
    status: "Planned",
    color: "#c084fc",
    colorBg: "rgba(192,132,252,0.1)",
    colorBorder: "rgba(192,132,252,0.2)",
  },
];

export default function AiFeaturesPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="Future AI Features" subtitle="What's coming to the platform" />
        <div className="page-content fade-up">

          {/* Hero banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(8,12,20,0.95) 50%, rgba(168,85,247,0.06) 100%)",
            border: "1px solid var(--border-strong)", borderRadius: 12, padding: "36px 40px",
            marginBottom: 24, textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                <Sparkles size={18} style={{ color: "var(--blue-bright)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--blue-bright)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Coming Soon
                </span>
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>
                The AI-Native Infrastructure Platform
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 20px", lineHeight: 1.7 }}>
                We're building an autonomous AI agent that understands your infrastructure,
                explains costs in plain English, and takes action — not just recommendations.
              </p>
              <button className="btn btn-primary btn-lg" style={{ opacity: 0.7, cursor: "not-allowed" }}>
                <Lock size={15} /> Join the Waitlist
              </button>
            </div>
          </div>

          {/* Upcoming features */}
          <div style={{ marginBottom: 24 }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>What's Coming</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {UPCOMING_FEATURES.map(f => (
                <div key={f.title} className="card" style={{ padding: "22px", borderColor: f.colorBorder }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: f.colorBg, border: `1px solid ${f.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <f.icon size={20} style={{ color: f.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{f.title}</h3>
                        <span style={{ fontSize: 10, fontWeight: 600, color: f.status === "In Development" ? f.color : "var(--text-muted)", background: f.colorBg, border: `1px solid ${f.colorBorder}`, borderRadius: 4, padding: "1px 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          {f.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 10 }}>{f.description}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Target: {f.timeline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Natural language preview */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Search size={16} style={{ color: "var(--blue-bright)" }} />
              <h2 className="section-title">Natural Language Search — Preview</h2>
              <span className="badge badge-blue" style={{ marginLeft: "auto" }}>Not yet live</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
              In a future release, you'll be able to ask your infrastructure any question. Here's what it will look like:
            </p>

            {/* Fake chat */}
            <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
              {/* User message */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <div style={{ background: "var(--blue-mid)", borderRadius: "10px 10px 2px 10px", padding: "10px 14px", maxWidth: "60%" }}>
                  <p style={{ fontSize: 13, color: "#fff" }}>Why is AWS expensive today?</p>
                </div>
              </div>
              {/* AI response */}
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue-dim)", border: "1px solid var(--blue-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bot size={14} style={{ color: "var(--blue-bright)" }} />
                </div>
                <div style={{ background: "var(--surface-3)", borderRadius: "2px 10px 10px 10px", padding: "12px 14px", maxWidth: "80%" }}>
                  <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.65 }}>
                    AWS spend is <strong style={{ color: "var(--red-bright)" }}>18% above baseline</strong> today because <strong>gpu-a100-prod-02</strong> was provisioned at 02:14 UTC without an autoscaling policy.
                    It has been running at 98% GPU memory for 14 hours. The p4d.24xlarge costs <strong>$32.77/hour</strong>.
                    <br /><br />
                    <span style={{ color: "var(--blue-bright)" }}>→ Recommended action:</span> Enable HPA with a 75% memory threshold. Estimated to reduce cost-per-request by 35%.
                  </p>
                </div>
              </div>
            </div>

            {/* Example queries grid */}
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>Example queries you'll be able to ask:</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {EXAMPLE_QUERIES.map(q => (
                <div key={q.q} className="card-inner" style={{ padding: "10px 12px", cursor: "not-allowed", opacity: 0.65 }}>
                  <p style={{ fontSize: 10, color: "var(--blue-bright)", fontWeight: 600, marginBottom: 3 }}>{q.category}</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{q.q}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
