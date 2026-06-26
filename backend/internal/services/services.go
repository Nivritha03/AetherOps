package services

import (
	"gpu-cost-optimizer-api/internal/models"
	"gpu-cost-optimizer-api/internal/providers"
)

type Service struct {
	providers *providers.Providers
}

func NewService(p *providers.Providers) *Service {
	return &Service{providers: p}
}

func (s *Service) GetDashboardData() (models.DashboardData, error) {
	return s.providers.Dashboard.GetDashboardData()
}

func (s *Service) GetNodes() ([]models.GpuNode, error) {
	return s.providers.Node.GetNodes()
}

func (s *Service) GetWorkloads() ([]models.Workload, error) {
	return s.providers.Workload.GetWorkloads()
}

func (s *Service) GetRecommendations() ([]models.Recommendation, error) {
	return s.providers.Recommendation.GetRecommendations()
}

func (s *Service) GetCostHistory() ([]models.CostHistory, error) {
	return s.providers.Cost.GetCostHistory()
}

func (s *Service) GetCostBreakdown() (models.CostBreakdownResponse, error) {
	return s.providers.Cost.GetCostBreakdown()
}

func (s *Service) GetAlerts() ([]models.Alert, error) {
	return s.providers.Alert.GetAlerts()
}

func (s *Service) GetClusters() ([]models.ClusterHealth, error) {
	return s.providers.Cluster.GetClusters()
}
