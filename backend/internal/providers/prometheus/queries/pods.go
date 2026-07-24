package queries

const (
	PodCountQuery = `count(kube_pod_info)`
	DeploymentCountQuery = `count(kube_deployment_status_replicas_available)`
	NamespaceCountQuery = `count(kube_namespace_created)`
)
