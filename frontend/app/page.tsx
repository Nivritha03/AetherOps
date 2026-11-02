"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, Shield, Terminal, Cpu, Server, Activity,
  GitBranch, Boxes, Scale, CheckCircle2, ChevronRight, Zap,
  Play, Sparkles, Layers, RefreshCw, Command, Globe, Check,
  Sliders, MessageSquare, AlertCircle, FileCode, Search, Bell,
  Lock, ArrowUpRight, BarChart3, Cloud, Compass, Code,
  Eye, RefreshCcw, Network, HardDrive, Database, Gauge,
  Cpu as GpuIcon, Flame, ShieldAlert, Workflow, ChevronDown
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"cluster" | "apps" | "logs">("apps");
  const [liveWorkloadIndex, setLiveWorkloadIndex] = useState(0);
  const [cpuPulse, setCpuPulse] = useState(48);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Dynamic simulation on hero workload
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuPulse(prev => {
        const next = prev + (Math.random() * 8 - 4);
        return Math.min(86, Math.max(38, Math.round(next)));
      });
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const liveWorkloads = [
    { id: "OPS-135", title: "Scale user-service to 4 replicas", tag: "HPA triggered", time: "2m", status: "Active", kind: "HPA" },
    { id: "OPS-132", title: "LLM Chatbot vLLM inference engine", tag: "GPU saturated 84%", time: "8m", status: "Optimizing", kind: "GPU" },
    { id: "OPS-129", title: "Drain worker-3 idle g4dn.xlarge node", tag: "$245/mo saved", time: "24m", status: "Completed", kind: "FinOps" },
    { id: "OPS-124", title: "Cert-manager TLS wildcard auto-renewal", tag: "0 downtime", time: "1h", status: "Verified", kind: "Security" },
  ];

  return (
    <div className="linear-grid-bg" style={{ background: "var(--bg-primary)", color: "var(--cream-primary)", minHeight: "100vh", fontFamily: "Inter, sans-serif", overflowX: "hidden" }}>

      {/* ── 2. Header Navigation matching the Linear reference image ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px",
        background: "rgba(18, 13, 18, 0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)"
      }}>
        {/* Brand */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: "linear-gradient(135deg, #8B1D41 0%, #D9A066 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(139,29,65,0.4)"
          }}>
            <span style={{ fontWeight: 900, color: "#F5F0E6", fontSize: 14, fontFamily: "Outfit, sans-serif" }}>▲</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--cream-primary)" }}>
            AetherOps
          </span>
        </Link>

        {/* Center Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 13, color: "var(--sage-light)" }}>
          <a href="#features" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>Platform</a>
          <a href="#method" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>Architecture</a>
          <a href="#pricing" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>Pricing</a>
          <a href="#faq" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>FAQ</a>
          <Link href="/reports" style={{ color: "inherit", textDecoration: "none" }}>Reports</Link>
        </div>

        {/* Right CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/auth/signin"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(245, 240, 230, 0.05)",
              border: "1px solid var(--border)",
              borderRadius: 999, padding: "6px 14px",
              fontSize: 12, fontWeight: 500, color: "var(--sage-light)", textDecoration: "none"
            }}
          >
            <span>Log in</span>
            <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 4, background: "rgba(245,240,230,0.1)", color: "var(--cream-primary)" }}>L</span>
          </Link>
          <Link
            href="/auth/signup"
            style={{
              background: "var(--cream-primary)", color: "#120D12",
              border: "none", borderRadius: 999, padding: "7px 18px",
              fontSize: 12, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 2px 14px rgba(245,240,230,0.25)",
              transition: "transform 0.15s ease"
            }}
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* ── 3. Hero Section with exact Linear Headline Style & Perspective UI ── */}
      <section style={{ position: "relative", padding: "85px 48px 100px", maxWidth: 1280, margin: "0 auto" }}>
        
        {/* Soft Radial Backlight & Laser Glow (Deep Burgundy & Warm Sage) */}
        <div style={{
          position: "absolute", top: 20, left: "25%", width: 720, height: 460,
          background: "radial-gradient(circle, rgba(139, 29, 65, 0.24) 0%, rgba(142, 163, 150, 0.12) 45%, transparent 75%)",
          filter: "blur(90px)", pointerEvents: "none", zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.2fr 0.9fr", gap: 40, alignItems: "center", marginBottom: 36 }}>
          
          {/* Left Column: Headline & Value Prop */}
          <div>
            {/* Release Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 999,
              background: "rgba(139, 29, 65, 0.15)",
              border: "1px solid rgba(139, 29, 65, 0.35)",
              marginBottom: 24, fontSize: 12, color: "var(--cream-soft)"
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green-bright)" }} className="animate-ping-dot" />
              <span>Autonomous Cloud Infrastructure &amp; Kubernetes Platform</span>
              <ChevronRight size={13} color="var(--sage-light)" />
            </div>

            <h1 style={{
              fontSize: "clamp(42px, 4.8vw, 68px)", fontWeight: 700,
              letterSpacing: "-0.04em", lineHeight: 1.06, color: "var(--cream-primary)",
              marginBottom: 22, fontFamily: "Inter, sans-serif"
            }}>
              AetherOps is a purpose-built tool for<br />
              deploying and scaling infrastructure
            </h1>

            <p style={{
              fontSize: "clamp(15px, 1.6vw, 18px)", color: "var(--sage-light)",
              lineHeight: 1.55, maxWidth: 580, marginBottom: 30, fontWeight: 400
            }}>
              Meet the autonomous system for modern cloud engineering.<br />
              Streamline clusters, deployments, and autonomous recovery across multi-cloud fleets.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Link
                href="/auth/signup"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--burgundy-primary)", color: "var(--cream-primary)",
                  borderRadius: 999, padding: "12px 28px",
                  fontSize: 14, fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 4px 24px rgba(139,29,65,0.45)",
                  border: "1px solid rgba(245,240,230,0.2)",
                  transition: "all 0.15s ease"
                }}
              >
                Start building <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Live Telemetry & Quick Action HUD */}
          <div style={{
            background: "linear-gradient(145deg, rgba(34, 26, 34, 0.9) 0%, rgba(26, 20, 26, 0.95) 100%)",
            border: "1px solid var(--border)",
            borderRadius: 16, padding: "24px",
            boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 29, 65, 0.2)",
            position: "relative", overflow: "hidden"
          }}>
            {/* Top scanning laser shimmer */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--burgundy-primary), var(--sage-light), transparent)" }} />
            
            {/* HUD Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green-bright)" }} className="animate-ping-dot" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cream-primary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Live Cluster HUD</span>
              </div>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(152,184,159,0.2)", color: "var(--green-bright)", fontWeight: 700 }}>LIVE SYNC</span>
            </div>

            {/* Quick 3 Stat Pills */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "rgba(18,13,18,0.7)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Active Pods</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--cream-primary)", marginTop: 2 }}>24 / 24</div>
                <div style={{ fontSize: 9, color: "var(--green-bright)", marginTop: 2 }}>100% Ready</div>
              </div>
              <div style={{ background: "rgba(18,13,18,0.7)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>CPU Surge</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--amber-bright)", marginTop: 2 }}>{cpuPulse}%</div>
                <div style={{ fontSize: 9, color: "var(--amber-bright)", marginTop: 2 }}>HPA Balanced</div>
              </div>
              <div style={{ background: "rgba(18,13,18,0.7)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" }}>Monthly Cut</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--burgundy-hover)", marginTop: 2 }}>-$3.8k</div>
                <div style={{ fontSize: 9, color: "var(--green-bright)", marginTop: 2 }}>FinOps Optimized</div>
              </div>
            </div>

            {/* Mini Activity Feed */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(245,240,230,0.02)", borderRadius: 6, fontSize: 11, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Scale size={13} color="var(--sage-light)" />
                  <span style={{ color: "var(--cream-soft)", fontWeight: 500 }}>HPA: Scale user-service to 4</span>
                </div>
                <span style={{ color: "var(--green-bright)", fontWeight: 600 }}>Ready</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(245,240,230,0.02)", borderRadius: 6, fontSize: 11, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Cpu size={13} color="var(--amber-bright)" />
                  <span style={{ color: "var(--cream-soft)", fontWeight: 500 }}>Drain idle worker-3 GPU</span>
                </div>
                <span style={{ color: "var(--amber-bright)", fontWeight: 600 }}>Saved $245</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(245,240,230,0.02)", borderRadius: 6, fontSize: 11, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Shield size={13} color="var(--green-bright)" />
                  <span style={{ color: "var(--cream-soft)", fontWeight: 500 }}>CrashLoopBackOff Self-Healed</span>
                </div>
                <span style={{ color: "var(--green-bright)", fontWeight: 600 }}>0s downtime</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href="/clusters"
                style={{
                  flex: 1, textAlign: "center", padding: "8px 0",
                  background: "rgba(139, 29, 65, 0.25)", border: "1px solid rgba(139, 29, 65, 0.5)",
                  borderRadius: 6, color: "var(--cream-primary)", fontSize: 11, fontWeight: 700, textDecoration: "none"
                }}
              >
                + Connect EKS Cluster
              </Link>
              <Link
                href="/deployments"
                style={{
                  flex: 1, textAlign: "center", padding: "8px 0",
                  background: "rgba(142, 163, 150, 0.12)", border: "1px solid var(--border)",
                  borderRadius: 6, color: "var(--cream-primary)", fontSize: 11, fontWeight: 600, textDecoration: "none"
                }}
              >
                Deploy Manifest
              </Link>
            </div>
          </div>

        </div>

        {/* ── 3D Isometric Angled App Window with prominent visual depth ── */}
        <div className="perspective-1000" style={{ position: "relative", marginTop: 28 }}>
          
          <div className="linear-isometric-app" style={{
            background: "#0C101C",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 16, overflow: "hidden",
            display: "grid", gridTemplateColumns: "220px 320px 1fr",
            minHeight: 520, color: "#E2E8F0"
          }}>
            
            {/* Column 1: Workspace & Views Panel */}
            <div style={{
              background: "#080B14", borderRight: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14
            }}>
              {/* Window controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444", opacity: 0.8 }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B", opacity: 0.8 }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", opacity: 0.8 }} />
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                <span>▲ AetherOps Workspace</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", fontSize: 12, color: "#fff", fontWeight: 600 }}>
                  <Boxes size={13} color="#38BDF8" /> <span>Deployments</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#38BDF8", fontWeight: 700 }}>24</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, fontSize: 12, color: "#94A3B8" }}>
                  <Server size={13} /> <span>Clusters</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#94A3B8" }}>3</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, fontSize: 12, color: "#94A3B8" }}>
                  <Scale size={13} /> <span>Autoscaling</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#10B981" }}>HPA</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, fontSize: 12, color: "#94A3B8" }}>
                  <Terminal size={13} /> <span>Loki Logs</span>
                  <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, fontSize: 12, color: "#94A3B8" }}>
                  <BarChart3 size={13} /> <span>Prometheus Metrics</span>
                </div>
              </div>

              <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, fontSize: 11, color: "#64748B" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#CBD5E1" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                  <span>prod-cluster · AWS EKS</span>
                </div>
                <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>us-east-1 · v1.28.5</div>
              </div>
            </div>

            {/* Column 2: Items / Inbox Feed (Matching Linear Middle Column) */}
            <div style={{
              background: "#0A0E18", borderRight: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "16px", display: "flex", flexDirection: "column", gap: 8
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1" }}>Active Workloads</span>
                <span style={{ fontSize: 10, color: "#10B981", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981" }} /> Live stream
                </span>
              </div>

              {liveWorkloads.map((item, idx) => {
                const isSelected = idx === liveWorkloadIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => setLiveWorkloadIndex(idx)}
                    style={{
                      padding: "11px 12px", borderRadius: 8,
                      background: isSelected ? "rgba(59, 130, 246, 0.12)" : "rgba(255,255,255,0.02)",
                      border: isSelected ? "1px solid rgba(59, 130, 246, 0.35)" : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "#94A3B8" }}>
                      <span style={{ fontWeight: 700, color: isSelected ? "#38BDF8" : "#94A3B8" }}>{item.id}</span>
                      <span style={{ fontSize: 10 }}>{item.time}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginTop: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontSize: 10, color: isSelected ? "#10B981" : "#64748B" }}>
                        ● {item.tag}
                      </span>
                      <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "rgba(255,255,255,0.06)", color: "#CBD5E1" }}>
                        {item.kind}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 3: Detailed Execution & Manifest Pane */}
            <div style={{ padding: "24px 28px", background: "#0E1424", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#64748B", marginBottom: 14 }}>
                <span>Infrastructure</span>
                <ChevronRight size={10} />
                <span>user-service</span>
                <ChevronRight size={10} />
                <span style={{ color: "#38BDF8" }}>{liveWorkloads[liveWorkloadIndex].id}</span>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 16 }}>
                {liveWorkloads[liveWorkloadIndex].title}
              </h2>

              <div style={{
                background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "16px", fontFamily: "monospace", fontSize: 11,
                lineHeight: 1.6, color: "#94A3B8", marginBottom: 16, position: "relative"
              }}>
                <div style={{ position: "absolute", top: 12, right: 12, fontSize: 10, color: "#10B981", fontWeight: 700 }}>
                  SYNCED
                </div>
                <span style={{ color: "#64748B" }}>{"// Kubernetes HPA scaling event executed successfully"}</span><br />
                <span style={{ color: "#38BDF8" }}>apiVersion:</span> autoscaling/v2<br />
                <span style={{ color: "#38BDF8" }}>kind:</span> HorizontalPodAutoscaler<br />
                <span style={{ color: "#C084FC" }}>spec:</span><br />
                &nbsp;&nbsp;scaleTargetRef: user-service<br />
                &nbsp;&nbsp;minReplicas: 2 | maxReplicas: 10<br />
                &nbsp;&nbsp;currentReplicas: <span style={{ color: "#10B981", fontWeight: 700 }}>4 (Ready)</span><br />
                &nbsp;&nbsp;targetCPUUtilizationPercentage: 75%<br />
                &nbsp;&nbsp;observedCPUUtilizationPercentage: <span style={{ color: "#38BDF8", fontWeight: 700 }}>{cpuPulse}%</span>
              </div>

              {/* Progress and status */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#CBD5E1", marginBottom: 6 }}>
                  <span>Horizontal Pod CPU Threshold ({cpuPulse}% / 75%)</span>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>Optimal</span>
                </div>
                <div style={{ height: 4, width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${(cpuPulse / 75) * 100}%`, background: "linear-gradient(90deg, #38BDF8, #10B981)", borderRadius: 2, transition: "width 0.8s ease" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 5, background: "rgba(16, 185, 129, 0.12)", color: "#10B981", fontWeight: 600 }}>
                  ✓ Zero SLA Latency Breach
                </span>
                <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 5, background: "rgba(59, 130, 246, 0.12)", color: "#38BDF8", fontWeight: 600 }}>
                  Prometheus Verified
                </span>
                <span style={{ fontSize: 11, padding: "5px 12px", borderRadius: 5, background: "rgba(147, 51, 234, 0.12)", color: "#C084FC", fontWeight: 600 }}>
                  Auto-Recovery Armed
                </span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ── 4. Live Statistics Marquee Bar ── */}
      <section style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8, 11, 20, 0.5)",
        padding: "24px 48px"
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: "Outfit, sans-serif" }}>99.99%</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Automated Cluster Uptime</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#10B981", fontFamily: "Outfit, sans-serif" }}>$14,280</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Monthly Idle Cloud Savings</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#38BDF8", fontFamily: "Outfit, sans-serif" }}>&lt; 3.2s</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Average HPA Trigger Latency</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#C084FC", fontFamily: "Outfit, sans-serif" }}>24 / 7</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Continuous Autonomous Recovery</div>
          </div>
        </div>
      </section>

      {/* ── 5. Interactive Live Telemetry Bento Grid ── */}
      <section id="features" style={{ padding: "90px 48px", maxWidth: 1240, margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: 60, maxWidth: 680, margin: "0 auto 50px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Platform Capabilities
          </div>
          <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            Purpose-built for modern cloud engineering
          </h2>
          <p style={{ fontSize: 15, color: "#94A3B8", marginTop: 12, lineHeight: 1.6 }}>
            Consolidate your disjointed monitoring tools, Terraform scripts, and kubectl commands into one high-velocity command center.
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
          
          {/* Bento Card 1: Autonomous Autoscaling */}
          <div className="interactive-card" style={{ padding: "36px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Scale size={22} color="#3B82F6" />
              </div>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "rgba(59,130,246,0.12)", color: "#38BDF8", fontWeight: 600 }}>
                Autonomous Loop
              </span>
            </div>
            
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
              Autonomous Autoscaling &amp; Self-Healing
            </h3>
            <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, maxWidth: 520, marginBottom: 24 }}>
              Intelligent Horizontal Pod Autoscaler (HPA) policies that automatically expand container replicas during load surges and gracefully downscale when demand subsides.
            </p>

            {/* Interactive Graphic: Horizontal Load Progress */}
            <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 10, padding: 18, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#CBD5E1", marginBottom: 8 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                  user-service (4 replicas active)
                </span>
                <span style={{ color: "#10B981", fontWeight: 700 }}>48% CPU Load</span>
              </div>
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "48%", height: "100%", background: "linear-gradient(90deg, #38BDF8, #10B981)", borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748B", marginTop: 8 }}>
                <span>Min: 2 Pods</span>
                <span>Max: 10 Pods</span>
                <span>Scale Velocity: +2 pods/min</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Multi-Cluster Management */}
          <div className="interactive-card" style={{ padding: "36px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(147, 51, 234, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Server size={22} color="#A855F7" />
              </div>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "rgba(16,185,129,0.12)", color: "#10B981", fontWeight: 600 }}>
                3 Clusters Active
              </span>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
              Multi-Cluster Fleets
            </h3>
            <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginBottom: 24 }}>
              Switch seamlessly between AWS EKS and local Kind development clusters with unified node health and latency monitoring.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "prod-cluster", type: "AWS EKS", region: "us-east-1", status: "Healthy", color: "#10B981" },
                { name: "staging-cluster", type: "Kind Local", region: "dev-vm", status: "Healthy", color: "#10B981" },
                { name: "gpu-cluster", type: "AWS EKS (A100)", region: "us-west-2", status: "Optimizing", color: "#F59E0B" }
              ].map(cl => (
                <div key={cl.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "#F8FAFC", fontWeight: 600 }}>{cl.name}</span>
                    <span style={{ fontSize: 10, color: "#64748B", marginLeft: 8 }}>{cl.type} · {cl.region}</span>
                  </div>
                  <span style={{ color: cl.color, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cl.color }} />
                    {cl.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bento Grid Row 2: 3 Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          
          <div className="interactive-card" style={{ padding: "32px 28px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(56, 189, 248, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <GitBranch size={20} color="#38BDF8" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              CI/CD &amp; GitHub Actions
            </h3>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>
              Automate tests, build Docker containers, push images to Amazon ECR, and execute rolling updates with instant rollback on failures.
            </p>
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748B" }}>
              <CheckCircle2 size={13} color="#10B981" /> <span>GitHub Webhook Trigger Support</span>
            </div>
          </div>

          <div className="interactive-card" style={{ padding: "32px 28px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(16, 185, 129, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Terminal size={20} color="#10B981" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              Centralized Loki Logs
            </h3>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>
              Real-time log streaming from cluster containers, pods, and namespaces with regex filtering, zero indexing lag, and full LogQL queries.
            </p>
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748B" }}>
              <CheckCircle2 size={13} color="#10B981" /> <span>WebSocket Live Streaming</span>
            </div>
          </div>

          <div className="interactive-card" style={{ padding: "32px 28px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245, 158, 11, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Zap size={20} color="#F59E0B" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              FinOps &amp; Cost Intelligence
            </h3>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>
              Continuous node rightsizing, idle GPU elimination, and What-If simulation predicting monthly savings before applying production changes.
            </p>
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748B" }}>
              <CheckCircle2 size={13} color="#10B981" /> <span>Automated Spot &amp; On-Demand Mix</span>
            </div>
          </div>

        </div>

      </section>

      {/* ── 6. Interactive Architecture Pipeline Workflow (Method) ── */}
      <section id="method" style={{ padding: "90px 48px", maxWidth: 1240, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            System Architecture
          </div>
          <h2 style={{ fontSize: "clamp(30px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
            The Autonomous Cloud Operating Model
          </h2>
          <p style={{ fontSize: 15, color: "#94A3B8", marginTop: 10, maxWidth: 640, margin: "10px auto 0" }}>
            How AetherOps connects developers, pipelines, and Kubernetes infrastructure into a continuous loop of verification.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {[
            { num: "01", icon: FileCode, title: "Declarative Config", desc: "Define your application parameters or upload standard Kubernetes YAML. AetherOps validates schemas and generates deployment manifests automatically." },
            { num: "02", icon: Workflow, title: "Automated Rollout", desc: "Zero-downtime rolling updates and canary strategies ensure continuous traffic routing with automated health checks prior to traffic cutover." },
            { num: "03", icon: Gauge, title: "Continuous Telemetry", desc: "Prometheus scrapes cluster-wide CPU, memory, and network metrics while Loki streams logs straight into your unified console." },
            { num: "04", icon: RefreshCcw, title: "Self-Healing Recovery", desc: "CrashLoopBackOff pods and unhealthy worker nodes are automatically detected, isolated, and safely recreated without manual intervention." }
          ].map(m => {
            const Icon = m.icon;
            return (
              <div key={m.num} className="interactive-card" style={{ padding: "30px 24px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#38BDF8", fontFamily: "monospace" }}>{m.num}</span>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color="#CBD5E1" />
                  </div>
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{m.title}</h4>
                <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginTop: "auto" }}>{m.desc}</p>
              </div>
            );
          })}
        </div>

      </section>

      {/* ── 7. Interactive Deep-Dive Features Tabs ── */}
      <section id="devops-unification" style={{ padding: "90px 48px", maxWidth: 1240, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              High-Velocity DevOps
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.2vw, 40px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
              One single dashboard replaces 5 disjointed tools
            </h2>
            <p style={{ fontSize: 15, color: "#94A3B8", marginTop: 16, lineHeight: 1.6 }}>
              No more bouncing between AWS Console, Datadog tabs, kubectl terminals, and Grafana dashboards. AetherOps unifies the entire operational lifecycle.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 28 }}>
              {[
                { title: "Unified Kubernetes Management", desc: "Inspect pods, services, nodes, and namespaces without writing raw kubectl commands." },
                { title: "Real-time Metrics & Grafana Loki", desc: "Monitor live CPU/Memory waveforms and stream stdout/stderr logs in real time." },
                { title: "Continuous Cost & FinOps Intelligence", desc: "Stop overpaying for idle GPU compute with automatic rightsizing recommendations." }
              ].map((feat, i) => (
                <div key={i} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Check size={12} color="#10B981" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{feat.title}</h5>
                    <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4, lineHeight: 1.5 }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#F8FAFC", color: "#0A0E1A",
                  borderRadius: 999, padding: "12px 24px",
                  fontSize: 13, fontWeight: 700, textDecoration: "none"
                }}
              >
                Launch dashboard <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature Showcase Preview */}
          <div style={{
            background: "rgba(12, 16, 28, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 16, padding: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 14, marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 6, background: "rgba(59,130,246,0.15)", color: "#38BDF8", fontWeight: 600 }}>
                  Kubernetes View
                </span>
                <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 6, background: "rgba(255,255,255,0.04)", color: "#94A3B8" }}>
                  Live Metrics
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>● ALL SYSTEMS NORMAL</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>CPU Utilization</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginTop: 4 }}>48.2%</div>
                <div style={{ fontSize: 10, color: "#10B981", marginTop: 4 }}>↑ Healthy headroom available</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Memory Footprint</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginTop: 4 }}>12.4 GB</div>
                <div style={{ fontSize: 10, color: "#38BDF8", marginTop: 4 }}>32 GB Cluster Total</div>
              </div>
            </div>

            {/* Micro table */}
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "10px 14px", background: "rgba(255,255,255,0.02)", fontSize: 11, fontWeight: 700, color: "#64748B" }}>
                <span>WORKLOAD</span>
                <span>PODS</span>
                <span>STATUS</span>
              </div>
              {[
                { name: "user-service", pods: "4 / 4", status: "Running" },
                { name: "llm-inference-vllm", pods: "2 / 2", status: "Running" },
                { name: "payment-gateway", pods: "3 / 3", status: "Running" },
                { name: "ingress-traefik", pods: "2 / 2", status: "Running" },
              ].map(r => (
                <div key={r.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "#CBD5E1" }}>
                  <span style={{ fontWeight: 600, color: "#fff" }}>{r.name}</span>
                  <span>{r.pods}</span>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>● {r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ── 8. Transparent Enterprise Pricing ── */}
      <section id="pricing" style={{ padding: "90px 48px", maxWidth: 1240, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Simple, Transparent Pricing
          </div>
          <h2 style={{ fontSize: "clamp(30px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
            Invest in infrastructure automation that pays for itself
          </h2>
          <p style={{ fontSize: 15, color: "#94A3B8", marginTop: 10 }}>
            Start on your local machine with Kind clusters or scale up across multi-region AWS EKS fleets.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          
          {/* Free Tier */}
          <div className="interactive-card" style={{ padding: "36px 32px", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Developer</span>
            <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "14px 0 6px", fontFamily: "Outfit, sans-serif" }}>
              $0 <span style={{ fontSize: 14, color: "#64748B", fontWeight: 400 }}>/ month</span>
            </div>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginBottom: 24 }}>
              Perfect for local development, experimenting with Kind clusters, and basic container rollouts.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, fontSize: 13, color: "#CBD5E1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> 1 Local Kind Cluster</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Up to 5 Applications</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> 24-hour Loki Log retention</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Community Discord Support</div>
            </div>

            <Link
              href="/dashboard"
              style={{
                marginTop: "auto", textAlign: "center",
                background: "rgba(255,255,255,0.06)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, textDecoration: "none"
              }}
            >
              Get started free
            </Link>
          </div>

          {/* Pro Tier (Popular) */}
          <div className="interactive-card" style={{
            padding: "36px 32px", display: "flex", flexDirection: "column",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            background: "linear-gradient(185deg, rgba(16, 22, 38, 0.95) 0%, rgba(59, 130, 246, 0.08) 100%)",
            boxShadow: "0 10px 40px rgba(59, 130, 246, 0.15)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Team &amp; Scale</span>
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: "rgba(59,130,246,0.2)", color: "#38BDF8", fontWeight: 700 }}>MOST POPULAR</span>
            </div>
            
            <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "14px 0 6px", fontFamily: "Outfit, sans-serif" }}>
              $199 <span style={{ fontSize: 14, color: "#64748B", fontWeight: 400 }}>/ month</span>
            </div>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginBottom: 24 }}>
              Autonomous management for production AWS EKS clusters with HPA autoscaling and cost intelligence.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, fontSize: 13, color: "#CBD5E1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Unlimited EKS &amp; Kind Clusters</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Autonomous HPA Autoscaling</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Continuous GPU Cost Optimizer</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> 30-day Loki Log retention</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Automated Rollback on Failures</div>
            </div>

            <Link
              href="/dashboard"
              style={{
                marginTop: "auto", textAlign: "center",
                background: "#F8FAFC", color: "#0A0E1A",
                borderRadius: 8, padding: "12px", fontSize: 13, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 4px 16px rgba(255,255,255,0.2)"
              }}
            >
              Start 14-day trial
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="interactive-card" style={{ padding: "36px 32px", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enterprise</span>
            <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "14px 0 6px", fontFamily: "Outfit, sans-serif" }}>
              Custom
            </div>
            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginBottom: 24 }}>
              Dedicated VPC peering, custom SLO guarantees, air-gapped deployments, and 24/7 dedicated SRE support.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, fontSize: 13, color: "#CBD5E1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Air-Gapped VPC On-Premise Install</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Multi-Cloud (AWS, GCP, Azure)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> SOC 2 Type II &amp; HIPAA Compliant</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> Custom HPA Autoscaling Algorithms</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={14} color="#10B981" /> 15-minute SLA Guaranteed</div>
            </div>

            <Link
              href="/dashboard"
              style={{
                marginTop: "auto", textAlign: "center",
                background: "rgba(255,255,255,0.06)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, textDecoration: "none"
              }}
            >
              Contact Solutions Architect
            </Link>
          </div>

        </div>

      </section>

      {/* ── 9. Frequently Asked Questions (FAQ) ── */}
      <section id="faq" style={{ padding: "90px 48px", maxWidth: 960, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#38BDF8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Questions &amp; Answers
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { q: "How does AetherOps connect to my existing AWS EKS clusters?", a: "AetherOps uses your standard AWS credentials and IAM Roles for Service Accounts (IRSA). You can either connect using an existing kubeconfig file or authenticate via AWS CLI credentials." },
            { q: "Do I need to replace Terraform or Helm?", a: "No. AetherOps complements your existing Infrastructure as Code. You can trigger Terraform runs or deploy Helm charts through AetherOps while letting its autonomous agents handle live autoscaling, node rightsizing, and self-healing." },
            { q: "How does the autonomous self-healing work safely?", a: "When a pod enters CrashLoopBackOff or an unrecoverable error state, AetherOps inspects the container logs, verifies that healthy replicas are maintaining user traffic, and initiates an isolated rolling restart." },
            { q: "Can I run AetherOps completely on localhost for local testing?", a: "Yes! AetherOps includes native support for local Kind (Kubernetes in Docker) clusters. You can develop, test rolling deployments, and view Loki logs on your development laptop without spending cloud dollars." }
          ].map((item, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
                style={{
                  background: "rgba(12, 16, 28, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 12, padding: "20px 24px",
                  cursor: "pointer", transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{item.q}</span>
                  <ChevronDown size={18} color="#94A3B8" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </div>
                {isOpen && (
                  <div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ── 10. High-Contrast Final Call To Action ── */}
      <section style={{
        padding: "110px 48px", textAlign: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        background: "radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.18) 0%, transparent 70%)",
        position: "relative"
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(34px, 4.2vw, 52px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            Built for engineering teams that move fast
          </h2>
          <p style={{ fontSize: 16, color: "#94A3B8", marginTop: 18, lineHeight: 1.6 }}>
            Experience the clarity of a unified Kubernetes management and autonomous cloud operations platform today.
          </p>
          <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 14 }}>
            <Link
              href="/auth/signup"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--cream-primary)", color: "#0A0E1A",
                borderRadius: 999, padding: "14px 34px",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 4px 24px rgba(245,240,230,0.25)"
              }}
            >
              Get started with AetherOps <ArrowRight size={16} />
            </Link>
            <Link
              href="/clusters"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.05)", color: "#CBD5E1",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999, padding: "14px 28px",
                fontSize: 14, fontWeight: 600, textDecoration: "none"
              }}
            >
              <Server size={15} color="#38BDF8" /> Connect Cluster
            </Link>
          </div>
        </div>
      </section>

      {/* ── 11. Comprehensive Enterprise Footer ── */}
      <footer style={{
        padding: "70px 48px 40px", borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        background: "#03050A", fontSize: 13, color: "#94A3B8"
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 54 }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontWeight: 900, color: "#000", fontSize: 12 }}>▲</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>AetherOps</span>
            </div>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, maxWidth: 300, marginBottom: 20 }}>
              The autonomous cloud operations and Kubernetes management platform. Deploy, scale, monitor, and recover applications automatically.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#10B981" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
              <span>All Systems Operational · Status 100%</span>
            </div>
          </div>

          {/* Product Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>Product</span>
            <Link href="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Overview Dashboard</Link>
            <Link href="/clusters" style={{ color: "inherit", textDecoration: "none" }}>Cluster Fleet</Link>
            <Link href="/applications" style={{ color: "inherit", textDecoration: "none" }}>Applications</Link>
            <Link href="/deployments" style={{ color: "inherit", textDecoration: "none" }}>Rollouts &amp; Canaries</Link>
            <Link href="/autoscaling" style={{ color: "inherit", textDecoration: "none" }}>Autonomous HPA</Link>
            <Link href="/simulation" style={{ color: "inherit", textDecoration: "none" }}>Cost Simulator</Link>
          </div>

          {/* Platform Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>Platform</span>
            <Link href="/pipelines" style={{ color: "inherit", textDecoration: "none" }}>CI/CD Pipelines</Link>
            <Link href="/infrastructure" style={{ color: "inherit", textDecoration: "none" }}>Terraform IaC</Link>
            <Link href="/monitoring" style={{ color: "inherit", textDecoration: "none" }}>Prometheus Metrics</Link>
            <Link href="/logs" style={{ color: "inherit", textDecoration: "none" }}>Grafana Loki Logs</Link>
            <Link href="/reports" style={{ color: "inherit", textDecoration: "none" }}>FinOps Reports</Link>
            <Link href="/insights" style={{ color: "inherit", textDecoration: "none" }}>AI Root-Cause</Link>
          </div>

          {/* Resources */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>Resources</span>
            <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Documentation</a>
            <a href="#method" style={{ color: "inherit", textDecoration: "none" }}>Architecture Blueprint</a>
            <Link href="/monitoring" style={{ color: "inherit", textDecoration: "none" }}>Observability &amp; Metrics</Link>
            <Link href="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>REST API Reference</Link>
            <Link href="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Kubernetes CRDs</Link>
          </div>

          {/* Company */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>Company</span>
            <span style={{ color: "#64748B" }}>About AetherOps</span>
            <span style={{ color: "#64748B" }}>Enterprise Security</span>
            <span style={{ color: "#64748B" }}>SOC 2 Compliance</span>
            <span style={{ color: "#64748B" }}>Careers (We&apos;re hiring!)</span>
            <span style={{ color: "#64748B" }}>Contact Engineering</span>
          </div>

        </div>

        {/* Bottom copyright and legal */}
        <div style={{ maxWidth: 1240, margin: "0 auto", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#64748B" }}>
          <div>© 2026 AetherOps, Inc. All rights reserved. Autonomous Cloud Infrastructure &amp; DevOps.</div>
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms of Service</span>
            <span style={{ cursor: "pointer" }}>Security Disclosures</span>
            <span style={{ cursor: "pointer" }}>System Status</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
