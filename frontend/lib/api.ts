import { useState, useEffect } from "react";
import {
  GpuNode,
  Workload,
  Optimization,
  CostHistory,
  Alert,
  ClusterSummary,
  DashboardData
} from "./data";

const API_BASE = "http://localhost:8080/api/v1";

export function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<T | null> => {
    setLoading(true);
    setError(null);
    const separator = endpoint.includes("?") ? "&" : "?";
    try {
      const res = await fetch(`${API_BASE}${endpoint}${separator}_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const d = await res.json();
      setData(d);
      setLoading(false);
      return d;
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An error occurred");
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}

export const useDashboard = () => useFetch<DashboardData>("/dashboard");
export const useGpus = () => useFetch<GpuNode[]>("/gpus");
export const useWorkloads = () => useFetch<Workload[]>("/workloads");
export const useRecommendations = () => useFetch<Optimization[]>("/recommendations");
export const useCostHistory = () => useFetch<CostHistory[]>("/costs");
export const useCostBreakdown = () => useFetch<any>("/cost/breakdown");
export const useAlerts = () => useFetch<Alert[]>("/alerts");
export const useClusters = () => useFetch<ClusterSummary[]>("/cluster");

// Platform-level dynamic hooks connecting directly to backend API
export const usePlatformClusters = () => useFetch<any>("/clusters/list");
export const useApplications = () => useFetch<any>("/applications/list");
export const usePipelines = () => useFetch<any>("/pipelines/list");
export const useLogsStream = () => useFetch<any>("/logs/stream");
export const useAutoscalingPolicies = () => useFetch<any>("/autoscaling/policies");
export const useInfrastructurePlan = () => useFetch<any>("/infrastructure/plan");

export async function runSimulation(id: string) {
  const res = await fetch(`${API_BASE}/simulations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recommendationId: id, type: "what-if" })
  });
  if (!res.ok) throw new Error("Simulation failed");
  return res.json();
}

export async function resolveRecommendation(id: string, title: string, moneySaved: number) {
  const res = await fetch(`${API_BASE}/recommendations/${id}/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, moneySaved })
  });
  if (!res.ok) throw new Error("Failed to resolve recommendation");
  return res.json();
}

export const useResolvedRecommendations = () => useFetch<any>("/recommendations/resolved");

export async function applyAction(recommendationId: string) {
  const res = await fetch(`${API_BASE}/actions/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recommendationId })
  });
  if (!res.ok) throw new Error("Failed to apply action");
  return res.json();
}

export async function chatAssistant(prompt: string) {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error("Failed to chat");
  return res.json();
}

