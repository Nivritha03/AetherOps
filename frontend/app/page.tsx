"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap, Server, Cpu, Database, Cloud, ShieldAlert,
  ArrowRight, CheckCircle2, ChevronRight, HelpCircle,
  Play, MessageSquare, Code, Users, BarChart3, HelpCircle as HelpIcon
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const techs = ["Kubernetes", "Prometheus", "Go Lang", "Next.js", "AWS", "Azure", "GCP", "NVIDIA", "Docker"];
  const problems = [
    { title: "Idle GPUs", desc: "SaaS companies waste up to 40% of their GPU allocation on unscheduled or idle notebook environments." },
    { title: "Overprovisioned Nodes", desc: "SREs allocate H100s for light models, driving cluster costs up without performance benefits." },
    { title: "Unused Clusters", desc: "Dev and testing clusters remain active over weekends, accumulating thousands in billing overhead." },
    { title: "Poor Scheduling", desc: "Inefficient pod scheduling results in fragmented resources across too many virtual machines." },
    { title: "High Cloud Bills", desc: "AI teams have no visibility into model-level and namespace-level cloud spend allocation." }
  ];

  const pipeline = [
    { label: "Infrastructure", desc: "Bare metal or VM GPU servers" },
    { label: "Metrics", desc: "Prometheus collector telemetry" },
    { label: "Cost Engine", desc: "Raw pricing mapping & calculation" },
    { label: "AI Analysis", desc: "Neural efficiency check logic" },
    { label: "Simulation", desc: "Interactive Sandbox what-if predictions" },
    { label: "Optimization", desc: "Automated rightsizing actions" }
  ];

  const features = [
    { title: "GPU Cost Analysis", desc: "Deep namespace, workload, and model level price mapping." },
    { title: "Optimization Engine", desc: "AI-driven actions to rightsize underutilized AI nodes." },
    { title: "What-If Simulator", desc: "Test cloud migrations, node scheduling shift impacts beforehand." },
    { title: "Cost Timeline", desc: "Historical tracking of actual run-rates against optimized baselines." },
    { title: "Cluster Health", desc: "Continuous node state checks, storage, memory, and packet logs." },
    { title: "Explainable AI", desc: "Clear text reasoning on why recommended actions are safe to apply." },
    { title: "Historical Trends", desc: "Comprehensive cost explorer with customizable groupings." },
    { title: "Recommendation Engine", desc: "Instant rightsizing, spot migrations, and scheduler adjustments." },
    { title: "Multi-Cloud Fleet", desc: "Unified dashboard grouping AWS ECS, GCP GKE, and Azure AKS." }
  ];

  const stats = [
    { val: "$12.4M", desc: "Total spend analyzed" },
    { val: "650", desc: "Active clusters monitored" },
    { val: "52K", desc: "GPU chips tracking live" },
    { val: "$2.8M", desc: "Annualized savings identified" }
  ];

  const faqs = [
    { q: "How does AetherOps calculate GPU waste?", a: "We hook directly into Prometheus to track actual SM (Streaming Multiprocessor) utilization, memory bandwidth, and power draw to flag GPUs that are allocated but idle." },
    { q: "Does AetherOps require write access to my cluster?", a: "No. Our basic monitoring and recommendation features only require read-only access. Write permission is only required if you choose to enable auto-apply actions." },
    { q: "Which GPU models are supported?", a: "We support all NVIDIA architectures from legacy T4s and V100s up to modern A100s and H100/H200 fleets across AWS, GCP, and Azure." }
  ];

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      
      {/* Landing Navbar */}
      <header className="landing-navbar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>AetherOps</span>
        </div>
        <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#features" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>Features</a>
          <a href="#pricing" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>Pricing</a>
          <a href="#faq" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>FAQ</a>
          <Link href="/dashboard">
            <button className="btn btn-secondary btn-sm">Live Demo</button>
          </Link>
          <Link href="/dashboard">
            <button className="btn btn-primary btn-sm">Start Free</button>
          </Link>
        </nav>
      </header>

      {/* 1. Hero Section */}
      <section className="landing-section" style={{ paddingTop: 140, paddingBottom: 100 }}>
        <div className="landing-grid-bg" />
        <div className="landing-container" style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <span style={{ background: "var(--blue-dim)", color: "var(--blue-primary)", border: "1px solid var(--blue-border)", padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Autonomous Multi-Cloud GPU Cost Optimization
          </span>
          <h1 className="landing-title" style={{ fontSize: 64, marginTop: 24, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
            Stop Wasting Money on AI Infrastructure.
          </h1>
          <p className="landing-subtitle" style={{ marginLeft: "auto", marginRight: "auto", fontSize: 16 }}>
            AetherOps continuously analyzes Kubernetes GPU infrastructure, detects waste, explains recommendations, and predicts savings before changes are applied.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40 }}>
            <Link href="/dashboard">
              <button className="btn btn-primary" style={{ padding: "12px 28px", fontSize: 14 }}>
                Start Free Trial <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: 14 }}>
                Live Sandbox Demo
              </button>
            </Link>
          </div>

          {/* Floating dashboard preview */}
          <div className="premium-card" style={{ marginTop: 80, padding: 8, background: "var(--bg-secondary)", borderRadius: 16 }}>
            <div style={{ background: "var(--bg-primary)", height: 450, borderRadius: 12, border: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 16 }}>
              <div className="dot dot-pulse" style={{ width: 10, height: 10, background: "var(--blue-primary)" }} />
              <p style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>Live interactive preview compiled successfully. Click "Live Sandbox Demo" above to explore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trusted Technologies */}
      <section className="landing-section" style={{ padding: "60px 48px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
        <div className="landing-container">
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24, fontWeight: 600 }}>
            INTEGRATES DEEP WITH NATIVE KUBERNETES & CLOUD FACTION
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {techs.map(t => (
              <div key={t} className="tech-badge">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue-primary)" }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Problem Section */}
      <section className="landing-section" id="problem">
        <div className="landing-container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="landing-title">Why AI Clusters Are So Expensive</h2>
            <p className="landing-subtitle" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Standard cloud native monitoring platforms fail to inspect physical GPU chip utilization metrics, leading to hidden billing black holes.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {problems.map((p, idx) => (
              <div key={idx} className="premium-card" style={{ padding: 28, background: "var(--bg-secondary)" }}>
                <div style={{ color: "var(--red-bright)", marginBottom: 16 }}><ShieldAlert size={24} /></div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>{p.title}</h4>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Solution Section */}
      <section className="landing-section" style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="landing-container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="landing-title">Autonomous Optimization Pipeline</h2>
            <p className="landing-subtitle" style={{ marginLeft: "auto", marginRight: "auto" }}>
              How AetherOps connects raw hardware performance to cloud financial engineering actions.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, position: "relative" }}>
            {pipeline.map((p, idx) => (
              <div key={idx} className="pipeline-node">
                <div style={{ width: 28, height: 28, borderRadius: 14, background: "var(--blue-dim)", color: "var(--blue-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontWeight: 700, fontSize: 13 }}>
                  {idx + 1}
                </div>
                <h5 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{p.label}</h5>
                <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features Grid */}
      <section className="landing-section" id="features">
        <div className="landing-container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="landing-title">Designed for Production Scale</h2>
            <p className="landing-subtitle" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Every component is custom-crafted to satisfy strict platform engineering security and data rules.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {features.map((f, idx) => (
              <div key={idx} className="premium-card" style={{ padding: 24, background: "var(--bg-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--blue-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--blue-primary)" }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{f.title}</h4>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Live Metrics Section */}
      <section className="landing-section" style={{ background: "rgba(59, 130, 246, 0.02)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="landing-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
            {stats.map((s, idx) => (
              <div key={idx}>
                <p style={{ fontSize: 48, fontWeight: 800, color: "var(--blue-primary)", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em" }}>{s.val}</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Architecture Diagram */}
      <section className="landing-section">
        <div className="landing-container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="landing-title">High-Fidelity Platform Architecture</h2>
            <p className="landing-subtitle" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Secure read-only cluster metrics synchronization using standards-compliant client agents.
            </p>
          </div>

          <div className="premium-card" style={{ padding: 40, background: "var(--bg-secondary)", display: "flex", justifyContent: "center" }}>
            <svg width="600" height="150" viewBox="0 0 600 150">
              <rect x="20" y="50" width="120" height="50" rx="6" fill="var(--bg-primary)" stroke="var(--border)" />
              <text x="80" y="80" fill="var(--text-primary)" fontSize="11" textAnchor="middle" fontWeight="600">Prometheus Agent</text>

              <line x1="140" y1="75" x2="260" y2="75" stroke="var(--blue-primary)" strokeWidth="2" strokeDasharray="5 5" className="arch-svg-line" />

              <rect x="260" y="30" width="120" height="90" rx="6" fill="var(--bg-primary)" stroke="var(--blue-primary)" />
              <text x="320" y="70" fill="var(--text-primary)" fontSize="12" textAnchor="middle" fontWeight="700">AetherOps Cloud</text>
              <text x="320" y="90" fill="var(--text-muted)" fontSize="9" textAnchor="middle">AI Recommendation</text>

              <line x1="380" y1="75" x2="500" y2="75" stroke="var(--blue-primary)" strokeWidth="2" strokeDasharray="5 5" className="arch-svg-line" />

              <rect x="500" y="50" width="80" height="50" rx="6" fill="var(--bg-primary)" stroke="var(--border)" />
              <text x="540" y="80" fill="var(--text-primary)" fontSize="11" textAnchor="middle" fontWeight="600">Console UI</text>
            </svg>
          </div>
        </div>
      </section>

      {/* 8. Pricing Grid */}
      <section className="landing-section" id="pricing" style={{ borderTop: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
        <div className="landing-container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="landing-title">Predictable Pricing for High-Scale Teams</h2>
            <p className="landing-subtitle" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Pay only for active GPU tracking vectors. No hidden server management license costs.
            </p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Community Tier</span>
                <p style={{ fontSize: 32, fontWeight: 800, marginTop: 12, color: "var(--text-primary)" }}>$0 <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>/ mo</span></p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 12 }}>Perfect for staging, local testing, and small developer nodes.</p>
                <div className="divider" style={{ margin: "24px 0" }} />
                <ul style={{ listStyle: "none", fontSize: 12, display: "flex", flexDirection: "column", gap: 10, color: "var(--text-secondary)" }}>
                  <li>✓ Up to 8 GPU nodes tracking</li>
                  <li>✓ Daily recommendations</li>
                  <li>✓ Standard dashboard explorer</li>
                </ul>
              </div>
              <Link href="/dashboard">
                <button className="btn btn-secondary" style={{ width: "100%", marginTop: 24 }}>Get Started</button>
              </Link>
            </div>

            <div className="pricing-card popular">
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--blue-primary)" }}>Professional Package</span>
                <p style={{ fontSize: 32, fontWeight: 800, marginTop: 12, color: "var(--text-primary)" }}>$49 <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>/ GPU / mo</span></p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 12 }}>For standard scale clusters running continuous training jobs.</p>
                <div className="divider" style={{ margin: "24px 0" }} />
                <ul style={{ listStyle: "none", fontSize: 12, display: "flex", flexDirection: "column", gap: 10, color: "var(--text-secondary)" }}>
                  <li>✓ Unlimited cluster integrations</li>
                  <li>✓ Real-time what-if Sandbox simulation</li>
                  <li>✓ Slack & PagerDuty notification integrations</li>
                </ul>
              </div>
              <Link href="/dashboard">
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 24 }}>Start 14-Day Trial</button>
              </Link>
            </div>

            <div className="pricing-card">
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Enterprise System</span>
                <p style={{ fontSize: 32, fontWeight: 800, marginTop: 12, color: "var(--text-primary)" }}>Custom</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 12 }}>Custom parameters for private cloud VPC installations.</p>
                <div className="divider" style={{ margin: "24px 0" }} />
                <ul style={{ listStyle: "none", fontSize: 12, display: "flex", flexDirection: "column", gap: 10, color: "var(--text-secondary)" }}>
                  <li>✓ Self-hosted Kubernetes agent</li>
                  <li>✓ SAML / Okta SSO integration</li>
                  <li>✓ Custom Dedicated SLA agreements</li>
                </ul>
              </div>
              <Link href="/dashboard">
                <button className="btn btn-secondary" style={{ width: "100%", marginTop: 24 }}>Contact Architect</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="landing-section" id="faq">
        <div className="landing-container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 className="landing-title">Frequently Asked Questions</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="premium-card" style={{ padding: "16px 24px", background: "var(--bg-secondary)" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  onClick={() => toggleFaq(idx)}
                >
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <HelpIcon size={16} color="var(--blue-primary)" />
                    {faq.q}
                  </h4>
                  <ChevronRight size={16} style={{ transform: activeFaq === idx ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </div>
                {activeFaq === idx && (
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 12, paddingLeft: 26, lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA Banner */}
      <section className="landing-section" style={{ padding: "100px 48px", background: "linear-gradient(180deg, var(--bg-primary) 0%, rgba(59, 130, 246, 0.05) 100%)", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <div className="landing-container">
          <h2 className="landing-title" style={{ fontSize: 40 }}>Start Saving on Infrastructure Today</h2>
          <p className="landing-subtitle" style={{ marginLeft: "auto", marginRight: "auto", marginBottom: 40 }}>
            Sync your first cluster in less than 5 minutes. Clean dashboard output, guaranteed results.
          </p>
          <Link href="/dashboard">
            <button className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>
              Register Your First Cluster <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* Public Footer */}
      <footer style={{ padding: "40px 48px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
        <span>© 2026 AetherOps Inc. All rights reserved.</span>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Security Policy</a>
          <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>API Docs</a>
          <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy</a>
        </div>
      </footer>

    </div>
  );
}
