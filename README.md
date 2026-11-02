<div align="center">

# ▲ AetherOps
### Autonomous Multi-Cloud AI Infrastructure & Kubernetes Orchestration Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.23+-00ADD8?style=for-the-badge&logo=go)](https://go.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-EKS%20%7C%20Kind-326CE5?style=for-the-badge&logo=kubernetes)](https://kubernetes.io/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL%20Mode-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-8B1D41?style=for-the-badge)](LICENSE)

<br/>

**AetherOps** is a mission-critical, autonomous cloud operations and FinOps intelligence platform engineered for multi-cloud AI infrastructure. It unifies distributed Kubernetes clusters (AWS EKS, GCP, Azure, Kind), streams live hardware and container telemetry, detects idle compute waste, executes autonomous self-healing rollouts, and provides a safe What-If financial sandbox.

[Explore Platform](#-key-features) • [Architecture](#-system-architecture) • [Live Telemetry](#-zero-mock-live-telemetry) • [Quick Start](#-quick-start) • [API Reference](#-api-specification)

<br/>

<img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80" alt="AetherOps Command Center" width="100%" style="border-radius: 12px; border: 1px solid rgba(245,240,230,0.15); box-shadow: 0 20px 50px rgba(0,0,0,0.8);" />

</div>

---

## Executive Summary

Modern engineering teams face critical operational inefficiencies:
1. **Tooling Fragmentation:** Operators waste valuable time switching between AWS Console tabs, Datadog dashboards, Grafana metrics, and manual `kubectl` terminals.
2. **GPU Cloud Waste:** Machine learning model inference and distributed training pipelines routinely leave multi-thousand-dollar GPU nodes sitting idle at 5–8% utilization on on-demand cloud pricing.
3. **Execution Hesitation:** Teams hesitate to rightsize or terminate instances due to the fear of unforeseen production outages or cascading latency spikes.

**AetherOps bridges this gap with an autonomous, metric-backed control loop:**
- Continuous hardware NVML and Prometheus telemetry ingestion.
- Deterministic FinOps engine with explainable cost attribution.
- Predictive **What-If Simulation Sandbox** proving ROI before changes are applied.
- Production-grade authentication with zero mock data.

---

## 🎨 Design System & Palette

AetherOps features a **Linear-inspired command center aesthetic**, meticulously styled using CSS variable design tokens for sub-second page performance:

| Token | Name | Hex | Usage |
|:---:|:---:|:---:|:---|
| <img src="https://via.placeholder.com/18/8EA396/8EA396.png" /> | **Muted Sage Grey** | `#8EA396` | Secondary typography, subtle borders, telemetry waveforms |
| <img src="https://via.placeholder.com/18/F5F0E6/F5F0E6.png" /> | **Warm Cream Beige** | `#F5F0E6` | Primary headers, high-contrast labels, active badges |
| <img src="https://via.placeholder.com/18/8B1D41/8B1D41.png" /> | **Deep Burgundy** | `#8B1D41` | Hero accents, primary action buttons, key metrics, status rings |
| <img src="https://via.placeholder.com/18/120D12/120D12.png" /> | **Obsidian Base** | `#120D12` | Deep-space dark canvas, glassmorphic cards (`rgba(34,26,34,0.7)`) |

---

## ⚡ Key Features

### 🔐 1. Enterprise Authentication & Security
- **Full Registration Flow (Sign Up):** Validates full name, email format, and password complexity (letters + numbers, 8+ characters).
- **Secure Authentication (Sign In):** Passwords hashed with `bcrypt` (cost factor 10); sessions issued as signed cryptographically secure JWT tokens with 30-day "Remember Me" persistence.
- **Brute-Force Protection:** Rate-limiting middleware restricts authentication endpoints to 5 requests per minute per IP.
- **Password Recovery:** Time-sensitive, single-use reset tokens with dedicated verification screens.
- **Context-Aware Navigation:** One-click `← Back to Home` navigation across all authentication screens and zero static "John Doe" placeholders.

### 🌐 2. Zero-Mock Live Infrastructure Telemetry
- **100% Live Backend Integration:** Every metric, node row, cost breakdown, and chart binds directly to the Go Gin REST API (`http://localhost:8080/api/v1/...`).
- **Real-Time Synchronous Refresh:** Custom `useFetch` hook equipped with `cache: "no-store"` and microsecond timestamp query parameters (`_t=...`) to ensure cache-free live telemetry updates on demand.
- **Hardware Telemetry:** Live GPU memory saturation (VRAM), node CPU load, network I/O, and health scores across monitored clusters.

### 📊 3. Executive FinOps Command Center
- **Dynamic KPI HUD:** Displays Total Active Clusters, Running Workloads, GPU Saturation Index, and Monthly Spend ($124.5k run-rate).
- **Interactive Multi-Cloud Spend Waves:** Visualizes actual expenditure versus optimized run-rate using Recharts area gradients.
- **Explainable Recommendations:** Surfaces high-impact rightsizing opportunities with estimated monthly savings, confidence ratings (90%+), and risk assessments.

### 🚀 4. Autonomous Kubernetes Fleet Management
- **Cluster Fleet View:** Live inspection of AWS EKS, GCP GKE, and local Kind clusters with real-time pod counts and version tracking.
- **Application Deployment & Scaling:** Direct replica scaling (e.g. `user-service`, `api-gateway`, `ai-inference-engine`) with live state feedback.
- **Autonomous Autoscaling (HPA):** Declarative scaling rules dynamically expanding container replicas during surges and gracefully downscaling when idle.
- **Self-Healing Loop:** Automatically detects `CrashLoopBackOff` pods and worker bottlenecks, isolating failed nodes and triggering safe rolling restarts.

### 🧪 5. What-If Financial Sandbox
- **Interactive Slider Simulation:** Allows cloud engineers to test shifting stateless jobs to Spot/Preemptible instances and tuning node buffer headroom before executing changes.
- **Live Baseline Comparison:** Accurately models savings directly against current active cluster costs ($124,500/mo baseline).

### 📄 6. Automated FinOps Reporting & Export
- **One-Click CSV Export:** Generates streaming CSV audits directly from `/api/v1/reports/export/csv` across Cost Audits, Recommendations, Executive Briefings, and Hardware Inventories.

---

## 🏛 System Architecture

```mermaid
graph TB
    subgraph "Client Layer (Port :3000)"
        UI[Next.js 16 App Router]
        AuthCtx[Auth Context & JWT Store]
        UI --> AuthCtx
    end

    subgraph "Backend API Gateway (Port :8080)"
        Gin[Go Gin Web Framework]
        AuthMW[Rate Limiter & JWT Middleware]
        Gin --> AuthMW
    end

    subgraph "Core Engines & Storage"
        AuthStore[(SQLite: users & password_resets)]
        FinOps[FinOps Cost Engine]
        Rules[Explainability Rule Engine]
        Sim[What-If Simulation Sandbox]
        
        AuthMW --> AuthStore
        Gin --> FinOps
        FinOps --> Rules
        FinOps --> Sim
    end

    subgraph "Infrastructure & Clusters"
        EKS[AWS EKS Cluster]
        Kind[Local Kind Cluster]
        Prom[Prometheus & Node Exporter]
        NVML[NVIDIA GPU NVML Telemetry]
        
        EKS --> Prom
        Kind --> Prom
        NVML --> Prom
        Prom --> FinOps
    end

    UI -->|REST / JSON (No Cache)| Gin
```

---

## 🗂 Project Structure

```
AetherOps/
├── backend/                         # Go 1.23+ REST API Microservice
│   ├── cmd/
│   │   └── server/main.go           # Application entrypoint & route registration
│   ├── internal/
│   │   ├── api/                     # Gin handlers & middleware
│   │   │   ├── auth_handlers.go     # Register, Login, Logout, Reset Password
│   │   │   ├── handlers.go          # Core API endpoints & CSV export
│   │   │   ├── milestone_handlers_ext.go # Simulation & safe actions
│   │   │   └── platform_handlers_ext.go  # Clusters, apps, pipelines, logs
│   │   ├── auth/                    # Bcrypt hashing, SQLite auth store & JWT
│   │   ├── costengine/              # Cloud pricing models & FinOps heuristics
│   │   │   ├── engine.go            # Metric transform & cost estimation
│   │   │   └── rules/rules.go       # Explainability rule definitions
│   │   └── services/                # Business logic, state snapshots & CSV generator
│   └── cost.db                      # Local SQLite database (WAL mode)
│
├── frontend/                        # Next.js 16 App Router UI
│   ├── app/                         # Pages & layouts
│   │   ├── page.tsx                 # High-velocity home page & live HUD
│   │   ├── dashboard/page.tsx       # Unified FinOps Command Center
│   │   ├── monitoring/page.tsx      # Prometheus & NVML live telemetry
│   │   ├── clusters/page.tsx        # Kubernetes fleet management
│   │   ├── applications/page.tsx    # Live workload scaling & management
│   │   ├── autoscaling/page.tsx     # Autonomous HPA policies
│   │   ├── simulation/page.tsx      # What-If Cost Sandbox
│   │   ├── reports/page.tsx         # Audit reports & CSV stream
│   │   ├── insights/page.tsx        # AI root-cause analysis
│   │   ├── auth/                    # Sign In, Sign Up, Forgot/Reset Password
│   │   └── globals.css              # Sage / Cream / Burgundy design system
│   ├── components/                  # Reusable UI components
│   │   ├── Sidebar.tsx              # Adaptive navigation with authenticated user profile
│   │   └── TopBar.tsx               # Cluster selector, health indicator & notifications
│   └── lib/                         # Client utilities
│       ├── api.ts                   # Typed hooks with cache-busting (useDashboard, useGpus, etc.)
│       ├── auth-context.tsx         # JWT session provider
│       └── data.ts                  # Shared TypeScript interfaces
│
└── README.md                        # Platform documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Go:** `1.21` or higher ([Download](https://go.dev/dl/))
- **Node.js:** `18.x` or `20.x` LTS ([Download](https://nodejs.org/))
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Nivritha03/AetherOps.git
cd AetherOps
```

### 2. Launch the Backend API (:8080)
```bash
cd backend
go run cmd/server/main.go
```
> The Go server will initialize `cost.db` (SQLite with `users` and `password_resets` tables) and begin serving live REST endpoints at **`http://localhost:8080`**.

### 3. Launch the Frontend (:3000)
In a separate terminal:
```bash
cd frontend
npm install
npm run build
npm run start
```
> Navigate to **`http://localhost:3000`** in your browser.

---

## 📡 API Specification

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/api/v1/auth/register` | Register new user account with bcrypt hashing | No (Rate-limited) |
| `POST` | `/api/v1/auth/login` | Authenticate user credentials and return JWT | No (Rate-limited) |
| `POST` | `/api/v1/auth/logout` | Terminate session and invalidate cookie | No |
| `GET` | `/api/v1/auth/me` | Fetch profile for currently authenticated user | Yes (`Bearer <token>`) |
| `POST` | `/api/v1/auth/forgot-password` | Request time-limited password reset token | No (Rate-limited) |
| `POST` | `/api/v1/auth/reset-password` | Commit new password using cryptographic token | No |
| `GET` | `/api/v1/dashboard` | Fetch executive cost, savings, and FinOps score | No |
| `GET` | `/api/v1/gpus` | Stream live hardware NVML GPU metrics and status | No |
| `GET` | `/api/v1/workloads` | Monitored Kubernetes workload pods and latency | No |
| `GET` | `/api/v1/costs` | Historical and projected infrastructure cost trends | No |
| `GET` | `/api/v1/recommendations` | Active AI rightsizing recommendations with ROI | No |
| `GET` | `/api/v1/clusters/list` | Connected AWS EKS & Kind cluster fleet metadata | No |
| `POST` | `/api/v1/applications/:id/scale` | Scale application replica count dynamically | No |
| `GET` | `/api/v1/reports/export/csv` | Download streaming CSV FinOps audit dumps | No |

---

## 🛡 Security & Reliability Standards

- **Zero Plaintext Passwords:** Strict `golang.org/x/crypto/bcrypt` hashing with salt rounds.
- **Brute-Force Rate Limiting:** Enforces maximum 5 authentication attempts per minute per IP via Go memory tracker.
- **Cryptographic Reset Tokens:** Single-use hex tokens with automatic 1-hour expiration.
- **Memory Safety:** Compiled Go microservice handling Prometheus telemetry ingestion with sub-millisecond response latency.
- **Production Build Validation:** Pure Next.js static asset optimization with Turbopack and zero runtime TypeScript warnings.

---

## 🤝 Contributing

Contributions are welcomed! Follow these steps:
1. Fork the Project (`git checkout -b feature/AmazingFeature`)
2. Commit your Changes (`git commit -m 'feat: add amazing feature'`)
3. Push to the Branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Engineered with precision for modern cloud and autonomous infrastructure teams.</sub>
</div>
