"use client";

import { useState } from "react";
import { Boxes, ShieldAlert, Play, CheckCircle2, FileCode, Layers, Server, Cloud } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function InfrastructurePage() {
  const [activeTab, setActiveTab] = useState<"vpc" | "eks" | "iam">("eks");
  const [planState, setPlanState] = useState<"idle" | "planning" | "planned" | "applied">("planned");

  const terraformSnippet = `module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 20.0"
  cluster_name    = "aetherops-prod-cluster"
  cluster_version = "1.30"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    gpu_workers = {
      instance_types = ["g5.2xlarge"]
      min_size       = 2
      max_size       = 8
      desired_size   = 3
    }
  }
}`;

  return (
    <div className="app-shell" style={{ background: "#080B14", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TopBar />

        <main style={{ padding: "26px 32px 40px" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Infrastructure as Code (Terraform)
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Provision AWS VPC, subnets, EKS clusters, node groups, and IAM security boundaries declaratively.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setPlanState("planning");
                  setTimeout(() => setPlanState("planned"), 1000);
                }}
              >
                Terraform Plan
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (confirm("Apply Terraform changes to AWS EKS production infrastructure?")) {
                    setPlanState("applied");
                  }
                }}
              >
                Terraform Apply
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
            
            {/* IaC Resource Summary */}
            <div className="card" style={{ padding: "22px", background: "rgba(16, 22, 36, 0.7)" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Managed Cloud Resources
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { name: "AWS VPC & Subnets", status: "Synced", details: "10.0.0.0/16 · 3 Public / 3 Private" },
                  { name: "EKS Control Plane", status: "Active", details: "Kubernetes v1.30 · Multi-AZ HA" },
                  { name: "Node Group: gpu_workers", status: "Active", details: "3x g5.2xlarge · Autoscaling enabled" },
                  { name: "NAT Gateways", status: "Active", details: "2 redundant gateways across AZs" },
                  { name: "ECR Container Registry", status: "Ready", details: "12 repositories configured" }
                ].map(r => (
                  <div key={r.name} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", background: "rgba(255,255,255,0.02)",
                    borderRadius: 8, border: "1px solid var(--border)"
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.details}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terraform Code Preview */}
            <div className="card" style={{ padding: "22px", background: "rgba(16, 22, 36, 0.7)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                  <FileCode size={14} color="#3B82F6" /> main.tf (EKS Module)
                </span>
                <span style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>
                  Remote State Locked (S3+DynamoDB)
                </span>
              </div>

              <pre style={{
                flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "16px", fontSize: 11, color: "#A855F7",
                overflowX: "auto", fontFamily: "monospace", lineHeight: 1.5
              }}>
                {terraformSnippet}
              </pre>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
