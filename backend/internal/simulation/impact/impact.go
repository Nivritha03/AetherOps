package impact

import "gpu-cost-optimizer-api/internal/simulation/models"

type Calculator struct {}

func NewCalculator() *Calculator {
	return &Calculator{}
}

// CalculateProjectedState calculates the new cluster state if a node is removed or resized, assuming workloads shift to remaining nodes.
func (c *Calculator) CalculateProjectedState(snapshot models.ClusterSnapshot, removedNode models.NodeSnapshot, resizedNode *models.NodeSnapshot) models.StateMetrics {
	projectedCPU := snapshot.UsedCPU
	projectedMem := snapshot.UsedMemoryGB
	
	newTotalCPU := snapshot.TotalCPU - removedNode.CPUCapacity
	newTotalMem := snapshot.TotalMemoryGB - removedNode.MemoryCapacity
	newMonthlyCost := snapshot.CurrentCost.Value - (removedNode.CostPerHour * 730) // roughly 730 hours in a month
	
	if resizedNode != nil {
		newTotalCPU += resizedNode.CPUCapacity
		newTotalMem += resizedNode.MemoryCapacity
		newMonthlyCost += (resizedNode.CostPerHour * 730)
	}
	
	var cpuPercent float64 = 0
	if newTotalCPU > 0 {
		cpuPercent = (projectedCPU / newTotalCPU) * 100
	}
	
	var memPercent float64 = 0
	if newTotalMem > 0 {
		memPercent = (projectedMem / newTotalMem) * 100
	}
	
	return models.StateMetrics{
		MonthlyCost: newMonthlyCost,
		CPUPercent:  cpuPercent,
		MemPercent:  memPercent,
	}
}
