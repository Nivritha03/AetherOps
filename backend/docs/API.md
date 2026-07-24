# AetherOps Backend API Documentation

All API endpoints are prefixed with `/api/v1` and follow a standard response format.

## Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": ""
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message details"
}
```

---

## 1. Health Check
`GET /api/v1/health`

Checks if the backend API is online.

**Request:** None
**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```
*(Note: Health check endpoint does not use the standard wrapper for simplicity)*

---

## 2. Dashboard Stats
`GET /api/v1/dashboard`

Retrieves top-level summary metrics for the executive dashboard.

**Request:** None
**Response:**
```json
{
  "success": true,
  "data": {
    "monthlyCost": 12500.50,
    "potentialSavings": 2340.00,
    "optimizationScore": 72,
    "idleGPUs": 4,
    "activeWorkloads": 12
  }
}
```

---

## 3. GPUs & Nodes
`GET /api/v1/gpus`

Retrieves a list of all GPU nodes and their current status across clusters.

**Request:** None
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "node-1",
      "name": "gke-gpu-pool-1",
      "cloud": "GCP",
      "region": "us-central1",
      "cluster": "prod-cluster",
      "instanceType": "a2-highgpu-1g",
      "gpuType": "A100",
      "gpuCount": 1,
      "status": "idle",
      "healthScore": 100,
      "utilizationPercent": 0,
      "memorySizeGB": 85,
      "memoryUsedGB": 0,
      "powerWatts": 50,
      "maxPowerWatts": 400,
      "costPerHour": 3.67,
      "monthlyCost": 2642.40,
      "idleHours": 24,
      "uptime": "5d 4h",
      "namespace": "ml-training"
    }
  ]
}
```

---

## 4. Recommendations
`GET /api/v1/recommendations`

Retrieves AI optimization recommendations to reduce costs.

**Request:** None
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rec-1",
      "title": "Scale down idle A100 node",
      "problem": "Node gke-gpu-pool-1 has been idle for 24 hours.",
      "action": "Scale deployment from 4 to 2 replicas",
      "aiReasoning": "Historical metrics show this cluster rarely utilizes 4 GPUs.",
      "cloud": "GCP",
      "cluster": "prod-cluster",
      "type": "rightsizing",
      "severity": "critical",
      "confidence": 95,
      "monthlySavings": 1240.00,
      "annualSavings": 14880.00,
      "difficulty": "easy",
      "estimatedTime": "10m",
      "status": "pending",
      "affectedNodes": ["gke-gpu-pool-1"]
    }
  ]
}
```

---

## 5. Costs History
`GET /api/v1/costs`

Retrieves the historical cost trend for chart visualization.

**Request:** None
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2023-10-01",
      "actual": 420.50,
      "forecast": 430.00,
      "optimized": 380.00
    }
  ]
}
```

---

## 6. Cluster Summary
`GET /api/v1/cluster`

Retrieves aggregate state of the Kubernetes clusters.

**Request:** None
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "prod-cluster",
      "cloud": "AWS",
      "region": "us-west-2",
      "totalNodes": 10,
      "gpuNodes": 4,
      "runningPods": 45,
      "pendingPods": 2,
      "storageUsedGB": 1500,
      "storageTotalGB": 5000,
      "networkInGbps": 2.5,
      "networkOutGbps": 1.2,
      "warnings": 1,
      "errors": 0,
      "healthScore": 98
    }
  ]
}
```
