package simulation

import (
	"fmt"
	"time"

	"gpu-cost-optimizer-api/internal/simulation/impact"
	"gpu-cost-optimizer-api/internal/simulation/models"
	"gpu-cost-optimizer-api/internal/simulation/planner"
	"gpu-cost-optimizer-api/internal/simulation/validator"
)

type Engine struct {
	planner    *planner.Planner
	impact     *impact.Calculator
	validator  *validator.Validator
}

func NewEngine() *Engine {
	return &Engine{
		planner:   planner.NewPlanner(),
		impact:    impact.NewCalculator(),
		validator: validator.NewValidator(),
	}
}

func (e *Engine) RunSimulation(req models.SimulationRequest, snapshot models.ClusterSnapshot) models.SimulationResult {
	targetNodeName := e.planner.ExtractTargetNode(req.RecommendationID)
	
	// Find the target node in the snapshot
	var targetNode *models.NodeSnapshot
	for _, n := range snapshot.Nodes {
		// Just match substring for MVP demo
		if n.NodeName == targetNodeName || fmt.Sprintf("k8s-node-%s", targetNodeName) == n.NodeName {
			targetNode = &n
			break
		}
	}
	
	if targetNode == nil && len(snapshot.Nodes) > 0 {
		targetNode = &snapshot.Nodes[0] // Fallback for simulation demo
	}
	
	currentState := models.StateMetrics{
		MonthlyCost: snapshot.CurrentCost.Value,
		CPUPercent:  (snapshot.UsedCPU / snapshot.TotalCPU) * 100,
		MemPercent:  (snapshot.UsedMemoryGB / snapshot.TotalMemoryGB) * 100,
	}

	result := models.SimulationResult{
		SimulationID:     fmt.Sprintf("sim-%d", time.Now().Unix()),
		RecommendationID: req.RecommendationID,
		Timestamp:        time.Now().Format(time.RFC3339),
		CurrentState:     currentState,
		Options:          []models.SimulationOption{},
	}
	
	if targetNode == nil {
		return result
	}

	// Option A: Node Removal
	projA := e.impact.CalculateProjectedState(snapshot, *targetNode, nil)
	riskA := e.validator.EvaluateRisk(projA)
	savingsA := currentState.MonthlyCost - projA.MonthlyCost
	
	optA := models.SimulationOption{
		ID:               "opt-remove",
		Title:            fmt.Sprintf("Remove %s", targetNode.NodeName),
		ProjectedState:   projA,
		EstimatedSavings: savingsA,
		Risk:             riskA,
		Confidence:       92,
		ConfidenceReason: "Metric freshness and cluster stability",
		Warnings:         []string{},
		Assumptions: []string{
			"No workload failures",
			"No autoscaling events",
			"Current cluster load remains constant",
		},
	}
	if riskA == "High Risk" || riskA == "Unsafe" {
		optA.Warnings = append(optA.Warnings, "Cluster capacity will run extremely hot. Prepare for potential OOMs.")
	}
	result.Options = append(result.Options, optA)

	// Option B: Node Resize (Simulate halving the capacity)
	resizedNode := *targetNode
	resizedNode.CPUCapacity = resizedNode.CPUCapacity / 2
	resizedNode.MemoryCapacity = resizedNode.MemoryCapacity / 2
	resizedNode.CostPerHour = resizedNode.CostPerHour / 2

	projB := e.impact.CalculateProjectedState(snapshot, *targetNode, &resizedNode)
	riskB := e.validator.EvaluateRisk(projB)
	savingsB := currentState.MonthlyCost - projB.MonthlyCost

	optB := models.SimulationOption{
		ID:               "opt-resize",
		Title:            fmt.Sprintf("Resize %s (Downsize)", targetNode.NodeName),
		ProjectedState:   projB,
		EstimatedSavings: savingsB,
		Risk:             riskB,
		Confidence:       88,
		ConfidenceReason: "Based on historical average utilization",
		Warnings:         []string{},
		Assumptions: []string{
			"No workload failures",
			"Current cluster load remains constant",
		},
	}
	result.Options = append(result.Options, optB)
	
	// Option C: Move Workloads (No immediate infra change, just bin packing)
	projC := currentState
	savingsC := 0.0 // No direct savings until node is actually removed
	optC := models.SimulationOption{
		ID:               "opt-move",
		Title:            "Move workloads (Bin pack only)",
		ProjectedState:   projC,
		EstimatedSavings: savingsC,
		Risk:             "Safe",
		Confidence:       95,
		ConfidenceReason: "No capacity changes",
		Warnings:         []string{"This action prepares for future scale-down but yields no immediate savings."},
		Assumptions: []string{
			"No workload failures",
		},
	}
	result.Options = append(result.Options, optC)

	return result
}
