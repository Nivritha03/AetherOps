"use client";

import { useState } from "react";
import { GitBranch, Play, ArrowRight, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { usePipelines } from "@/lib/api";

interface Pipeline {
  id: string;
  repo: string;
  branch: string;
  commit: string;
  trigger: string;
  duration: string;
  status: "Success" | "Running" | "Failed";
  stages?: { name: string; status: "success" | "running" | "pending" | "failed" }[];
}

export default function PipelinesPage() {
  const { data: apiResponse, loading, error, refetch } = usePipelines();
  const pipelines: Pipeline[] = (apiResponse as any)?.data || [];

  const defaultStages = [
    { name: "Checkout", status: "success" as const },
    { name: "Run Tests", status: "success" as const },
    { name: "Docker Build", status: "success" as const },
    { name: "Push ECR", status: "success" as const },
    { name: "Deploy EKS", status: "success" as const }
  ];

  const handleTrigger = () => {
    alert("Triggered GitHub Actions workflow: aetherops/user-service [main]");
  };

  return (
    <div className="app-shell" style={{ background: "#080B14", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TopBar />

        <main style={{ padding: "26px 32px 40px" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                CI/CD Pipelines & GitHub Actions
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Automated testing, container image building, Amazon ECR publishing, and EKS deployments.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => refetch()} disabled={loading}>
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> {loading ? "Syncing..." : "Refresh"}
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleTrigger}>
                <Play size={13} /> Trigger Pipeline
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Loading pipeline execution states from API...
            </div>
          )}

          {error && (
            <div style={{ padding: 20, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#EF4444", fontSize: 13, marginBottom: 16 }}>
              Failed to load pipelines: {error}
            </div>
          )}

          {/* Pipeline Visual Stages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {pipelines.map(pl => {
              const stages = pl.stages || defaultStages;
              return (
                <div key={pl.id} className="card" style={{ padding: "20px 24px", background: "rgba(16, 22, 36, 0.7)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <GitBranch size={16} color="#3B82F6" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{pl.repo}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          branch <code style={{ color: "#38BDF8" }}>{pl.branch}</code> · commit <code style={{ color: "#A855F7" }}>{pl.commit}</code> · {pl.duration}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4,
                      background: pl.status === "Success" ? "rgba(16, 185, 129, 0.1)" : "rgba(59, 130, 246, 0.1)",
                      color: pl.status === "Success" ? "#10B981" : "#38BDF8"
                    }}>
                      {pl.status}
                    </span>
                  </div>

                  {/* Stages visualization flow */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "rgba(0,0,0,0.3)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    {stages.map((st, i) => (
                      <div key={st.name} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                        <div style={{
                          flex: 1, padding: "8px 10px", borderRadius: 6,
                          background: st.status === "success" ? "rgba(16, 185, 129, 0.1)" : st.status === "running" ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.03)",
                          border: st.status === "running" ? "1px solid #3B82F6" : "1px solid transparent",
                          display: "flex", alignItems: "center", gap: 6
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: st.status === "success" ? "#10B981" : st.status === "running" ? "#38BDF8" : "var(--text-muted)"
                          }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: st.status === "pending" ? "var(--text-muted)" : "#fff" }}>
                            {st.name}
                          </span>
                        </div>
                        {i < stages.length - 1 && (
                          <ArrowRight size={12} color="var(--text-muted)" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
