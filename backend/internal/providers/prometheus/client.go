package prometheus

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
	"gpu-cost-optimizer-api/internal/config"
)

type Client struct {
	baseURL string
	client  *http.Client
}

type PromResult struct {
	Metric map[string]string `json:"metric"`
	Value  []interface{}     `json:"value"` // [unix_time, "value_string"]
}

type PromResponse struct {
	Status string `json:"status"`
	Data   struct {
		ResultType string       `json:"resultType"`
		Result     []PromResult `json:"result"`
	} `json:"data"`
}

func NewClient(cfg *config.Config) *Client {
	return &Client{
		baseURL: cfg.Prometheus.URL,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *Client) Query(query string) ([]PromResult, error) {
	start := time.Now()
	
	reqURL := fmt.Sprintf("%s/api/v1/query?query=%s", c.baseURL, url.QueryEscape(query))
	resp, err := c.client.Get(reqURL)
	
	duration := time.Since(start)
	log.Printf("[Prometheus] Query: %s | Duration: %s", query, duration)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to prometheus: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("prometheus returned status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var promResp PromResponse
	if err := json.NewDecoder(resp.Body).Decode(&promResp); err != nil {
		return nil, fmt.Errorf("failed to decode prometheus response: %w", err)
	}

	if promResp.Status != "success" {
		return nil, fmt.Errorf("prometheus query failed: %v", promResp)
	}

	return promResp.Data.Result, nil
}
