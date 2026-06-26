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

const API_BASE = "http://localhost:8080/api";

export function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}${endpoint}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [endpoint]);

  return { data, loading };
}

export const useDashboard = () => useFetch<DashboardData>("/dashboard");
export const useGpus = () => useFetch<GpuNode[]>("/gpus");
export const useWorkloads = () => useFetch<Workload[]>("/workloads");
export const useRecommendations = () => useFetch<Optimization[]>("/recommendations");
export const useCostHistory = () => useFetch<CostHistory[]>("/cost");
export const useCostBreakdown = () => useFetch<any>("/cost/breakdown");
export const useAlerts = () => useFetch<Alert[]>("/alerts");
export const useClusters = () => useFetch<ClusterSummary[]>("/cluster");

