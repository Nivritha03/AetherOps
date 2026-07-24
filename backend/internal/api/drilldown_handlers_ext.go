package api

import "github.com/gin-gonic/gin"

func (h *Handler) getClusterCost(c *gin.Context) {
	// Mock response for drill-down foundation
	successResponse(c, gin.H{"clusterName": "prometheus-cluster", "totalCost": gin.H{"value": 1240.50, "confidence": "estimated"}})
}

func (h *Handler) getNodeCost(c *gin.Context) {
	id := c.Param("id")
	successResponse(c, gin.H{"nodeName": id, "cost": gin.H{"value": 182.00, "confidence": "estimated"}})
}

func (h *Handler) getNamespaceCost(c *gin.Context) {
	id := c.Param("id")
	successResponse(c, gin.H{"namespaceName": id, "cost": gin.H{"value": 45.00, "confidence": "estimated"}})
}
