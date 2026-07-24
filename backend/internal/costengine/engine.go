package costengine

import (
	"log"
	"sort"

	"gpu-cost-optimizer-api/internal/config"
	"gpu-cost-optimizer-api/internal/costengine/calculator"
	"gpu-cost-optimizer-api/internal/costengine/history"
	"gpu-cost-optimizer-api/internal/costengine/models"
	"gpu-cost-optimizer-api/internal/costengine/rules"
)

type Engine struct {
	historyStore *history.SQLiteStore
	calculator   *calculator.CostCalculator
	rules        []rules.Rule
}

func NewEngine(cfg *config.Config) (*Engine, error) {
	// Initialize SQLite store (could fail if missing sqlite3, but assuming driver is injected)
	store, err := history.NewSQLiteStore("cost.db")
	if err != nil {
		log.Printf("Warning: Failed to init SQLite store: %v", err)
	}

	calc := calculator.NewCostCalculator(cfg)

	activeRules := []rules.Rule{
		&rules.IdleCPURule{ObservationWindow: cfg.Rules.IdleCPU.ObservationWindow},
		&rules.NodeConsolidationRule{ObservationWindow: cfg.Rules.NodeConsolidation.ObservationWindow},
	}

	return &Engine{
		historyStore: store,
		calculator:   calc,
		rules:        activeRules,
	}, nil
}

func (e *Engine) RecordNodeSnapshot(nodeName string, cpu, memory, cost float64) {
	if e.historyStore != nil {
		e.historyStore.SaveSnapshot(nodeName, cpu, memory, cost)
	}
}

func (e *Engine) GenerateRecommendations(nodeName string, cpu, memory, currentCost float64) []models.Recommendation {
	var recs []models.Recommendation

	// Try to get 24h average from history
	avgCPU, avgMem := cpu, memory
	durationHours := 0.0
	if e.historyStore != nil {
		c, m, err := e.historyStore.GetAverages(nodeName, 24)
		if err == nil && (c != 0 || m != 0) {
			avgCPU = c
			avgMem = m
			durationHours = 24.0
		}
	}

	snapshot := rules.MetricSnapshot{
		NodeName:          nodeName,
		CPUUtilization:    avgCPU,
		MemoryUtilization: avgMem,
		DurationHours:     durationHours,
		EstimatedNodeCost: currentCost,
	}

	for _, r := range e.rules {
		if rec := r.Evaluate(snapshot); rec != nil {
			recs = append(recs, *rec)
		}
	}
	return recs
}

func (e *Engine) GetTopOpportunities(recs []models.Recommendation) []models.Recommendation {
	sort.Slice(recs, func(i, j int) bool {
		return recs[i].EstimatedSavings.Value > recs[j].EstimatedSavings.Value
	})
	if len(recs) > 5 {
		return recs[:5]
	}
	return recs
}

func (e *Engine) GetTimeline() ([]history.TimelineEvent, error) {
	if e.historyStore != nil {
		return e.historyStore.GetCostTimeline()
	}
	return nil, nil
}
