package config

import (
	"os"

	"github.com/goccy/go-yaml"
)

type Config struct {
	Provider struct {
		Type string `yaml:"type"`
	} `yaml:"provider"`
	Prometheus struct {
		URL      string `yaml:"url"`
		CacheTTL string `yaml:"cacheTTL"`
	} `yaml:"prometheus"`
	Pricing struct {
		CpuPerHour      float64 `yaml:"cpuPerHour"`
		MemoryPerGBHour float64 `yaml:"memoryPerGBHour"`
		GpuPerHour      float64 `yaml:"gpuPerHour"`
	} `yaml:"pricing"`
	Rules struct {
		IdleCPU struct {
			ObservationWindow string `yaml:"observationWindow"`
		} `yaml:"idleCPU"`
		NodeConsolidation struct {
			ObservationWindow string `yaml:"observationWindow"`
		} `yaml:"nodeConsolidation"`
	} `yaml:"rules"`
}

func LoadConfig(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
