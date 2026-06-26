package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gpu-cost-optimizer-api/internal/services"
)

type Handler struct {
	service *services.Service
}

func NewHandler(s *services.Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) RegisterRoutes(r *gin.Engine) {
	v1 := r.Group("/api")
	{
		v1.GET("/dashboard", h.getDashboard)
		v1.GET("/gpus", h.getGPUs)
		v1.GET("/workloads", h.getWorkloads)
		v1.GET("/recommendations", h.getRecommendations)
		v1.GET("/cost", h.getCostHistory)
		v1.GET("/cost/breakdown", h.getCostBreakdown)
		v1.GET("/alerts", h.getAlerts)
		v1.GET("/cluster", h.getClusters)
	}
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
