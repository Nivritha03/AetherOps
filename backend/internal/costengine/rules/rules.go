package rules

import (
	"fmt"
	"time"
	"gpu-cost-optimizer-api/internal/costengine/models"
)

// MetricSnapshot represents a data point for rule evaluation
type MetricSnapshot struct {
	NodeName           string
	CPUUtilization     float64
	MemoryUtilization  float64
	DurationHours      float64
	EstimatedNodeCost  float64
}

// Rule defines the common interface for all optimization rules
type Rule interface {
	Evaluate(snapshot MetricSnapshot) *models.Recommendation
}

type IdleCPURule struct{
	ObservationWindow string
}

func (r *IdleCPURule) Evaluate(snapshot MetricSnapshot) *models.Recommendation {
	if snapshot.CPUUtilization < 20 && snapshot.DurationHours >= 24 {
		savings := snapshot.EstimatedNodeCost * 0.8 // Assume 80% savings by downscaling
		return &models.Recommendation{
			ID:                fmt.Sprintf("idle-cpu-%s", snapshot.NodeName),
			Title:             fmt.Sprintf("Idle CPU on %s", snapshot.NodeName),
			Explanation:       fmt.Sprintf("Node %s has averaged %.1f%% CPU utilization.", snapshot.NodeName, snapshot.CPUUtilization),
			Severity:          "medium",
			Confidence:        95,
			EstimatedSavings:  models.Cost{Value: savings, Confidence: "estimated", Source: "rule-engine"},
			EstimatedImpact:   "Low",
			Category:          "Idle Resources",
			RecommendedAction: fmt.Sprintf("Downsize or remove node %s", snapshot.NodeName),
			Risk:              "Low",
			ObservedFor:       r.ObservationWindow,
			ReasonDetails: models.ReasonDetails{
				AverageCPU:    snapshot.CPUUtilization,
				AverageMemory: snapshot.MemoryUtilization,
			},
			Why:           fmt.Sprintf("Node has remained underutilized (CPU < 20%%) for %s consecutive.", r.ObservationWindow),
			Created:       time.Now().AddDate(0, 0, -1).Format(time.RFC3339), // Mocked for demo
			LastEvaluated: time.Now().Format(time.RFC3339),
			Status:        "Active",
		}
	}
	return nil
}

type NodeConsolidationRule struct{
	ObservationWindow string
}

func (r *NodeConsolidationRule) Evaluate(snapshot MetricSnapshot) *models.Recommendation {
	if snapshot.CPUUtilization < 30 && snapshot.MemoryUtilization < 30 {
		savings := snapshot.EstimatedNodeCost
		return &models.Recommendation{
			ID:                fmt.Sprintf("consolidate-%s", snapshot.NodeName),
			Title:             fmt.Sprintf("Consolidate workloads on %s", snapshot.NodeName),
			Explanation:       fmt.Sprintf("Node %s is highly underutilized (CPU: %.1f%%, Mem: %.1f%%).", snapshot.NodeName, snapshot.CPUUtilization, snapshot.MemoryUtilization),
			Severity:          "high",
			Confidence:        90,
			EstimatedSavings:  models.Cost{Value: savings, Confidence: "estimated", Source: "rule-engine"},
			EstimatedImpact:   "Medium",
			Category:          "Consolidation",
			RecommendedAction: fmt.Sprintf("Move workloads to other nodes and remove %s", snapshot.NodeName),
			Risk:              "Medium",
			ObservedFor:       r.ObservationWindow,
			ReasonDetails: models.ReasonDetails{
				AverageCPU:    snapshot.CPUUtilization,
				AverageMemory: snapshot.MemoryUtilization,
			},
			Why:           fmt.Sprintf("Node has low overall utilization for %s.", r.ObservationWindow),
			Created:       time.Now().Format(time.RFC3339),
			LastEvaluated: time.Now().Format(time.RFC3339),
			Status:        "Active",
		}
	}
	return nil
}
