package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gpu-cost-optimizer-api/internal/services"
)

type APIResponse struct {
	Success     bool        `json:"success"`
	Data        interface{} `json:"data,omitempty"`
	Message     string      `json:"message,omitempty"`
	Error       string      `json:"error,omitempty"`
	LastUpdated string      `json:"lastUpdated,omitempty"`
}

func successResponse(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Data:    data,
	})
}

func errorResponse(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, APIResponse{
		Success: false,
		Error:   err.Error(),
	})
}

type Handler struct {
	service *services.Service
}

func NewHandler(s *services.Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) RegisterRoutes(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", h.getHealth)
		v1.GET("/dashboard", h.getDashboard)
		v1.GET("/gpus", h.getGPUs)
		v1.GET("/workloads", h.getWorkloads)
		v1.GET("/recommendations", h.getRecommendations)
		v1.GET("/opportunities", h.getOpportunities)
		v1.GET("/costs", h.getCostHistory) 
		v1.GET("/costs/timeline", h.getCostTimeline)
		v1.GET("/costs/cluster", h.getClusterCost)
		v1.GET("/costs/nodes/:id", h.getNodeCost)
		v1.GET("/costs/namespaces/:id", h.getNamespaceCost)
		v1.GET("/cost/breakdown", h.getCostBreakdown)
		v1.GET("/alerts", h.getAlerts)
		v1.GET("/cluster", h.getClusters)
		v1.POST("/simulations", h.createSimulation)

		// Milestone 7: Recommendation Lifecycle
		v1.POST("/recommendations/:id/resolve", h.resolveRecommendation)
		v1.GET("/recommendations/resolved", h.getResolvedRecommendations)

		// Milestone 8: Safe Kubernetes Actions
		v1.POST("/actions/apply", h.applyAction)

		// Milestone 9: AI Assistant
		v1.POST("/assistant/chat", h.chatAssistant)
	}
}

func (h *Handler) getOpportunities(c *gin.Context) {
	// Mock returning opportunities
	successResponse(c, gin.H{"status": "opportunities data"})
}

func (h *Handler) getCostTimeline(c *gin.Context) {
	data, err := h.service.GetCostTimeline()
	if err != nil {
		errorResponse(c, err)
		return
	}
	successResponse(c, data)
}

func (h *Handler) getHealth(c *gin.Context) {
	successResponse(c, map[string]string{"status": "ok"})
}

func (h *Handler) getDashboard(c *gin.Context) {
	data, err := h.service.GetDashboardData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *Handler) getGPUs(c *gin.Context) {
	data, err := h.service.GetNodes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *Handler) getWorkloads(c *gin.Context) {
	data, err := h.service.GetWorkloads()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *Handler) getRecommendations(c *gin.Context) {
	data, err := h.service.GetRecommendations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *Handler) getCostHistory(c *gin.Context) {
	data, err := h.service.GetCostHistory()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *Handler) getCostBreakdown(c *gin.Context) {
	data, err := h.service.GetCostBreakdown()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *Handler) getAlerts(c *gin.Context) {
	data, err := h.service.GetAlerts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *Handler) getClusters(c *gin.Context) {
	data, err := h.service.GetClusters()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}
