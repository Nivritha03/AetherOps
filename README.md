# 🚀 GPU Cost Optimizer — Autonomous Multicloud AI Infrastructure Platform

An intelligent platform for monitoring, analyzing, and optimizing GPU costs across AWS, GCP, and Azure cloud providers.

## Architecture

```
gpu-cost-optimizer/
├── frontend/        # Next.js 16 + TypeScript + Tailwind + shadcn/ui
├── backend/         # Go (Gin) REST API
├── infra/           # Kubernetes manifests, Helm charts
├── docs/            # Documentation
└── scripts/         # Automation scripts
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts |
| Backend | Go 1.21+, Gin framework |
| Orchestration | Kubernetes (kind), Helm |
| Monitoring | Prometheus, Grafana |
| CI/CD | GitHub Actions |

## Quick Start

### Prerequisites
- Docker Desktop
- Go 1.21+
- Node.js 18+
- kind, kubectl, helm

### 1. Start the Kubernetes Cluster
```bash
kind create cluster --name gpu-cost-optimizer
```

### 2. Run the Backend
```bash
cd backend
go run main.go
# API available at http://localhost:8080
```

### 3. Run the Frontend
```bash
cd frontend
npm run dev
# UI available at http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/nodes` | List all GPU nodes |
| GET | `/api/v1/costs/summary` | Cost summary across clouds |
| GET | `/api/v1/costs/history` | Historical cost data |
| GET | `/api/v1/optimizations` | Optimization recommendations |
| POST | `/api/v1/optimizations/:id/apply` | Apply an optimization |
| GET | `/api/v1/metrics/utilization` | GPU utilization metrics |

## Environment Variables

### Backend
```env
PORT=8080
PROMETHEUS_URL=http://prometheus:9090
KUBECONFIG=/path/to/.kube/config
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
