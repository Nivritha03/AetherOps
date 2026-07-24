package models

import "gpu-cost-optimizer-api/internal/costengine/models"

// ClusterSnapshot is completely decoupled from Prometheus.
// It represents the point-in-time state of the cluster required for simulation.
type ClusterSnapshot struct {
	TotalNodes    int
	TotalCPU      float64 // Cores
	TotalMemoryGB float64
	UsedCPU       float64 // Cores
	UsedMemoryGB  float64
	Nodes         []NodeSnapshot
	CurrentCost   models.Cost
}

type NodeSnapshot struct {
	NodeName      string
	CPUCapacity   float64
	MemoryCapacity float64
	UsedCPU       float64
	UsedMemoryGB  float64
	CostPerHour   float64
}

// SimulationRequest is the inbound request from the API
type SimulationRequest struct {
	RecommendationID string `json:"recommendationId"`
}

// SimulationResult is the core output of the Simulation Engine
type SimulationResult struct {
	SimulationID     string             `json:"simulationId"`
	RecommendationID string             `json:"recommendationId"`
	Timestamp        string             `json:"timestamp"`
	CurrentState     StateMetrics       `json:"currentState"`
	Options          []SimulationOption `json:"options"`
}

type StateMetrics struct {
	MonthlyCost float64 `json:"monthlyCost"`
	CPUPercent  float64 `json:"cpuPercent"`
	MemPercent  float64 `json:"memPercent"`
}

type SimulationOption struct {
	ID               string       `json:"id"`
	Title            string       `json:"title"`
	ProjectedState   StateMetrics `json:"projectedState"`
	EstimatedSavings float64      `json:"estimatedSavings"`
	Risk             string       `json:"risk"` // "Safe", "Review Recommended", "High Risk", "Unsafe"
	Confidence       int          `json:"confidence"` // 0-100
	ConfidenceReason string       `json:"confidenceReason"`
	Warnings         []string     `json:"warnings"`
	Assumptions      []string     `json:"assumptions"`
}
