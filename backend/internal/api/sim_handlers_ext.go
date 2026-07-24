package api

import (
	"github.com/gin-gonic/gin"
	sim_models "gpu-cost-optimizer-api/internal/simulation/models"
)
func (h *Handler) createSimulation(c *gin.Context) {
	var req sim_models.SimulationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errorResponse(c, err)
		return
	}
	
	data, err := h.service.RunSimulation(req)
	if err != nil {
		errorResponse(c, err)
		return
	}
	
	successResponse(c, data)
}
