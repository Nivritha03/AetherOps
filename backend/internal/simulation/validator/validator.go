package validator

import "gpu-cost-optimizer-api/internal/simulation/models"

type Validator struct {
	MaxSafeCPU float64
	MaxSafeMem float64
}

func NewValidator() *Validator {
	return &Validator{
		MaxSafeCPU: 80.0,
		MaxSafeMem: 85.0,
	}
}

func (v *Validator) EvaluateRisk(state models.StateMetrics) string {
	if state.CPUPercent > 95 || state.MemPercent > 95 {
		return "Unsafe"
	}
	if state.CPUPercent > 85 || state.MemPercent > 85 {
		return "High Risk"
	}
	if state.CPUPercent > v.MaxSafeCPU || state.MemPercent > v.MaxSafeMem {
		return "Review Recommended"
	}
	return "Safe"
}
