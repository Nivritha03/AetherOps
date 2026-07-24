package models

// Cost represents a financial value with confidence and source metadata
type Cost struct {
	Value      float64 `json:"value"`
	Confidence string  `json:"confidence"` // e.g., "estimated", "measured"
	Source     string  `json:"source"`     // e.g., "pricing-config", "cloud-billing-api"
}

// ClusterCost represents the hierarchical cost model starting at the cluster
type ClusterCost struct {
	ClusterName string         `json:"clusterName"`
	TotalCost   Cost           `json:"totalCost"`
	Nodes       []NodeCost     `json:"nodes"`
}

type NodeCost struct {
	NodeName   string          `json:"nodeName"`
	Cost       Cost            `json:"cost"`
	Namespaces []NamespaceCost `json:"namespaces"`
}

type NamespaceCost struct {
	NamespaceName string         `json:"namespaceName"`
	Cost          Cost           `json:"cost"`
	Workloads     []WorkloadCost `json:"workloads"`
}

type WorkloadCost struct {
	WorkloadName string    `json:"workloadName"`
	Cost         Cost      `json:"cost"`
	Pods         []PodCost `json:"pods"`
}

type PodCost struct {
	PodName string `json:"podName"`
	Cost    Cost   `json:"cost"`
}

type ReasonDetails struct {
	AverageCPU    float64 `json:"averageCpu"`
	AverageMemory float64 `json:"averageMemory"`
}

type Recommendation struct {
	ID                string        `json:"id"`
	Title             string        `json:"title"`
	Explanation       string        `json:"explanation"`
	Severity          string        `json:"severity"`
	Confidence        int           `json:"confidence"` // 0-100%
	EstimatedSavings  Cost          `json:"estimatedSavings"`
	EstimatedImpact   string        `json:"estimatedImpact"`
	Category          string        `json:"category"`
	RecommendedAction string        `json:"recommendedAction"`
	// Explainability
	Risk          string        `json:"risk"`
	ObservedFor   string        `json:"observedFor"`
	ReasonDetails ReasonDetails `json:"reasonDetails"`
	Why           string        `json:"why"`
	// Lifecycle
	Created       string `json:"created"`
	LastEvaluated string `json:"lastEvaluated"`
	Status        string `json:"status"` // "Active", "Resolved"
	Resolved      string `json:"resolved,omitempty"`
	Savings       Cost   `json:"savings,omitempty"`
}

type SavingsReport struct {
	TotalSavings Cost             `json:"totalSavings"`
	TopItems     []Recommendation `json:"topItems"`
}
