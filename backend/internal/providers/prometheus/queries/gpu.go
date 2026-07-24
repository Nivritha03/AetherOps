package queries

const (
	GPUUtilizationQuery = `avg(DCGM_FI_DEV_GPU_UTIL)`
	GPUMemoryQuery = `avg(DCGM_FI_DEV_FB_USED) / avg(DCGM_FI_DEV_FB_TOTAL) * 100`
)
