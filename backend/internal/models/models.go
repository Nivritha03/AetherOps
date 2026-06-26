package models

type DashboardData struct {
	MonthlyCost      float64 `json:"monthlyCost"`
	PotentialSavings float64 `json:"potentialSavings"`
	OptimizationScore int     `json:"optimizationScore"`
	IdleGPUs         int     `json:"idleGPUs"`
	ActiveWorkloads  int     `json:"activeWorkloads"`
}

type Cloud string

const (
	AWS   Cloud = "AWS"
	GCP   Cloud = "GCP"
	Azure Cloud = "Azure"
)

type GpuStatus string

const (
	Healthy       GpuStatus = "healthy"
	Idle          GpuStatus = "idle"
	Overutilized  GpuStatus = "overutilized"
	Misconfigured GpuStatus = "misconfigured"
)

type GpuNode struct {
	ID                 string    `json:"id"`
	Name               string    `json:"name"`
	Cloud              Cloud     `json:"cloud"`
	Region             string    `json:"region"`
	Cluster            string    `json:"cluster"`
	InstanceType       string    `json:"instanceType"`
	GpuType            string    `json:"gpuType"`
	GpuCount           int       `json:"gpuCount"`
	Status             GpuStatus `json:"status"`
	HealthScore        int       `json:"healthScore"`
	UtilizationPercent int       `json:"utilizationPercent"`
	MemorySizeGB       int       `json:"memorySizeGB"`
	MemoryUsedGB       int       `json:"memoryUsedGB"`
	PowerWatts         int       `json:"powerWatts"`
	MaxPowerWatts      int       `json:"maxPowerWatts"`
	CostPerHour        float64   `json:"costPerHour"`
	MonthlyCost        float64   `json:"monthlyCost"`
	IdleHours          int       `json:"idleHours"`
	Uptime             string    `json:"uptime"`
	Namespace          string    `json:"namespace"`
}

type Workload struct {
	ID                 string  `json:"id"`
	Model              string  `json:"model"`
	Framework          string  `json:"framework"`
	Namespace          string  `json:"namespace"`
	Cluster            string  `json:"cluster"`
	GpuCount           int     `json:"gpuCount"`
	GpuType            string  `json:"gpuType"`
	RequestsPerSec     float64 `json:"requestsPerSec"`
	LatencyP50Ms       int     `json:"latencyP50Ms"`
	LatencyP99Ms       int     `json:"latencyP99Ms"`
	CostPerHour        float64 `json:"costPerHour"`
	CostPerRequest     float64 `json:"costPerRequest"`
	MonthlyCost        float64 `json:"monthlyCost"`
	UtilizationPercent int     `json:"utilizationPercent"`
	Status             string  `json:"status"`
}

type Recommendation struct {
	ID             string   `json:"id"`
	Title          string   `json:"title"`
	Problem        string   `json:"problem"`
	Action         string   `json:"action"`
	AiReasoning    string   `json:"aiReasoning"`
	Cloud          Cloud    `json:"cloud"`
	Cluster        string   `json:"cluster"`
	Type           string   `json:"type"`
	Severity       string   `json:"severity"`
	Confidence     int      `json:"confidence"`
	MonthlySavings float64  `json:"monthlySavings"`
	AnnualSavings  float64  `json:"annualSavings"`
	Difficulty     string   `json:"difficulty"`
	EstimatedTime  string   `json:"estimatedTime"`
	Status         string   `json:"status"`
	AffectedNodes  []string `json:"affectedNodes"`
}

type CostHistory struct {
	Date      string   `json:"date"`
	Actual    *float64 `json:"actual"`
	Forecast  *float64 `json:"forecast"`
	Optimized *float64 `json:"optimized"`
}

type Alert struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	Severity     string `json:"severity"`
	Status       string `json:"status"`
	Category     string `json:"category"`
	AffectedNode string `json:"affectedNode"`
	Cloud        Cloud  `json:"cloud"`
	DetectedAt   string `json:"detectedAt"`
	Value        string `json:"value,omitempty"`
	Threshold    string `json:"threshold,omitempty"`
}

type ClusterHealth struct {
	Name           string  `json:"name"`
	Cloud          Cloud   `json:"cloud"`
	Region         string  `json:"region"`
	TotalNodes     int     `json:"totalNodes"`
	GpuNodes       int     `json:"gpuNodes"`
	RunningPods    int     `json:"runningPods"`
	PendingPods    int     `json:"pendingPods"`
	StorageUsedGB  int     `json:"storageUsedGB"`
	StorageTotalGB int     `json:"storageTotalGB"`
	NetworkInGbps  float64 `json:"networkInGbps"`
	NetworkOutGbps float64 `json:"networkOutGbps"`
	Warnings       int     `json:"warnings"`
	Errors         int     `json:"errors"`
	HealthScore    int     `json:"healthScore"`
}

type CostBreakdown struct {
	Label   string  `json:"label"`
	Cost    float64 `json:"cost"`
	Percent float64 `json:"percent"`
	Color   string  `json:"color"`
}

type CostBreakdownResponse struct {
	Cloud     []CostBreakdown `json:"cloud"`
	GPU       []CostBreakdown `json:"gpu"`
	Namespace []CostBreakdown `json:"namespace"`
	Totals    struct {
		Current        float64 `json:"current"`
		Projected      float64 `json:"projected"`
		Savings        float64 `json:"savings"`
		SavingsPercent float64 `json:"savingsPercent"`
	} `json:"totals"`
}
