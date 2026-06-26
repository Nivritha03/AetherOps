"use client";

import { useState } from "react";
import {
  FileText, Download, Calendar, CheckCircle2, Clock, BarChart2, Zap,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

interface Report {
  id: string;
  title: string;
  description: string;
  type: "weekly" | "optimization" | "executive" | "custom";
  lastGenerated: string;
  fileSizeKB: number;
  format: "PDF" | "CSV" | "XLSX";
  icon: typeof FileText;
  highlights: string[];
}

const reports: Report[] = [
  {
    id: "r1", title: "Weekly GPU Cost Report",
    description: "Comprehensive weekly summary of GPU spend, utilization trends, and cost-per-workload breakdown.",
    type: "weekly", lastGenerated: "Jun 24, 2026", fileSizeKB: 284,
    format: "PDF", icon: BarChart2,
    highlights: ["Total spend: $83,059", "Week-over-week: +4.2%", "Idle GPU cost: $18,421", "3 new alerts triggered"],
  },
  {
    id: "r2", title: "Optimization Report",
    description: "Full list of AI-generated recommendations with savings estimates, difficulty ratings, and implementation guides.",
    type: "optimization", lastGenerated: "Jun 26, 2026", fileSizeKB: 412,
    format: "PDF", icon: Zap,
    highlights: ["5 open recommendations", "$25,397/mo potential savings", "2 critical issues", "$305,160 annual opportunity"],
  },
  {
    id: "r3", title: "Executive Summary",
    description: "One-page executive briefing with top-line cost metrics, optimization score, and strategic recommendations.",
    type: "executive", lastGenerated: "Jun 25, 2026", fileSizeKB: 156,
    format: "PDF", icon: FileText,
    highlights: ["AI Score: 38/100 (Needs Work)", "Wasted spend: $18,421/mo", "Recommended actions: 5", "ROI timeline: 2.1 months"],
  },
  {
    id: "r4", title: "Cost by Namespace & Model",
    description: "Detailed cost attribution by Kubernetes namespace and deployed model, with per-request cost analysis.",
    type: "custom", lastGenerated: "Jun 23, 2026", fileSizeKB: 98,
    format: "XLSX", icon: BarChart2,
    highlights: ["6 namespaces tracked", "Most expensive: inference ($35k)", "Cheapest per request: llama-3 ($0.057)", "Legacy model: $8.24/request"],
  },
];

const scheduleOptions = ["Daily", "Weekly", "Monthly", "On-demand"];

export default function ReportsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [schedule, setSchedule] = useState("Weekly");

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <TopBar title="Reports" subtitle="Downloadable cost and optimization reports" />
        <div className="page-content fade-up">

          {/* Schedule controls */}
          <div className="card" style={{ padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>Automated Report Delivery</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Reports are emailed automatically on your schedule.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="filter-tabs">
                {scheduleOptions.map(s => (
                  <button key={s} className={`filter-tab ${schedule === s ? "active" : ""}`} onClick={() => setSchedule(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary btn-sm">
                <CheckCircle2 size={13} /> Save Schedule
              </button>
            </div>
          </div>

          {/* Report cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {reports.map(report => (
              <div key={report.id} className="card card-hover" style={{ padding: "22px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: "var(--blue-dim)", border: "1px solid var(--blue-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <report.icon size={18} style={{ color: "var(--blue-bright)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{report.title}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{report.description}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 7, padding: "12px 14px", marginBottom: 14 }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Latest Highlights</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                    {report.highlights.map(h => (
                      <p key={h} style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", gap: 6, alignItems: "flex-start" }}>
                        <span style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 1 }}>·</span>
                        {h}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={11} /> {report.lastGenerated}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <FileText size={11} /> {report.format} · {report.fileSizeKB} KB
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm">
                      <Clock size={12} /> Schedule
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <Download size={12} /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom report builder */}
          <div className="card" style={{ padding: "22px", marginTop: 14, borderStyle: "dashed", borderColor: "var(--border-strong)" }}>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <FileText size={28} style={{ color: "var(--text-muted)", marginBottom: 10, opacity: 0.5 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Custom Report Builder</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
                Build a tailored report filtered by cluster, date range, cost type, and more.
              </p>
              <button className="btn btn-ghost">
                <BarChart2 size={14} /> Build Custom Report
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
