"use client";

import { useState } from "react";
import { Lightbulb, ArrowRight, Sparkles, Send } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

interface Insight {
  id: string;
  observation: string;
  analysis: string;
  recommendation: string;
  confidence: number;
  monthlySavings: number;
  cluster: string;
  tags: string[];
  severity: "critical" | "high" | "medium";
}

const insights: Insight[] = [
  {
    id: "i1",
    observation: "Your GCP T4 cluster (gpu-t4-dev-01) averaged only 8% GPU utilization over the last 7 days, while running 24/7 at full on-demand pricing.",
    analysis: "GPU utilization peaked at 22% on Tuesday between 10:00–14:00 UTC, which aligns with your team's work hours. Outside of this window, the cluster sits fully idle. The T4 GPU has a TDP of 70W but is consuming an average of only 6W — confirming the workload is not GPU-bound.",
    recommendation: "Move inference to GCP Preemptible T4 instances with auto-shutdown outside 08:00–20:00 UTC. This eliminates 60% of idle time. Alternatively, schedule a node pool scale-down via Cloud Scheduler. Estimated savings: $1,969/month.",
    confidence: 94,
    monthlySavings: 1969,
    cluster: "dev-cluster",
    tags: ["Idle Detection", "Scheduling", "GCP"],
    severity: "high",
  },
  {
    id: "i2",
    observation: "Your AWS p4d.24xlarge node (gpu-a100-prod-02) has been running at 98% GPU memory utilization for 3 consecutive days. P99 inference latency has degraded from 320ms to 620ms.",
    analysis: "Memory saturation is causing CUDA OOM events during batch peaks, forcing the serving stack to reduce batch sizes dynamically. This creates a feedback loop that degrades throughput by an estimated 35–40%. The cost impact is indirect but significant: you are serving fewer requests per dollar.",
    recommendation: "Add a second p4d.24xlarge node and enable horizontal pod autoscaling (HPA) with a GPU memory utilization target of 75%. This will eliminate OOM events and reduce P99 latency to sub-350ms. Note: this adds $23,594/month but is expected to improve revenue-per-GPU-dollar by 2.3×.",
    confidence: 88,
    monthlySavings: -4000,
    cluster: "prod-cluster",
    tags: ["Overutilization", "Performance", "AWS"],
    severity: "high",
  },
  {
    id: "i3",
    observation: "The legacy gpt2-legacy-api model (gpu-v100-legacy-01) is processing 0.3 requests/second at a cost of $8.24 per request. Your most efficient model costs $0.057 per request.",
    analysis: "GPT-2 legacy API is 145× more expensive per request than your LLaMA-3 70B deployment, despite serving a fraction of the traffic. This is driven by: (1) outdated serving stack (no batching), (2) V100 GPU not suited for modern inference workloads, and (3) the model being deprecated without a migration plan.",
    recommendation: "Decommission gpu-v100-legacy-01 entirely. Migrate the 3 downstream services consuming this API to llama-3-70b-inference or embedding-model-v2, both of which are faster and cheaper. This eliminates $6,408/month and reduces per-request cost by 99%.",
    confidence: 97,
    monthlySavings: 6408,
    cluster: "legacy-cluster",
    tags: ["Legacy Migration", "Rightsizing", "Azure"],
    severity: "critical",
  },
  {
    id: "i4",
    observation: "Stable Diffusion XL on Azure is running at 53% GPU utilization with an average latency of 3.2 seconds per image. Your throughput has headroom but requests are not batching correctly.",
    analysis: "The vLLM continuous batching config is not applied to this diffusion workload. Each request is processed independently, causing GPU utilization to spike to 100% per image then drop to near-zero. With proper batching, this node could serve 3–4× the current request volume with the same hardware.",
    recommendation: "Enable dynamic batching in the Diffusers serving config (batch_size=4, max_batch_latency=500ms). This would reduce cost-per-request from $0.472 to ~$0.12 without any infrastructure changes. Implement this before scaling out additional Azure nodes.",
    confidence: 81,
    monthlySavings: 3200,
    cluster: "azure-prod",
    tags: ["Batching", "Performance", "Azure"],
    severity: "medium",
  },
];

const EXAMPLE_QUERIES = [
  "Why is AWS expensive today?",
  "Find all idle GPUs",
  "Show the most expensive model",
  "Which cluster has the worst efficiency?",
  "What is my projected bill for next month?",
];

export default function InsightsPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const severityBadge = { critical: "badge-critical", high: "badge-high", medium: "badge-medium" };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="AI Insights" subtitle="Autonomous analysis and recommendations" />
        <div className="page-content fade-up">

          {/* AI Query box (coming soon) */}
          <div className="card" style={{ padding: "22px 24px", marginBottom: 20, background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(8,12,20,0.9))", border: "1px solid var(--blue-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Sparkles size={16} style={{ color: "var(--blue-bright)" }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Ask your infrastructure a question</h2>
              <span className="badge badge-blue" style={{ marginLeft: "auto" }}>Coming Soon</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. Why is AWS expensive today? / Find idle GPUs / Show most expensive model"
                style={{ flex: 1, opacity: 0.6, cursor: "not-allowed" }}
                disabled
              />
              <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                <Send size={14} /> Ask AI
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {EXAMPLE_QUERIES.map(q => (
                <button key={q} className="btn btn-ghost btn-sm" disabled style={{ opacity: 0.5, cursor: "not-allowed", fontSize: 11 }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Insights header */}
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div>
              <h2 className="section-title">AI-Generated Insights</h2>
              <p className="section-subtitle">{insights.length} insights generated from the last 7 days of telemetry</p>
            </div>
            <span className="badge badge-green">
              ${insights.filter(i => i.monthlySavings > 0).reduce((s, i) => s + i.monthlySavings, 0).toLocaleString()} total opportunity
            </span>
          </div>

          {/* Insight cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {insights.map(insight => {
              const isExpanded = activeId === insight.id;
              const isNeg = insight.monthlySavings < 0;
              return (
                <div
                  key={insight.id}
                  className="card"
                  style={{
                    padding: "0",
                    borderLeft: `3px solid ${insight.severity === "critical" ? "var(--red-mid)" : insight.severity === "high" ? "var(--amber-mid)" : "var(--blue-mid)"}`,
                    overflow: "hidden",
                  }}
                >
                  {/* Collapsed header */}
                  <div
                    style={{ padding: "18px 22px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 16, justifyContent: "space-between" }}
                    onClick={() => setActiveId(isExpanded ? null : insight.id)}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <span className={`badge ${severityBadge[insight.severity]}`}>{insight.severity.toUpperCase()}</span>
                        <span className="badge badge-muted">{insight.cluster}</span>
                        {insight.tags.map(t => (
                          <span key={t} className="badge badge-muted">{t}</span>
                        ))}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Confidence</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: insight.confidence >= 90 ? "var(--green-bright)" : "var(--blue-bright)" }}>
                            {insight.confidence}%
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        <Lightbulb size={13} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--amber-bright)" }} />
                        {insight.observation}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 2 }}>{isNeg ? "Additional cost" : "Est. savings"}</p>
                      <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: isNeg ? "var(--red-bright)" : "var(--green-bright)" }}>
                        {isNeg ? "-" : "+"}${Math.abs(insight.monthlySavings).toLocaleString()}
                      </p>
                      <p style={{ fontSize: 10, color: "var(--text-muted)" }}>/month</p>
                    </div>
                  </div>

                  {/* Expanded: analysis + recommendation */}
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <p style={{ fontSize: 11, color: "var(--blue-bright)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                          Deep Analysis
                        </p>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{insight.analysis}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "var(--green-bright)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                          Recommendation
                        </p>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 14 }}>{insight.recommendation}</p>
                        <a href="/optimize" className="btn btn-green btn-sm">
                          View in Optimization Center <ArrowRight size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
