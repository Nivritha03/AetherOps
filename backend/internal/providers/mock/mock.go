package mock

import (
	"gpu-cost-optimizer-api/internal/models"
)

type MockProvider struct{}

func NewMockProvider() *MockProvider {
	return &MockProvider{}
}

func (p *MockProvider) GetDashboardData() (models.DashboardData, error) {
	return models.DashboardData{
		MonthlyCost:       124500,
		PotentialSavings:  30200,
		OptimizationScore: 78,
		ScoreBreakdown: models.OptimizationScoreBreakdown{
			IdleResources:  65,
			Rightsizing:    72,
			CostEfficiency: 81,
			Reliability:    94,
			Scheduling:     80,
		},
		IdleGPUs:          14,
		ActiveWorkloads:   8,
	}, nil
}

func (p *MockProvider) GetNodes() ([]models.GpuNode, error) {
	return []models.GpuNode{
		{
			ID: "node-1", Name: "ai-training-01", Cloud: models.AWS, Region: "us-east-1",
			Cluster: "prod-cluster-us", InstanceType: "p4d.24xlarge", GpuType: "A100-80GB",
			GpuCount: 8, Status: models.Healthy, HealthScore: 98, UtilizationPercent: 92,
			MemorySizeGB: 1152, MemoryUsedGB: 1024, PowerWatts: 3800, MaxPowerWatts: 4200,
			CostPerHour: 32.77, MonthlyCost: 23594.40, IdleHours: 0,
			Uptime: "45d 12h", Namespace: "llm-training",
		},
		{
			ID: "node-2", Name: "ai-training-02", Cloud: models.AWS, Region: "us-east-1",
			Cluster: "prod-cluster-us", InstanceType: "p4d.24xlarge", GpuType: "A100-80GB",
			GpuCount: 8, Status: models.Idle, HealthScore: 85, UtilizationPercent: 5,
			MemorySizeGB: 1152, MemoryUsedGB: 64, PowerWatts: 450, MaxPowerWatts: 4200,
			CostPerHour: 32.77, MonthlyCost: 23594.40, IdleHours: 12,
			Uptime: "45d 12h", Namespace: "default",
		},
	}, nil
}

func (p *MockProvider) GetWorkloads() ([]models.Workload, error) {
	return []models.Workload{
		{
			ID: "wl-1", Model: "Llama-3-70B-Instruct", Framework: "vLLM", Namespace: "prod-inference",
			Cluster: "prod-cluster-us", GpuCount: 8, GpuType: "A100-80GB", RequestsPerSec: 124.5,
			LatencyP50Ms: 45, LatencyP99Ms: 120, CostPerHour: 32.77, CostPerRequest: 0.000073,
			MonthlyCost: 23594.40, UtilizationPercent: 88, Status: "Running",
		},
	}, nil
}

func (p *MockProvider) GetRecommendations() ([]models.Recommendation, error) {
	return []models.Recommendation{
		{
			ID: "opt-1", Title: "Idle GPU Instances Detected",
			Problem: "2 instances in AWS us-east-1 have been under 5% utilization for >12 hours.",
			Action: "Terminate or Stop instances 'ai-training-02' and 'ai-training-03'",
			AiReasoning: "Historical patterns show these instances are typically used for batch jobs that run on weekends. Stopping them during the week will not impact active inference endpoints.",
			Cloud: models.AWS, Cluster: "prod-cluster-us", Type: "cleanup",
			Severity: "critical", Confidence: 98, MonthlySavings: 47188.80,
			AnnualSavings: 566265.60, Difficulty: "easy", EstimatedTime: "5 mins",
			Status: "pending", AffectedNodes: []string{"ai-training-02"},
		},
	}, nil
}

func (p *MockProvider) GetCostHistory() ([]models.CostHistory, error) {
	v1, v2, v3, v4 := 125000.0, 118000.0, 122000.0, 124500.0
	f1, f2, o1, o2 := 126000.0, 128000.0, 95000.0, 94000.0
	return []models.CostHistory{
		{Date: "Jun 1", Actual: &v1},
		{Date: "Jun 10", Actual: &v2},
		{Date: "Jun 20", Actual: &v3},
		{Date: "Jun 26", Actual: &v4, Forecast: &v4, Optimized: &v4},
		{Date: "Jul 1", Forecast: &f1, Optimized: &o1},
		{Date: "Jul 10", Forecast: &f2, Optimized: &o2},
	}, nil
}

func (p *MockProvider) GetCostBreakdown() (models.CostBreakdownResponse, error) {
	return models.CostBreakdownResponse{
		Cloud: []models.CostBreakdown{
			{Label: "AWS", Cost: 68000, Percent: 54.6, Color: "#f59e0b"},
			{Label: "GCP", Cost: 42000, Percent: 33.7, Color: "#3b82f6"},
			{Label: "Azure", Cost: 14500, Percent: 11.6, Color: "#0ea5e9"},
		},
		GPU: []models.CostBreakdown{
			{Label: "A100-80GB", Cost: 72000, Percent: 57.8, Color: "#8b5cf6"},
			{Label: "A100-40GB", Cost: 31000, Percent: 24.9, Color: "#a855f7"},
			{Label: "V100", Cost: 12500, Percent: 10.0, Color: "#6366f1"},
			{Label: "T4", Cost: 9000, Percent: 7.2, Color: "#3b82f6"},
		},
		Namespace: []models.CostBreakdown{
			{Label: "llm-training", Cost: 55000, Percent: 44.2, Color: "#ef4444"},
			{Label: "prod-inference", Cost: 38000, Percent: 30.5, Color: "#f97316"},
			{Label: "research-sandbox", Cost: 18500, Percent: 14.9, Color: "#f59e0b"},
			{Label: "internal-tools", Cost: 13000, Percent: 10.4, Color: "#84cc16"},
		},
		Totals: struct {
			Current        float64 `json:"current"`
			Projected      float64 `json:"projected"`
			Savings        float64 `json:"savings"`
			SavingsPercent float64 `json:"savingsPercent"`
		}{
			Current:        124500,
			Projected:      94300,
			Savings:        30200,
			SavingsPercent: 24,
		},
	}, nil
}

func (p *MockProvider) GetAlerts() ([]models.Alert, error) {
	return []models.Alert{
		{
			ID: "alert-1", Title: "Cost Spike Detected",
			Description: "GCP project 'ai-research' spent 40% more than daily average.",
			Severity: "critical", Status: "active", Category: "cost",
			AffectedNode: "ai-research-v100-pool", Cloud: models.GCP,
			DetectedAt: "10 mins ago", Value: "+$1,200/day", Threshold: "+15%",
		},
	}, nil
}

func (p *MockProvider) GetClusters() ([]models.ClusterHealth, error) {
	return []models.ClusterHealth{
		{
			Name: "prod-cluster-us", Cloud: models.AWS, Region: "us-east-1",
			TotalNodes: 45, GpuNodes: 12, RunningPods: 340, PendingPods: 2,
			StorageUsedGB: 12400, StorageTotalGB: 20000,
			NetworkInGbps: 4.2, NetworkOutGbps: 1.8,
			Warnings: 3, Errors: 0, HealthScore: 94,
		},
	}, nil
}

func (p *MockProvider) GetCostTimeline() (interface{}, error) {
	return []map[string]interface{}{
		{"day": "Monday", "cost": 121, "reason": "Stable workloads"},
		{"day": "Tuesday", "cost": 156, "reason": "Training workload started"},
		{"day": "Wednesday", "cost": 118, "reason": "Node removed"},
	}, nil
}
