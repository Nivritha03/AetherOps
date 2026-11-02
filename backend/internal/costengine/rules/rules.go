package rules

import (
	"fmt"
	"time"
	"gpu-cost-optimizer-api/internal/costengine/models"
)

// MetricSnapshot represents a data point for rule evaluation
type MetricSnapshot struct {
	NodeName           string
	GPUID              string
	GPUModel           string
	CPUUtilization     float64
	MemoryUtilization  float64
	GPUUtilization     float64
	GPUMemoryUtil      float64
	DurationHours      float64
	EstimatedNodeCost  float64
	IsSpotEligible     bool
	WorkloadType       string
}

// Rule defines the common interface for all optimization rules
type Rule interface {
	Evaluate(snapshot MetricSnapshot) *models.Recommendation
}

type IdleCPURule struct {
	ObservationWindow string
}

func (r *IdleCPURule) Evaluate(snapshot MetricSnapshot) *models.Recommendation {
	if snapshot.CPUUtilization < 20 && snapshot.DurationHours >= 24 {
		savings := snapshot.EstimatedNodeCost * 0.8
		return &models.Recommendation{
			ID:                fmt.Sprintf("idle-cpu-%s", snapshot.NodeName),
			Title:             fmt.Sprintf("Idle CPU on %s", snapshot.NodeName),
			Explanation:       fmt.Sprintf("Node %s has averaged %.1f%% CPU utilization over the last %s.", snapshot.NodeName, snapshot.CPUUtilization, r.ObservationWindow),
			Severity:          "medium",
			Confidence:        95,
			EstimatedSavings:  models.Cost{Value: savings, Confidence: "estimated", Source: "rule-engine"},
			EstimatedImpact:   "Low",
			Category:          "Idle Resources",
			RecommendedAction: fmt.Sprintf("Downsize or terminate underutilized node %s", snapshot.NodeName),
			Risk:              "Low",
			ObservedFor:       r.ObservationWindow,
			ReasonDetails: models.ReasonDetails{
				AverageCPU:    snapshot.CPUUtilization,
				AverageMemory: snapshot.MemoryUtilization,
			},
			Why:           fmt.Sprintf("Node CPU utilization remained under 20%% for %s continuously.", r.ObservationWindow),
			Created:       time.Now().AddDate(0, 0, -1).Format(time.RFC3339),
			LastEvaluated: time.Now().Format(time.RFC3339),
			Status:        "Active",
		}
	}
	return nil
}

type IdleGPURule struct {
	ObservationWindow string
}

func (r *IdleGPURule) Evaluate(snapshot MetricSnapshot) *models.Recommendation {
	if snapshot.GPUUtilization < 5 && snapshot.EstimatedNodeCost > 0 {
		savings := snapshot.EstimatedNodeCost * 0.95
		id := fmt.Sprintf("idle-gpu-%s", snapshot.NodeName)
		if snapshot.GPUID != "" {
			id = fmt.Sprintf("idle-gpu-%s", snapshot.GPUID)
		}
		return &models.Recommendation{
			ID:                id,
			Title:             fmt.Sprintf("Idle GPU Instance on %s (%s)", snapshot.NodeName, snapshot.GPUModel),
			Explanation:       fmt.Sprintf("GPU %s on %s has maintained an average compute utilization of %.1f%% over the observation window.", snapshot.GPUModel, snapshot.NodeName, snapshot.GPUUtilization),
			Severity:          "critical",
			Confidence:        98,
			EstimatedSavings:  models.Cost{Value: savings, Confidence: "estimated", Source: "rule-engine"},
			EstimatedImpact:   "High",
			Category:          "Idle Resources",
			RecommendedAction: fmt.Sprintf("Deallocate GPU node %s or scale replica count to 0 when idle", snapshot.NodeName),
			Risk:              "Low",
			ObservedFor:       r.ObservationWindow,
			ReasonDetails: models.ReasonDetails{
				AverageCPU:    snapshot.CPUUtilization,
				AverageMemory: snapshot.MemoryUtilization,
			},
			Why:           fmt.Sprintf("GPU compute utilization remained below 5%% during the past %s.", r.ObservationWindow),
			Created:       time.Now().Format(time.RFC3339),
			LastEvaluated: time.Now().Format(time.RFC3339),
			Status:        "Active",
		}
	}
	return nil
}

type UnderutilizedGPURule struct {
	ObservationWindow string
}

func (r *UnderutilizedGPURule) Evaluate(snapshot MetricSnapshot) *models.Recommendation {
	if snapshot.GPUUtilization >= 5 && snapshot.GPUUtilization < 30 && snapshot.EstimatedNodeCost > 0 {
		savings := snapshot.EstimatedNodeCost * 0.45
		return &models.Recommendation{
			ID:                fmt.Sprintf("underutilized-gpu-%s", snapshot.NodeName),
			Title:             fmt.Sprintf("Underutilized GPU on %s", snapshot.NodeName),
			Explanation:       fmt.Sprintf("GPU %s averaged %.1f%% utilization. Workload could be shared via MIG or bin-packed onto denser instances.", snapshot.GPUModel, snapshot.GPUUtilization),
			Severity:          "high",
			Confidence:        88,
			EstimatedSavings:  models.Cost{Value: savings, Confidence: "estimated", Source: "rule-engine"},
			EstimatedImpact:   "Medium",
			Category:          "Rightsizing",
			RecommendedAction: "Partition GPU with NVIDIA MIG or colocate secondary inference pods",
			Risk:              "Medium",
			ObservedFor:       r.ObservationWindow,
			ReasonDetails: models.ReasonDetails{
				AverageCPU:    snapshot.CPUUtilization,
				AverageMemory: snapshot.MemoryUtilization,
			},
			Why:           fmt.Sprintf("Sustained GPU utilization between 5-30%% across %s indicates sub-optimal tensor core saturation.", r.ObservationWindow),
			Created:       time.Now().Format(time.RFC3339),
			LastEvaluated: time.Now().Format(time.RFC3339),
			Status:        "Active",
		}
	}
	return nil
}

type NodeConsolidationRule struct {
	ObservationWindow string
}

func (r *NodeConsolidationRule) Evaluate(snapshot MetricSnapshot) *models.Recommendation {
	if snapshot.CPUUtilization < 30 && snapshot.MemoryUtilization < 30 {
		savings := snapshot.EstimatedNodeCost
		return &models.Recommendation{
			ID:                fmt.Sprintf("consolidate-%s", snapshot.NodeName),
			Title:             fmt.Sprintf("Consolidate workloads from %s", snapshot.NodeName),
			Explanation:       fmt.Sprintf("Node %s has low resource saturation (CPU: %.1f%%, Mem: %.1f%%).", snapshot.NodeName, snapshot.CPUUtilization, snapshot.MemoryUtilization),
			Severity:          "high",
			Confidence:        90,
			EstimatedSavings:  models.Cost{Value: savings, Confidence: "estimated", Source: "rule-engine"},
			EstimatedImpact:   "Medium",
			Category:          "Consolidation",
			RecommendedAction: fmt.Sprintf("Drain node %s and let scheduler reassign pods to existing underutilized nodes", snapshot.NodeName),
			Risk:              "Medium",
			ObservedFor:       r.ObservationWindow,
			ReasonDetails: models.ReasonDetails{
				AverageCPU:    snapshot.CPUUtilization,
				AverageMemory: snapshot.MemoryUtilization,
			},
			Why:           fmt.Sprintf("Combined CPU and Memory saturation are below 30%% across %s.", r.ObservationWindow),
			Created:       time.Now().Format(time.RFC3339),
			LastEvaluated: time.Now().Format(time.RFC3339),
			Status:        "Active",
		}
	}
	return nil
}

type SpotOpportunityRule struct {
	ObservationWindow string
}

func (r *SpotOpportunityRule) Evaluate(snapshot MetricSnapshot) *models.Recommendation {
	if snapshot.IsSpotEligible || snapshot.WorkloadType == "batch-training" || snapshot.WorkloadType == "data-pipeline" {
		savings := snapshot.EstimatedNodeCost * 0.65
		return &models.Recommendation{
			ID:                fmt.Sprintf("spot-migration-%s", snapshot.NodeName),
			Title:             fmt.Sprintf("Migrate %s to Spot/Preemptible Instances", snapshot.NodeName),
			Explanation:       fmt.Sprintf("Node %s executes fault-tolerant batch workloads (%s) which qualify for 60-70%% Spot discounts.", snapshot.NodeName, snapshot.WorkloadType),
			Severity:          "medium",
			Confidence:        92,
			EstimatedSavings:  models.Cost{Value: savings, Confidence: "estimated", Source: "rule-engine"},
			EstimatedImpact:   "High",
			Category:          "Spot Opportunities",
			RecommendedAction: "Switch node pool provisioning type to AWS Spot or GCP Preemptible with checkpointing enabled",
			Risk:              "Low",
			ObservedFor:       r.ObservationWindow,
			ReasonDetails: models.ReasonDetails{
				AverageCPU:    snapshot.CPUUtilization,
				AverageMemory: snapshot.MemoryUtilization,
			},
			Why:           "Workload exhibits restart safety and does not serve real-time external SLA endpoints.",
			Created:       time.Now().Format(time.RFC3339),
			LastEvaluated: time.Now().Format(time.RFC3339),
			Status:        "Active",
		}
	}
	return nil
}

type InstanceResizingRule struct {
	ObservationWindow string
}

func (r *InstanceResizingRule) Evaluate(snapshot MetricSnapshot) *models.Recommendation {
	if snapshot.CPUUtilization < 40 && snapshot.MemoryUtilization < 40 && snapshot.EstimatedNodeCost > 500 {
		savings := snapshot.EstimatedNodeCost * 0.50
		return &models.Recommendation{
			ID:                fmt.Sprintf("resize-%s", snapshot.NodeName),
			Title:             fmt.Sprintf("Downsize Overprovisioned Instance %s", snapshot.NodeName),
			Explanation:       fmt.Sprintf("Node %s is sized significantly above actual peak needs (CPU: %.1f%%, Mem: %.1f%%).", snapshot.NodeName, snapshot.CPUUtilization, snapshot.MemoryUtilization),
			Severity:          "high",
			Confidence:        89,
			EstimatedSavings:  models.Cost{Value: savings, Confidence: "estimated", Source: "rule-engine"},
			EstimatedImpact:   "Medium",
			Category:          "Instance Resizing",
			RecommendedAction: "Resize node to next smaller instance tier (e.g., 2xlarge to xlarge)",
			Risk:              "Low",
			ObservedFor:       r.ObservationWindow,
			ReasonDetails: models.ReasonDetails{
				AverageCPU:    snapshot.CPUUtilization,
				AverageMemory: snapshot.MemoryUtilization,
			},
			Why:           "Peak headroom exceeds 60% of provisioned capacity over the observation period.",
			Created:       time.Now().Format(time.RFC3339),
			LastEvaluated: time.Now().Format(time.RFC3339),
			Status:        "Active",
		}
	}
	return nil
}
