package services

import (
	"log"
	"net/http"
	"time"

	"gpu-cost-optimizer-api/internal/config"
	cost_models "gpu-cost-optimizer-api/internal/costengine/models"
	sqlite_history "gpu-cost-optimizer-api/internal/costengine/history"
	"gpu-cost-optimizer-api/internal/models"
	"gpu-cost-optimizer-api/internal/providers"
	"gpu-cost-optimizer-api/internal/providers/mock"
	"gpu-cost-optimizer-api/internal/providers/prometheus"
	"gpu-cost-optimizer-api/internal/simulation"
	sim_models "gpu-cost-optimizer-api/internal/simulation/models"
)

type Service struct {
	providers *providers.Providers
	simEngine *simulation.Engine
}

func NewService(cfg *config.Config) *Service {
	var p *providers.Providers
	
	usePrometheus := false
	if cfg.Provider.Type == "prometheus" {
		log.Println("Checking Prometheus...")
		client := http.Client{Timeout: 2 * time.Second}
		resp, err := client.Get(cfg.Prometheus.URL + "/api/v1/status/buildinfo")
		
		if err == nil && resp.StatusCode == http.StatusOK {
			usePrometheus = true
			resp.Body.Close()
		} else {
			if resp != nil {
				resp.Body.Close()
			}
			log.Println("❌ Prometheus unavailable")
			log.Println("Falling back to Mock Provider.")
		}
	}

	if usePrometheus {
		prom := prometheus.NewPrometheusProvider(cfg)
		p = &providers.Providers{
			Dashboard:      prom,
			Node:           prom,
			Workload:       prom,
			Recommendation: prom,
			Cost:           prom,
			Alert:          prom,
			Cluster:        prom,
		}
	} else {
		mockProvider := mock.NewMockProvider()
		p = &providers.Providers{
			Dashboard:      mockProvider,
			Node:           mockProvider,
			Workload:       mockProvider,
			Recommendation: mockProvider,
			Cost:           mockProvider,
			Alert:          mockProvider,
			Cluster:        mockProvider,
		}
	}

	return &Service{
		providers: p,
		simEngine: simulation.NewEngine(),
	}
}

func (s *Service) RunSimulation(req sim_models.SimulationRequest) (sim_models.SimulationResult, error) {
	// For MVP, we need to get the snapshot from the provider. 
	// We'll type assert to PrometheusProvider. In a real system, the Provider interface would have GetClusterSnapshot()
	if prom, ok := s.providers.Cost.(*prometheus.PrometheusProvider); ok {
		snap, err := prom.GetClusterSnapshot()
		if err != nil {
			return sim_models.SimulationResult{}, err
		}
		return s.simEngine.RunSimulation(req, snap), nil
	}
	
	// Fallback mock snapshot
	snap := sim_models.ClusterSnapshot{
		TotalNodes: 5,
		TotalCPU: 40,
		TotalMemoryGB: 160,
		UsedCPU: 20,
		UsedMemoryGB: 80,
		CurrentCost: cost_models.Cost{Value: 3820, Confidence: "estimated"},
		Nodes: []sim_models.NodeSnapshot{{NodeName: "worker-2", CPUCapacity: 8, MemoryCapacity: 32, CostPerHour: 0.25}},
	}
	return s.simEngine.RunSimulation(req, snap), nil
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

func (s *Service) GetCostTimeline() (interface{}, error) {
	return s.providers.Cost.GetCostTimeline()
}

// Milestone 7: Recommendation Lifecycle
func (s *Service) ResolveRecommendation(id string, title string, moneySaved float64) error {
	// Let's create a global sqlite store instance for the MVP if not using history
	// Or we can just use the DB directly if we had a reference.
	// For simplicity in the MVP, we can instantiate it here, but it's better to pass it.
	// Actually, let's just initialize it on demand for the mock.
	store, err := sqlite_history.NewSQLiteStore("cost.db")
	if err != nil {
		return err
	}
	return store.ResolveRecommendation(id, title, moneySaved)
}

func (s *Service) GetResolvedRecommendations() ([]map[string]interface{}, error) {
	store, err := sqlite_history.NewSQLiteStore("cost.db")
	if err != nil {
		return nil, err
	}
	return store.GetResolvedRecommendations()
}

func (s *Service) GetResolvedMoneySaved() (float64, error) {
	store, err := sqlite_history.NewSQLiteStore("cost.db")
	if err != nil {
		return 0, err
	}
	return store.GetResolvedMoneySaved()
}

// Milestone 8: Safe Kubernetes Actions
func (s *Service) ApplyAction(recommendationID string) (map[string]interface{}, error) {
	// Mock generating a YAML diff for the requested recommendation
	return map[string]interface{}{
		"diff": "- replicas: 3\n+ replicas: 1\n",
		"status": "applied_successfully",
		"message": "Deployment scale updated",
	}, nil
}

// Milestone 9: AI Assistant
func (s *Service) ChatAssistant(prompt string) (string, error) {
	// Deterministic local mock for MVP
	return "Based on my analysis of your cluster metrics, you can save 30% on GPU costs by rightsizing the currently idle ResNet-50 nodes.", nil
}
