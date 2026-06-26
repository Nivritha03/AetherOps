// ─── Types ────────────────────────────────────────────────────────────────

export type Cloud = "AWS" | "GCP" | "Azure";
export type Severity = "critical" | "high" | "medium" | "low";
export type GpuStatus = "healthy" | "idle" | "overutilized" | "misconfigured";
export type OptStatus = "pending" | "applied" | "ignored" | "scheduled";
export type AlertStatus = "active" | "resolved" | "acknowledged";

export interface GpuNode {
  id: string;
  name: string;
  cloud: Cloud;
  region: string;
  cluster: string;
  instanceType: string;
  gpuType: string;
  gpuCount: number;
  status: GpuStatus;
  healthScore: number;         // 0–100
  utilizationPercent: number;
  memorySizeGB: number;
  memoryUsedGB: number;
  powerWatts: number;
  maxPowerWatts: number;
  costPerHour: number;
  monthlyCost: number;
  idleHours: number;           // consecutive idle hours
  uptime: string;
  namespace: string;
}

export interface Optimization {
  id: string;
  title: string;
  problem: string;
  action: string;
  aiReasoning: string;
  cloud: Cloud;
  cluster: string;
  type: "rightsizing" | "scheduling" | "reserved" | "spot" | "preemptible" | "cleanup";
  severity: Severity;
  confidence: number;          // 0–100
  monthlySavings: number;
  annualSavings: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
  status: OptStatus;
  affectedNodes: string[];
  scheduledFor?: string;
}

export interface Workload {
  id: string;
  model: string;
  framework: string;
  namespace: string;
  cluster: string;
  gpuCount: number;
  gpuType: string;
  requestsPerSec: number;
  latencyP50Ms: number;
  latencyP99Ms: number;
  costPerHour: number;
  costPerRequest: number;
  monthlyCost: number;
  utilizationPercent: number;
  status: "running" | "scaling" | "idle" | "error";
}

export interface CostHistory {
  date: string;
  actual?: number;
  forecast?: number;
  optimized?: number;
}

export interface CostBreakdown {
  label: string;
  cost: number;
  percent: number;
  color: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  category: "idle" | "utilization" | "cost_spike" | "spot_interruption" | "scaling";
  affectedNode: string;
  cloud: Cloud;
  detectedAt: string;
  value?: string;
  threshold?: string;
}

export interface ClusterSummary {
  name: string;
  cloud: Cloud;
  region: string;
  totalNodes: number;
  gpuNodes: number;
  runningPods: number;
  pendingPods: number;
  storageUsedGB: number;
  storageTotalGB: number;
  networkInGbps: number;
  networkOutGbps: number;
  warnings: number;
  errors: number;
  healthScore: number;
}

export interface DashboardData {
  monthlyCost: number;
  potentialSavings: number;
  optimizationScore: number;
  idleGPUs: number;
  activeWorkloads: number;
}
