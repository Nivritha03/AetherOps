package providers

import (
	"gpu-cost-optimizer-api/internal/models"
)

type DashboardProvider interface {
	GetDashboardData() (models.DashboardData, error)
}

type NodeProvider interface {
	GetNodes() ([]models.GpuNode, error)
}

type WorkloadProvider interface {
	GetWorkloads() ([]models.Workload, error)
}

type RecommendationProvider interface {
	GetRecommendations() ([]models.Recommendation, error)
}

type CostProvider interface {
	GetCostHistory() ([]models.CostHistory, error)
	GetCostBreakdown() (models.CostBreakdownResponse, error)
}

type AlertProvider interface {
	GetAlerts() ([]models.Alert, error)
}

type ClusterProvider interface {
	GetClusters() ([]models.ClusterHealth, error)
}

type Providers struct {
	Dashboard      DashboardProvider
	Node           NodeProvider
	Workload       WorkloadProvider
	Recommendation RecommendationProvider
	Cost           CostProvider
	Alert          AlertProvider
	Cluster        ClusterProvider
}
