"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useDashboard } from "@/lib/api";

export default function SimulationPage() {
  const [spotRatio, setSpotRatio] = useState(30);
  const [headroom, setHeadroom] = useState(15);
  const [rightsizeMultiplier, setRightsizeMultiplier] = useState(1.0);
  
  const { data: dash } = useDashboard();
  
  // Real baseline monthly cost from live backend API ($124,500)
  const baselineCost = dash?.monthlyCost ?? 124500;
  const spotSavings = baselineCost * (spotRatio / 100) * 0.6; // Spot is 60% cheaper
  const rightsizingSavings = baselineCost * ((100 - headroom) / 100) * (1 - rightsizeMultiplier) * 0.3;
  const totalSavings = Math.round(spotSavings + Math.max(0, rightsizingSavings));
  const simulatedCost = Math.max(20000, baselineCost - totalSavings);

  return (
    <div className="app-shell" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Sidebar />
      <div className="main-content">
        <TopBar title="Simulation Center" subtitle="Test Rightsizing & Cloud pricing shifts against live cluster baseline" />
        
        <div className="page-content fade-up" style={{ padding: "32px 40px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32 }}>
            
            {/* Simulation controls panel */}
            <div className="premium-card" style={{ padding: 28, background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--cream-primary)" }}>Simulation Parameters</h3>
              
              {/* Slider 1: Spot ratio */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: "var(--sage-light)" }}>Target Spot Ratio</span>
                  <span style={{ color: "var(--burgundy-hover)" }}>{spotRatio}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={spotRatio} 
                  onChange={e => setSpotRatio(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--burgundy-primary)" }}
                />
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Percentage of stateless training jobs run on Spot / Preemptible instances.</p>
              </div>

              {/* Slider 2: Node Headroom */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: "var(--sage-light)" }}>Node Buffer Headroom</span>
                  <span style={{ color: "var(--burgundy-hover)" }}>{headroom}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={headroom} 
                  onChange={e => setHeadroom(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--burgundy-primary)" }}
                />
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Target CPU/Memory buffer headroom reserved for burst workloads.</p>
              </div>

              {/* Slider 3: Scaling scale factor */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: "var(--sage-light)" }}>Instance Scaling Factor</span>
                  <span style={{ color: "var(--burgundy-hover)" }}>{rightsizeMultiplier.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.05"
                  value={rightsizeMultiplier} 
                  onChange={e => setRightsizeMultiplier(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--burgundy-primary)" }}
                />
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Multiplier applied to overall cluster size limits.</p>
              </div>

              <div className="divider" />

              {/* Actions */}
              <div style={{ display: "flex", gap: 12 }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, background: "var(--burgundy-primary)", color: "var(--cream-primary)" }}
                  onClick={() => {
                    setSpotRatio(30);
                    setHeadroom(15);
                    setRightsizeMultiplier(1.0);
                  }}
                >
                  <RotateCcw size={14} /> Reset Sandbox
                </button>
              </div>
            </div>

            {/* Results visualizer panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Savings metrics blocks */}
              <div className="metric-grid-2">
                <div className="premium-card" style={{ padding: 24, background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Simulated Monthly Run Rate</span>
                  <div className="stat-value" style={{ color: simulatedCost < baselineCost ? "var(--green-bright)" : "var(--cream-primary)", marginTop: 6, fontSize: 24, fontWeight: 800 }}>
                    ${simulatedCost.toLocaleString()}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--sage-light)", marginTop: 8 }}>Live API Baseline: ${baselineCost.toLocaleString()}/mo</p>
                </div>

                <div className="premium-card" style={{ padding: 24, background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Simulated Monthly Savings</span>
                  <div className="stat-value text-green" style={{ marginTop: 6, fontSize: 24, fontWeight: 800, color: "var(--green-bright)" }}>
                    +${totalSavings.toLocaleString()}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--sage-light)", marginTop: 8 }}>Savings Ratio: {Math.round((totalSavings / baselineCost) * 100)}%</p>
                </div>
              </div>

              {/* Visual simulated chart preview */}
              <div className="premium-card" style={{ padding: 28, flex: 1, background: "rgba(34, 26, 34, 0.7)", border: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--cream-primary)", marginBottom: 16 }}>Projected Cost Comparison</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "20px 0" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                      <span style={{ color: "var(--sage-light)" }}>Live Baseline Spend Pattern</span>
                      <span style={{ color: "var(--cream-primary)" }}>${baselineCost.toLocaleString()} / mo</span>
                    </div>
                    <div className="progress" style={{ height: 16, background: "rgba(255,255,255,0.06)" }}>
                      <div className="progress-fill" style={{ width: "100%", background: "var(--burgundy-primary)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                      <span style={{ color: "var(--sage-light)" }}>Simulated Optimized Spend Pattern</span>
                      <span style={{ color: "var(--green-bright)" }}>${simulatedCost.toLocaleString()} / mo</span>
                    </div>
                    <div className="progress" style={{ height: 16, background: "rgba(255,255,255,0.06)" }}>
                      <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((simulatedCost / baselineCost) * 100))}%`, background: "var(--green-bright)" }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(18, 13, 18, 0.6)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", marginTop: 16 }}>
                  <AlertTriangle size={16} color="var(--amber-bright)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 11, color: "var(--sage-light)", lineHeight: 1.4 }}>
                    Simulation parameters calculate potential shifts against live backend baseline metrics. Click <strong>Apply Actions</strong> inside the Optimization Center to commit updates to your live clusters.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
