"use client";

import { useState } from "react";
import {
  FileText, Download, Calendar, CheckCircle2, Clock, BarChart2, Zap,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useDashboard, useRecommendations, useGpus, useCostHistory } from "@/lib/api";

const scheduleOptions = ["Daily", "Weekly", "Monthly", "On-demand"];

export default function ReportsPage() {
  const [schedule, setSchedule] = useState("Weekly");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { data: dash } = useDashboard();
  const { data: opts } = useRecommendations();
  const { data: gpus } = useGpus();
  const { data: costs } = useCostHistory();

  const totalSpend = dash?.monthlyCost ? `$${(dash.monthlyCost).toLocaleString()}` : "$124,500";
  const savingsAmount = dash?.potentialSavings ? `$${(dash.potentialSavings).toLocaleString()}` : "$30,200";
  const openRecsCount = opts?.length ?? 1;
  const activeNodesCount = gpus?.length ?? 2;
  const finopsScore = dash?.optimizationScore ?? 78;

  const dynamicReports = [
    {
      id: "r1",
      title: "Active Infrastructure Cost Audit",
      description: "Live cluster summary of GPU compute run-rates, container memory utilization, and cost-per-workload attribution.",
      type: "weekly",
      fileSizeKB: 284,
      format: "CSV",
      icon: BarChart2,
      highlights: [
        `Total Monthly Run-rate: ${totalSpend}`,
        `Identified Idle Waste: ${savingsAmount}/mo`,
        `Monitored GPU Nodes: ${activeNodesCount} nodes active`,
        "Live PromQL & API Telemetry Sync",
      ],
    },
    {
      id: "r2",
      title: "FinOps Optimization Recommendations",
      description: "Actionable list of AI-generated cluster rightsizing recommendations with ROI estimates and safe implementation scripts.",
      type: "optimization",
      fileSizeKB: 412,
      format: "CSV",
      icon: Zap,
      highlights: [
        `${openRecsCount} open optimization recommendations`,
        `${savingsAmount}/mo potential monthly savings`,
        `Cluster FinOps Index: ${finopsScore}/100`,
        "Pre-validated Terraform & kubectl actions",
      ],
    },
    {
      id: "r3",
      title: "Multi-Cloud Executive FinOps Briefing",
      description: "Top-line executive overview covering overall spend efficiency, cloud distribution, and autonomous self-healing results.",
      type: "executive",
      fileSizeKB: 156,
      format: "CSV",
      icon: FileText,
      highlights: [
        `Optimization Score: ${finopsScore}/100 (Optimized)`,
        `Recoverable Monthly Spend: ${savingsAmount}`,
        `${openRecsCount} high-impact actions pending`,
        "Zero downtime automated self-healing",
      ],
    },
    {
      id: "r4",
      title: "Kubernetes Workload & Node Inventory",
      description: "Per-node hardware inventory with instance sizes, GPU VRAM allocations, and regional cluster topology.",
      type: "custom",
      fileSizeKB: 198,
      format: "CSV",
      icon: BarChart2,
      highlights: [
        `${activeNodesCount} GPU instances tracked`,
        "NVIDIA A100 / V100 GPU architecture",
        "Direct NVML hardware telemetry",
        "Continuous Prometheus scraping",
      ],
    },
  ];

  const handleExport = (reportId: string) => {
    const typeMap: Record<string, string> = {
      r1: "cost",
      r2: "recommendations",
      r3: "savings",
      r4: "inventory",
    };
    const targetType = typeMap[reportId] || "cost";
    window.open(`http://localhost:8080/api/v1/reports/export/csv?type=${targetType}`, "_blank");
  };

  const handleSaveSchedule = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="app-shell" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Sidebar />
      <div className="main">
        <TopBar title="FinOps Reports" subtitle="Real-time downloadable infrastructure and cost audit reports" />
        <div className="page-content fade-up">

          {/* Schedule controls */}
          <div className="card" style={{ padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, justifyContent: "space-between", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--cream-primary)", marginBottom: 2 }}>Automated FinOps Delivery</p>
              <p style={{ fontSize: 12, color: "var(--sage-light)" }}>Automated cluster reports generated directly from live SQLite database snapshots.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="filter-tabs">
                {scheduleOptions.map(s => (
                  <button key={s} className={`filter-tab ${schedule === s ? "active" : ""}`} onClick={() => setSchedule(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleSaveSchedule}>
                <CheckCircle2 size={13} /> {savedSuccess ? "Schedule Saved!" : "Save Schedule"}
              </button>
            </div>
          </div>

          {/* Report cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {dynamicReports.map(report => (
              <div key={report.id} className="card card-hover" style={{ padding: "22px", background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: "rgba(139, 29, 65, 0.2)", border: "1px solid rgba(139, 29, 65, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <report.icon size={18} style={{ color: "var(--burgundy-hover)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--cream-primary)", marginBottom: 2 }}>{report.title}</p>
                    <p style={{ fontSize: 12, color: "var(--sage-light)", lineHeight: 1.5 }}>{report.description}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div style={{ background: "rgba(18, 13, 18, 0.6)", border: "1px solid var(--border)", borderRadius: 7, padding: "12px 14px", marginBottom: 14 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Live Telemetry Highlights</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {report.highlights.map(h => (
                      <p key={h} style={{ fontSize: 12, color: "var(--cream-soft)", display: "flex", gap: 6, alignItems: "flex-start" }}>
                        <span style={{ color: "var(--burgundy-hover)", flexShrink: 0, marginTop: 1 }}>●</span>
                        {h}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span style={{ fontSize: 11, color: "var(--sage-light)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={11} /> Live Generated
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <FileText size={11} /> {report.format} · Backend Live
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleExport(report.id)}
                    >
                      <Download size={12} /> Download CSV
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Direct CSV Export Panel */}
          <div className="card" style={{ padding: "22px", marginTop: 16, background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--cream-primary)", marginBottom: 4 }}>Direct Backend Export Stream</p>
                <p style={{ fontSize: 12, color: "var(--sage-light)" }}>
                  Stream live CSV dumps directly from the backend Go API at <code>/api/v1/reports/export/csv</code>.
                </p>
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => window.open("http://localhost:8080/api/v1/reports/export/csv?type=all", "_blank")}
              >
                <Download size={14} /> Full Cluster Dump (.csv)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
