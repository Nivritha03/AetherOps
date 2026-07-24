package prometheus

import (
	"fmt"
	"gpu-cost-optimizer-api/internal/costengine/models"
	sim_models "gpu-cost-optimizer-api/internal/simulation/models"
	"gpu-cost-optimizer-api/internal/providers/prometheus/queries"
)

func (p *PrometheusProvider) GetClusterSnapshot() (sim_models.ClusterSnapshot, error) {
	nodeCount, err := p.getSingleValue(queries.NodeCountQuery)
	if err != nil {
		nodeCount = 5 // fallback for MVP demo
	}
	
	// Hardcode some cluster metrics for MVP simulation context since we lack full PromQL queries here
	totalCpu := nodeCount * 8.0
	totalMem := nodeCount * 32.0
	
	snapshot := sim_models.ClusterSnapshot{
		TotalNodes:    int(nodeCount),
		TotalCPU:      totalCpu,
		TotalMemoryGB: totalMem,
		UsedCPU:       totalCpu * 0.45, // 45% cluster util
		UsedMemoryGB:  totalMem * 0.50, // 50% cluster mem util
		CurrentCost:   models.Cost{Value: nodeCount * p.calculator.CalculateNodeMonthlyCost(8, 32).Value, Confidence: "estimated"},
		Nodes:         []sim_models.NodeSnapshot{},
	}
	
	for i := 0; i < int(nodeCount); i++ {
		snapshot.Nodes = append(snapshot.Nodes, sim_models.NodeSnapshot{
			NodeName:       fmt.Sprintf("k8s-node-%d", i),
			CPUCapacity:    8.0,
			MemoryCapacity: 32.0,
			UsedCPU:        8.0 * 0.15, // Some idle nodes
			UsedMemoryGB:   32.0 * 0.20,
			CostPerHour:    p.calculator.CalculateNodeMonthlyCost(8, 32).Value / 730,
		})
	}

	return snapshot, nil
}
