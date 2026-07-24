package prometheus

import (
	"fmt"
	"strconv"

	"gpu-cost-optimizer-api/internal/config"
	"gpu-cost-optimizer-api/internal/costengine"
	"gpu-cost-optimizer-api/internal/costengine/calculator"
	api_models "gpu-cost-optimizer-api/internal/models"
	"gpu-cost-optimizer-api/internal/providers/prometheus/queries"
)

type PrometheusProvider struct {
	client     *Client
	config     *config.Config
	costEngine *costengine.Engine
	calculator *calculator.CostCalculator
}

func NewPrometheusProvider(cfg *config.Config) *PrometheusProvider {
	engine, _ := costengine.NewEngine(cfg)
	return &PrometheusProvider{
		client:     NewClient(cfg),
		config:     cfg,
		costEngine: engine,
		calculator: calculator.NewCostCalculator(cfg),
	}
}

func (p *PrometheusProvider) getSingleValue(query string) (float64, error) {
	results, err := p.client.Query(query)
	if err != nil {
		return 0, err
	}
	if len(results) == 0 {
		return 0, nil
	}
	
	valStr, ok := results[0].Value[1].(string)
	if !ok {
		return 0, fmt.Errorf("invalid value format from prometheus")
	}
	
	val, err := strconv.ParseFloat(valStr, 64)
	if err != nil {
		return 0, err
	}
	
	return val, nil
}

func (p *PrometheusProvider) GetDashboardData() (api_models.DashboardData, error) {
	nodeCount, err := p.getSingleValue(queries.NodeCountQuery)
	if err != nil {
		return api_models.DashboardData{}, err
	}

	podCount, err := p.getSingleValue(queries.PodCountQuery)
	if err != nil {
		return api_models.DashboardData{}, err
	}
	
	// Estimated monthly cost calculation via Cost Engine
	// Assume 8 cores, 32GB RAM on average per node for now
	nodeMonthlyCost := p.calculator.CalculateNodeMonthlyCost(8, 32).Value
	totalMonthlyCost := nodeCount * nodeMonthlyCost

	// Generate recommendations for savings (dummy node for dashboard summary)
	recs := p.costEngine.GenerateRecommendations("cluster-summary", 15.0, 15.0, nodeMonthlyCost*nodeCount)
	topRecs := p.costEngine.GetTopOpportunities(recs)
	
	savings := 0.0
	for _, r := range topRecs {
		savings += r.EstimatedSavings.Value
	}

	return api_models.DashboardData{
		MonthlyCost:       totalMonthlyCost,
		PotentialSavings:  savings,
		OptimizationScore: 100, // To be calculated properly later
		ScoreBreakdown: api_models.OptimizationScoreBreakdown{
			IdleResources:  100,
			Rightsizing:    100,
			CostEfficiency: 100,
			Reliability:    100,
			Scheduling:     100,
		},
		IdleGPUs:          0,
		ActiveWorkloads:   int(podCount),
	}, nil
}

func (p *PrometheusProvider) GetNodes() ([]api_models.GpuNode, error) {
	// For now, return a placeholder node based on prometheus data
	nodeCount, err := p.getSingleValue(queries.NodeCountQuery)
	if err != nil {
		return nil, err
	}
	
	nodes := []api_models.GpuNode{}
	for i := 0; i < int(nodeCount); i++ {
		nodes = append(nodes, api_models.GpuNode{
			ID:                 fmt.Sprintf("node-%d", i),
			Name:               fmt.Sprintf("k8s-node-%d", i),
			Cloud:              api_models.AWS,
			Region:             "unknown",
			Cluster:            "prometheus-cluster",
			InstanceType:       "standard",
			GpuType:            "Unavailable",
			GpuCount:           0,
			Status:             api_models.Healthy,
			HealthScore:        100,
			UtilizationPercent: 0,
			MemorySizeGB:       32,
			MemoryUsedGB:       0,
			CostPerHour:        (8 * p.config.Pricing.CpuPerHour) + (32 * p.config.Pricing.MemoryPerGBHour),
		})
	}
	return nodes, nil
}

func (p *PrometheusProvider) GetWorkloads() ([]api_models.Workload, error) {
	// Real workloads would require more complex queries matching pods to deployments
	return []api_models.Workload{}, nil
}

func (p *PrometheusProvider) GetRecommendations() ([]api_models.Recommendation, error) {
	// Recommendations come later
	return []api_models.Recommendation{}, nil
}

func (p *PrometheusProvider) GetCostHistory() ([]api_models.CostHistory, error) {
	// Cost Engine milestone
	return []api_models.CostHistory{}, nil
}

func (p *PrometheusProvider) GetCostBreakdown() (api_models.CostBreakdownResponse, error) {
	return api_models.CostBreakdownResponse{}, nil
}

func (p *PrometheusProvider) GetAlerts() ([]api_models.Alert, error) {
	return []api_models.Alert{}, nil
}

func (p *PrometheusProvider) GetClusters() ([]api_models.ClusterHealth, error) {
	nodeCount, err := p.getSingleValue(queries.NodeCountQuery)
	if err != nil {
		return nil, err
	}
	podCount, err := p.getSingleValue(queries.PodCountQuery)
	if err != nil {
		return nil, err
	}

	return []api_models.ClusterHealth{
		{
			Name:        "prometheus-cluster",
			TotalNodes:  int(nodeCount),
			RunningPods: int(podCount),
			HealthScore: 100,
		},
	}, nil
}
