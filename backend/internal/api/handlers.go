package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gpu-cost-optimizer-api/internal/auth"
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
	service   *services.Service
	authStore *auth.AuthStore
}

func NewHandler(s *services.Service, a *auth.AuthStore) *Handler {
	return &Handler{service: s, authStore: a}
}

func (h *Handler) RegisterRoutes(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	{
		// Authentication & Security APIs
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/register", h.authStore.RateLimitMiddleware(), h.registerUser)
			authGroup.POST("/login", h.authStore.RateLimitMiddleware(), h.loginUser)
			authGroup.POST("/logout", h.logoutUser)
			authGroup.POST("/forgot-password", h.authStore.RateLimitMiddleware(), h.requestPasswordReset)
			authGroup.POST("/reset-password", h.resetPassword)
			authGroup.GET("/me", h.authStore.AuthMiddleware(), h.getCurrentUser)
		}

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

		// Module 10: Reports Export
		v1.GET("/reports/export/csv", h.exportCSVReport)

		// Autonomous Cloud Infrastructure & Kubernetes Platform Modules
		v1.GET("/clusters/list", h.listClusters)
		v1.POST("/clusters/connect", h.connectCluster)
		v1.GET("/applications/list", h.listApplications)
		v1.POST("/applications/deploy", h.deployApplication)
		v1.POST("/applications/:id/scale", h.scaleApplication)
		v1.GET("/pipelines/list", h.listPipelines)
		v1.GET("/infrastructure/plan", h.getTerraformPlan)
		v1.GET("/logs/stream", h.getLogs)
		v1.GET("/autoscaling/policies", h.getAutoscalingPolicies)
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
