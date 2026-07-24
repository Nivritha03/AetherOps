package prometheus
func (p *PrometheusProvider) GetCostTimeline() (interface{}, error) {
	return p.costEngine.GetTimeline()
}
