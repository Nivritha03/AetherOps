"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Play, RotateCcw, AlertTriangle, TrendingDown, Server, Cpu } from "lucide-react";

export default function SimulationPage() {
  const [spotRatio, setSpotRatio] = useState(30);
  const [headroom, setHeadroom] = useState(15);
  const [rightsizeMultiplier, setRightsizeMultiplier] = useState(1.0);
  
  // Simulated formulas
  const baselineCost = 93600;
  const spotSavings = baselineCost * (spotRatio / 100) * 0.6; // Spot is 60% cheaper
  const rightsizingSavings = baselineCost * ((100 - headroom) / 100) * (1 - rightsizeMultiplier) * 0.3;
  const totalSavings = Math.round(spotSavings + Math.max(0, rightsizingSavings));
  const simulatedCost = Math.max(20000, baselineCost - totalSavings);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Simulation Center" subtitle="Test Rightsizing & Cloud pricing shifts in a safe What-If sandbox" />
        
        <div className="page-content fade-up" style={{ padding: "32px 40px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32 }}>
            
            {/* Simulation controls panel */}
            <div className="premium-card" style={{ padding: 28, background: "var(--bg-secondary)", display: "flex", flexDirection: "column", gap: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Simulation Parameters</h3>
              
              {/* Slider 1: Spot ratio */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Target Spot Ratio</span>
                  <span style={{ color: "var(--blue-primary)" }}>{spotRatio}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={spotRatio} 
                  onChange={e => setSpotRatio(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--blue-primary)" }}
                />
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Percentage of stateless training jobs run on Spot / Preemptible instances.</p>
              </div>

              {/* Slider 2: Node Headroom */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Node Buffer Headroom</span>
                  <span style={{ color: "var(--blue-primary)" }}>{headroom}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={headroom} 
                  onChange={e => setHeadroom(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--blue-primary)" }}
                />
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Target CPU/Memory buffer headroom reserved for burst workloads.</p>
              </div>

              {/* Slider 3: Scaling scale factor */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Instance Scaling Factor</span>
                  <span style={{ color: "var(--blue-primary)" }}>{rightsizeMultiplier.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.05"
                  value={rightsizeMultiplier} 
                  onChange={e => setRightsizeMultiplier(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--blue-primary)" }}
                />
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Multiplier applied to overall cluster size limits.</p>
              </div>

              <div className="divider" />

              {/* Actions */}
              <div style={{ display: "flex", gap: 12 }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
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
                <div className="premium-card" style={{ padding: 24, background: "var(--bg-secondary)" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Simulated Monthly Run Rate</span>
                  <div className="stat-value" style={{ color: simulatedCost < baselineCost ? "var(--green-bright)" : "var(--text-primary)" }}>
                    ${simulatedCost.toLocaleString()}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Baseline: ${baselineCost.toLocaleString()}/mo</p>
                </div>

                <div className="premium-card" style={{ padding: 24, background: "var(--bg-secondary)" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Simulated Monthly Savings</span>
                  <div className="stat-value text-green">
                    +${totalSavings.toLocaleString()}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Savings Ratio: {Math.round((totalSavings / baselineCost) * 100)}%</p>
                </div>
              </div>

              {/* Visual simulated chart preview */}
              <div className="premium-card" style={{ padding: 28, flex: 1, background: "var(--bg-secondary)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Projected Cost Comparison</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "20px 0" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                      <span style={{ color: "var(--text-secondary)" }}>Baseline Spend Pattern</span>
                      <span style={{ color: "var(--text-primary)" }}>$93,600 / mo</span>
                    </div>
                    <div className="progress" style={{ height: 16, background: "var(--bg-primary)" }}>
                      <div className="progress-fill" style={{ width: "100%", background: "var(--red-bright)" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                      <span style={{ color: "var(--text-secondary)" }}>Simulated Optimized Spend Pattern</span>
                      <span style={{ color: "var(--green-bright)" }}>${simulatedCost.toLocaleString()} / mo</span>
                    </div>
                    <div className="progress" style={{ height: 16, background: "var(--bg-primary)" }}>
                      <div className="progress-fill" style={{ width: `${(simulatedCost / baselineCost) * 100}%`, background: "var(--green-bright)" }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", background: "var(--bg-primary)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", marginTop: 16 }}>
                  <AlertTriangle size={16} color="var(--amber-bright)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    Simulation parameters do not override active deployment policies. Click **Apply Actions** inside the Optimization Center to commit updates to your live clusters.
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
