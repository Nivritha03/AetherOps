package queries

const (
	CPUUtilizationQuery = `sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) / sum(machine_cpu_cores) * 100`
	NodeCPUQuery = `sum by (node) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))`
)
