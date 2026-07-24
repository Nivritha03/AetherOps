"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Shield, Key, CreditCard, Users, Settings as ConfigIcon, Server } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  const tabs = [
    { id: "organization", label: "Organization", icon: Shield },
    { id: "clusters", label: "Clusters", icon: Server },
    { id: "keys", label: "API Keys", icon: Key },
    { id: "users", label: "Users & Access", icon: Users },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="System Settings" subtitle="Configure organization rules and API integrations" />
        
        <div className="page-content fade-up" style={{ padding: "32px 40px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 }}>
            
            {/* Settings Navigation Tabs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="btn"
                    style={{
                      justifyContent: "flex-start",
                      background: isSelected ? "var(--bg-secondary)" : "transparent",
                      color: isSelected ? "var(--blue-primary)" : "var(--text-secondary)",
                      border: isSelected ? "1px solid var(--border)" : "1px solid transparent",
                      padding: "10px 16px"
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Settings Tab Content */}
            <div className="premium-card" style={{ padding: 32, background: "var(--bg-secondary)" }}>
              
              {activeTab === "organization" && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Organization Profiles</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Set up public identifiers and billing entities.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 450 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Organization Name</label>
                      <input className="premium-input" defaultValue="AetherOps LLC" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Primary Cloud Tenant ID</label>
                      <input className="premium-input" defaultValue="tenant-aws-us-east-1a" />
                    </div>
                    <button className="btn btn-primary" style={{ width: "fit-content", marginTop: 8 }}>Save Changes</button>
                  </div>
                </div>
              )}

              {activeTab === "clusters" && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Cluster Integrations</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Sync metrics from Prometheus exporters safely.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ padding: 16, background: "var(--bg-primary)", borderRadius: 8, border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>aws-us-east-1-prod</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Connected · Endpoint: http://prometheus.prod.local:9090</p>
                      </div>
                      <button className="btn btn-secondary btn-sm">Disconnect</button>
                    </div>

                    <div style={{ padding: 16, background: "var(--bg-primary)", borderRadius: 8, border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>gcp-us-west1-staging</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Connected · Endpoint: http://prometheus.staging.local:9090</p>
                      </div>
                      <button className="btn btn-secondary btn-sm">Disconnect</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "keys" && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Infrastructure API Keys</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Integrate recommendations engines into CI/CD pipelines.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <input 
                        type={apiKeyVisible ? "text" : "password"} 
                        className="premium-input" 
                        style={{ flex: 1, fontFamily: "monospace" }} 
                        value="ae_live_8f0e5270923cb18df326a2569201f" 
                        readOnly
                      />
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setApiKeyVisible(!apiKeyVisible)}
                      >
                        {apiKeyVisible ? "Hide Key" : "Reveal Key"}
                      </button>
                    </div>
                    <button className="btn btn-primary" style={{ width: "fit-content" }}>Re-Roll Production Token</button>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Users & Team Management</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Manage cloud architect permissions and workspace access.</p>
                  
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>CT (Cloud Architect)</strong><br /><span style={{ fontSize: 10, color: "var(--text-muted)" }}>ct@aetherops.io</span></td>
                        <td>Administrator</td>
                        <td><span className="badge badge-green">ACTIVE</span></td>
                        <td><button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px" }}>Edit</button></td>
                      </tr>
                      <tr>
                        <td><strong>SRE Team</strong><br /><span style={{ fontSize: 10, color: "var(--text-muted)" }}>sre@aetherops.io</span></td>
                        <td>Member</td>
                        <td><span className="badge badge-green">ACTIVE</span></td>
                        <td><button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px" }}>Edit</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "billing" && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Billing details & Invoices</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Current subscription plan: **Professional Package (Annual)**</p>
                  
                  <div style={{ background: "var(--bg-primary)", padding: 20, borderRadius: 8, border: "1px solid var(--border)", marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Next invoice date</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Jan 15, 2027</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Estimated amount</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green-bright)" }}>$2,450.00</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
