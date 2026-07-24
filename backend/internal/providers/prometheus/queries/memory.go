package queries

const (
	MemoryUtilizationQuery = `sum(container_memory_working_set_bytes{container!=""}) / sum(machine_memory_bytes) * 100`
	NodeMemoryQuery = `sum by (node) (container_memory_working_set_bytes{container!=""})`
)
