package planner

import (
	"strings"
)

type Planner struct{}

func NewPlanner() *Planner {
	return &Planner{}
}

// ExtractTargetNode is a naive string matcher for the MVP.
// In reality, recommendations would hold strongly-typed target metadata.
func (p *Planner) ExtractTargetNode(recommendationID string) string {
	parts := strings.Split(recommendationID, "-")
	if len(parts) > 0 {
		return parts[len(parts)-1] // e.g. "idle-cpu-worker-2" -> "worker-2"
	}
	return ""
}
