package calculator

import (
	"gpu-cost-optimizer-api/internal/config"
	"gpu-cost-optimizer-api/internal/costengine/models"
)

type CostCalculator struct {
	config *config.Config
}

func NewCostCalculator(cfg *config.Config) *CostCalculator {
	return &CostCalculator{config: cfg}
}

func (c *CostCalculator) CalculateNodeHourlyCost(cpuCores float64, memGB float64) models.Cost {
	hourly := (cpuCores * c.config.Pricing.CpuPerHour) + (memGB * c.config.Pricing.MemoryPerGBHour)
	return models.Cost{
		Value:      hourly,
		Confidence: "estimated",
		Source:     "pricing-config",
	}
}

func (c *CostCalculator) CalculateNodeMonthlyCost(cpuCores float64, memGB float64) models.Cost {
	hourly := c.CalculateNodeHourlyCost(cpuCores, memGB).Value
	return models.Cost{
		Value:      hourly * 730,
		Confidence: "estimated",
		Source:     "pricing-config",
	}
}
