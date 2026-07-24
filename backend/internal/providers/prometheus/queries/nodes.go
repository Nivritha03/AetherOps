package queries

const (
	NodeCountQuery = `count(kube_node_info)`
	NodeStatusQuery = `kube_node_status_condition{condition="Ready",status="true"}`
)
