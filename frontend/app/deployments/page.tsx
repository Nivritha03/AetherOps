"use client";

import { useState } from "react";
import { Send, CheckCircle2, Play, AlertCircle, Copy, Terminal, Shield } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function DeploymentsPage() {
  const [appName, setAppName] = useState("api-service");
  const [image, setImage] = useState("nginx:alpine");
  const [replicas, setReplicas] = useState(2);
  const [namespace, setNamespace] = useState("production");
  const [cpuReq, setCpuReq] = useState("100m");
  const [memReq, setMemReq] = useState("128Mi");
  const [port, setPort] = useState("80");
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<string | null>(null);

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setDeploying(true);
    setDeployResult(null);

    setTimeout(() => {
      setDeploying(false);
      setDeployResult(`✓ Deployment "${appName}" successfully rolled out in namespace "${namespace}". 
Replicas: ${replicas}/${replicas} Running. Service exposed on port ${port}.
Ingress routing: https://${appName}.aetherops.internal`);
    }, 1200);
  };

  const yamlPreview = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  namespace: ${namespace}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${image}
        ports:
        - containerPort: ${port}
        resources:
          requests:
            cpu: "${cpuReq}"
            memory: "${memReq}"
          limits:
            cpu: "500m"
            memory: "512Mi"`;

  return (
    <div className="app-shell" style={{ background: "#080B14", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TopBar />

        <main style={{ padding: "26px 32px 40px" }}>
          
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Application Deployment Center
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              Directly deploy containerized applications onto Kubernetes with automated manifest generation.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20 }}>
            
            {/* Deployment Config Form */}
            <div className="card" style={{ padding: "24px", background: "rgba(16, 22, 36, 0.7)" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Send size={15} color="#3B82F6" /> Deployment Parameters
              </h2>

              <form onSubmit={handleDeploy} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Application Name</label>
                    <input
                      type="text"
                      value={appName}
                      onChange={e => setAppName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Namespace</label>
                    <input
                      type="text"
                      value={namespace}
                      onChange={e => setNamespace(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Docker Image</label>
                  <input
                    type="text"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Port</label>
                    <input
                      type="text"
                      value={port}
                      onChange={e => setPort(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Replicas</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={replicas}
                      onChange={e => setReplicas(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>CPU Request</label>
                    <input
                      type="text"
                      value={cpuReq}
                      onChange={e => setCpuReq(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={deploying}>
                    <Play size={13} /> {deploying ? "Applying to Cluster..." : "Deploy to Kubernetes"}
                  </button>
                </div>
              </form>

              {deployResult && (
                <div style={{
                  marginTop: 18, padding: "14px 16px", background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: 8, fontSize: 12, color: "#10B981",
                  whiteSpace: "pre-line", lineHeight: 1.6
                }}>
                  {deployResult}
                </div>
              )}
            </div>

            {/* Generated Kubernetes Manifest */}
            <div className="card" style={{ padding: "24px", background: "rgba(16, 22, 36, 0.7)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={14} color="#3B82F6" /> Generated Kubernetes Manifest
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigator.clipboard.writeText(yamlPreview)}
                  style={{ fontSize: 11 }}
                >
                  <Copy size={11} /> Copy YAML
                </button>
              </div>

              <pre style={{
                flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "16px", fontSize: 11, color: "#38BDF8",
                overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5
              }}>
                {yamlPreview}
              </pre>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
